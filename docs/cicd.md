# Continuous Integration and Delivery

## Content

- [Workflows](#workflows)
- [Fastlane](#fastlane)

## Workflows
Several workflows exist for different purposes:

- **commit**: Executed for all commits of PRs to ensure good code quality and working code.

## Fastlane
Fastlane is a task-runner for triggering build relevant tasks. It offers integration with XCode and the Android SDK for building and delivering the app.

### Fastlane Setup
- Make sure ruby is installed and `ruby --version` reports the correct version
- run `bundle config set --local path 'vendor/bundle` to set the local path
- run `bundle install` in the project root **AND** in `./android/` **AND** in `./ios/`.


### Lanes
To run a lane run `bundle exec fastlane [lane]`
