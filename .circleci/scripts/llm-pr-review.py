#!/usr/bin/env python3
"""
LLM-based PR review script for CircleCI.

Fetches the PR diff via the GitHub API, sends it to the LiteLLM endpoint
for a React Native/lunes-app-specific review, then posts (or updates) a
single comment on the PR. The step only comments — it never approves or
rejects.

This script always exits 0 so that LLM or network failures never block
a merge. Errors are printed to stderr and visible in the CI log.

Required environment variables (injected by CircleCI):
  CIRCLE_PULL_REQUEST      URL of the pull request associated with this
                           build (e.g. https://github.com/org/repo/pull/123),
                           only set when the current branch has an open PR.
                           Not populated for forked-PR builds unless secrets
                           are explicitly passed to fork builds.
  CIRCLE_PROJECT_USERNAME  Repository owner (org or user)
  CIRCLE_PROJECT_REPONAME  Repository name

Required secrets (CircleCI contexts):
  NB_LLM_API_TOKEN         API key for litellm.netzbegruenung.verdigado.net
                           (CircleCI context "digitalfabrik-llm-api")
  DELIVERINO_ACCESS_TOKEN  GitHub App installation access token for the
                           Deliverino app (requested by
                           .circleci/scripts/get_access_token.py, needs the
                           "Pull requests" or "Issues" write permission)
"""

import os
import sys

import requests

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

GITHUB_API_URL = "https://api.github.com"
LITELLM_BASE_URL = "https://litellm.netzbegruenung.verdigado.net"
LITELLM_MODEL = "verdigado-think"

COMMENT_MARKER = "<!-- llm-pr-review -->"

# Maximum diff size to send to the LLM (200 KB). Larger diffs are truncated.
MAX_DIFF_BYTES = 200_000

SYSTEM_PROMPT = """
You are a senior React Native/TypeScript engineer reviewing a pull request
for lunes-app, the mobile vocabulary trainer app (iOS & Android, built with
React Native and TypeScript) behind the Lunes project. The backend content
(jobs, units, words) is managed by the separate
lunes-cms project and consumed by this app via its API.

Analyse the diff and the commit messages and report on:
1. React/TypeScript correctness:
 - Prefer functional components and arrow functions (no class components).
 - React hooks should be named `useValue` if they return a value
   synchronously and `useLoadValue` if they load it asynchronously
   (existing convention).
 - Flag `any`, unsafe type assertions (`as X` without justification), or
   missing types on new functions/exported values — the project runs a
   strict `tsc --build` type check.
 - Watch for React hook dependency issues (missing/incorrect deps in
   `useEffect`/`useCallback`/`useMemo`) and obvious state management bugs
   (stale closures, unnecessary re-renders from inline objects/functions
   passed as props).
2. Platform parity: React Native changes (native modules, permissions,
 platform-specific files like `*.ios.tsx`/`*.android.tsx`, `Platform.OS`
 branches) should behave consistently on both iOS and Android unless a
 divergence is clearly intentional and explained.
3. Navigation: changes to `@react-navigation` screens/params should keep
 route param types in sync (e.g. in `src/navigation`) — flag navigation
 calls with params that don't match the declared param list.
4. Code quality gates: this repo enforces ESLint (airbnb + typescript-eslint
 + react-hooks, see `.eslintrc.js`) and Prettier via `yarn lint` and
 `yarn prettier --check .`. Flag obvious formatting drift, unjustified
 `eslint-disable` comments, or violations of rules already configured
 there (e.g. `no-magic-numbers`).
5. Security: watch for secrets (API keys, tokens) committed to source,
 sensitive user data written to `AsyncStorage` unencrypted, and unsafe
 handling of data fetched from the CMS API (e.g. rendering unsanitized
 HTML/markdown).
6. Testing: this repo places tests in a `__tests__` directory next to the
 file under test (see `docs/conventions.md`), using Jest and React Testing
 Library. New or changed behavior (components, hooks, services) should
 come with tests. If a PR changes a shared function's signature, check
 that all call sites (including tests and mocks in `src/__mocks__`) were
 updated.
7. Clean code & maintainability: flag dead code, duplicated logic that
 should be a shared component/hook/util, overly long components or
 functions doing too many things, unclear naming, and unnecessary
 complexity (e.g. a hand-rolled utility where an existing helper in
 `src/services`/`src/hooks` already does the job). Prefer small, focused,
 well-named units over clever one-offs — this is a long-lived app
 maintained by multiple contributors, so readability beats brevity.
8. Accessibility: this is a language-learning app used by a wide range of
 users, and the project already uses `jsx-a11y` (see `.eslintrc.js`) and
 `accessibilityLabel`/`accessibilityRole`/`accessible` props throughout
 `src`. New or changed interactive elements (buttons, touchables, inputs,
 images conveying meaning) should have appropriate accessibility props
 and sensible screen-reader labels/roles. Flag interactive elements with
 no accessible name, non-text content without an accessibility label, or
 touch targets that silently lost their accessibility props during a
 refactor.
9. Obvious typos in code, comments, file paths, identifiers, and
 documentation. Only flag clear spelling mistakes — do not nitpick
 stylistic word choices.
10. Commit message / PR title style. The repository convention (see
 `docs/conventions.md` and `git log`) is:
 - `<Issue key>: Your commit message`, e.g. "612: Add commit message
   documentation" — the issue key prefix should match the branch name's prefix.
 - Additional context (why the change is necessary) goes after a blank
   line in the body.
 - The commit message must be generally useful: it should clearly
   describe what changed and, in the body, why. Flag messages that are
   vague ("fix stuff", "update"), tautological ("change X to X"), or that
   don't explain a non-obvious change.
 Dependabot commits are exempt from these rules.
11. CircleCI config: `.circleci/config.yml` is auto-generated from
 `.circleci/src/{commands,jobs,workflows}/*.yml` via
 `yarn circleci:update-config`.

Be specific and reference file paths and line numbers where possible.
Be concise. Do not approve or reject — provide comments only.
"""


def require_env(name):
    value = os.environ.get(name)
    if not value:
        print(
            f"Error: required environment variable {name!r} is not set", file=sys.stderr
        )
        sys.exit(0)
    return value


def warn(message):
    print(f"Warning: {message}", file=sys.stderr)


def pr_number_from_url(pull_request_url):
    """
    Extracts the PR number from a CIRCLE_PULL_REQUEST URL, e.g.
    "https://github.com/org/repo/pull/123" -> "123".
    """
    return pull_request_url.rstrip("/").rsplit("/", 1)[-1]


def main():
    # -------------------------------------------------------------------------
    # Step 0: Only act on builds associated with an open pull request
    # -------------------------------------------------------------------------

    pull_request_url = os.environ.get("CIRCLE_PULL_REQUEST", "")
    if not pull_request_url:
        print(
            "Skipping LLM review: no open pull request is associated with this "
            "branch (CIRCLE_PULL_REQUEST is not set)."
        )
        return

    pr_number = pr_number_from_url(pull_request_url)

    # -------------------------------------------------------------------------
    # Step 1: Read environment
    # -------------------------------------------------------------------------

    repo_owner = require_env("CIRCLE_PROJECT_USERNAME")
    repo_name = require_env("CIRCLE_PROJECT_REPONAME")
    nb_llm_api_token = require_env("NB_LLM_API_TOKEN")
    github_token = require_env("DELIVERINO_ACCESS_TOKEN")

    auth_headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    # -------------------------------------------------------------------------
    # Step 2: Fetch the PR diff from GitHub
    # -------------------------------------------------------------------------

    pr_url = f"{GITHUB_API_URL}/repos/{repo_owner}/{repo_name}/pulls/{pr_number}"
    print(f"Fetching diff from {pr_url} ...")

    try:
        diff_response = requests.get(
            pr_url,
            headers={**auth_headers, "Accept": "application/vnd.github.v3.diff"},
            timeout=30,
        )
    except requests.RequestException as exc:
        warn(f"Could not reach GitHub API: {exc}")
        return

    if diff_response.status_code != 200:
        warn(
            f"Could not fetch diff (HTTP {diff_response.status_code}): "
            f"{diff_response.text[:200]}"
        )
        return

    diff_text = diff_response.text.strip()
    if not diff_text:
        print("No diff found — skipping LLM review.")
        return

    print(f"Diff fetched ({len(diff_text)} chars).")

    truncated = False
    if len(diff_text.encode()) > MAX_DIFF_BYTES:
        diff_text = diff_text.encode()[:MAX_DIFF_BYTES].decode(errors="replace")
        truncated = True
        print(f"Diff truncated to {MAX_DIFF_BYTES} bytes for LLM input.")

    # -------------------------------------------------------------------------
    # Step 2b: Fetch the PR commit messages from GitHub
    # -------------------------------------------------------------------------

    commits_url = f"{pr_url}/commits"
    print(f"Fetching commits from {commits_url} ...")

    commit_messages_block = ""
    try:
        commits_response = requests.get(
            commits_url,
            headers=auth_headers,
            timeout=30,
        )
        if commits_response.status_code == 200:
            commit_lines = []
            for commit in commits_response.json():
                sha = commit.get("sha", "")[:8]
                message = commit.get("commit", {}).get("message", "").rstrip()
                commit_lines.append(f"--- commit {sha} ---\n{message}")
            if commit_lines:
                commit_messages_block = "\n\n".join(commit_lines)
                print(f"Fetched {len(commit_lines)} commit message(s).")
        else:
            warn(
                f"Could not fetch commits (HTTP {commits_response.status_code}): "
                f"{commits_response.text[:200]}"
            )
    except requests.RequestException as exc:
        warn(f"Could not fetch commits: {exc}")

    # -------------------------------------------------------------------------
    # Step 3: Send diff to LiteLLM
    # -------------------------------------------------------------------------

    chat_url = f"{LITELLM_BASE_URL}/v1/chat/completions"
    print(f"Sending diff to LiteLLM ({LITELLM_MODEL}) ...")

    user_content_parts = []
    if commit_messages_block:
        user_content_parts.append(
            "Commit messages in this PR:\n\n" + commit_messages_block
        )
    user_content_parts.append("Diff:\n\n" + diff_text)
    user_content = "\n\n".join(user_content_parts)
    if truncated:
        user_content += "\n\n[Diff was truncated to 200 KB]"

    try:
        llm_response = requests.post(
            chat_url,
            headers={
                "Authorization": f"Bearer {nb_llm_api_token}",
                "Content-Type": "application/json",
            },
            json={
                "model": LITELLM_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content},
                ],
            },
            timeout=300,
        )
    except requests.RequestException as exc:
        warn(f"Could not reach LiteLLM: {exc}")
        return

    if llm_response.status_code != 200:
        warn(
            f"LiteLLM returned HTTP {llm_response.status_code}: "
            f"{llm_response.text[:200]}"
        )
        return

    llm_data = llm_response.json()
    review_text = (
        llm_data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    )
    if not review_text:
        warn("LLM returned an empty review.")
        return

    print("LLM review received.")

    # -------------------------------------------------------------------------
    # Step 4: Find existing bot comment (identified by marker)
    # -------------------------------------------------------------------------

    comments_url = (
        f"{GITHUB_API_URL}/repos/{repo_owner}/{repo_name}/issues/{pr_number}/comments"
    )
    print("Checking for existing LLM review comment ...")

    try:
        comments_response = requests.get(
            comments_url,
            headers=auth_headers,
            timeout=30,
        )
    except requests.RequestException as exc:
        warn(f"Could not fetch comments: {exc}")
        return

    if comments_response.status_code != 200:
        warn(
            f"Could not fetch comments (HTTP {comments_response.status_code}): "
            f"{comments_response.text[:200]}"
        )
        return

    existing_comment_id = None
    for comment in comments_response.json():
        if COMMENT_MARKER in comment.get("body", ""):
            existing_comment_id = comment["id"]
            break

    # -------------------------------------------------------------------------
    # Step 5: Post or update the comment
    # -------------------------------------------------------------------------

    comment_body = (
        f"{COMMENT_MARKER}\n" f"### LLM Review ({LITELLM_MODEL})\n\n" f"{review_text}\n"
    )

    post_headers = {**auth_headers, "Content-Type": "application/json"}

    try:
        if existing_comment_id:
            update_url = (
                f"{GITHUB_API_URL}/repos/{repo_owner}/{repo_name}"
                f"/issues/comments/{existing_comment_id}"
            )
            print(f"Updating existing comment {existing_comment_id} ...")
            resp = requests.patch(
                update_url,
                headers=post_headers,
                json={"body": comment_body},
                timeout=30,
            )
        else:
            print("Posting new comment ...")
            resp = requests.post(
                comments_url,
                headers=post_headers,
                json={"body": comment_body},
                timeout=30,
            )
    except requests.RequestException as exc:
        warn(f"Could not post comment: {exc}")
        return

    if resp.status_code not in (200, 201):
        warn(f"Could not post comment (HTTP {resp.status_code}): " f"{resp.text[:200]}")
        return

    print("LLM review comment posted successfully.")


if __name__ == "__main__":
    main()
