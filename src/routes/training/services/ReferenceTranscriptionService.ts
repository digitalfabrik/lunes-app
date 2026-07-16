import { CachesDirectoryPath, downloadFile, unlink } from '@dr.pogodin/react-native-fs'
import { transcribeAudioFile } from 'react-native-speech-to-text'

import { log } from '../../../services/sentry'

// Reference transcripts are deterministic per audio file, so they are cached for the session
// (keyed by URL) to avoid re-downloading and re-transcribing on every attempt or retry.
const referenceTranscriptsCache = new Map<string, Promise<string[] | null>>()

// Constants for a small deterministic string hash (see hashUrl).
const HASH_SEED = 7
const HASH_PRIME = 31
const HASH_MODULO = 1_000_000_007
const HASH_RADIX = 36

// Deterministic, filesystem-safe short name derived from the URL, so concurrent words don't clash.
const hashUrl = (url: string): string =>
  Array.from(url)
    .reduce((hash, character) => (hash * HASH_PRIME + character.charCodeAt(0)) % HASH_MODULO, HASH_SEED)
    .toString(HASH_RADIX)

// Preserve the source extension (the CMS serves .mp3). iOS Core Audio picks its decoder from the
// file extension, so a generic name like "ref-x.audio" fails to open with "Öffnen fehlgeschlagen".
const fileExtensionFromUrl = (url: string): string => {
  const lastSegment = (url.split('?')[0] ?? '').split('/').pop() ?? ''
  return lastSegment.includes('.') ? lastSegment.slice(lastSegment.lastIndexOf('.')) : '.mp3'
}

const downloadAndTranscribe = async (audioUrl: string, hints: string[]): Promise<string[] | null> => {
  const localPath = `${CachesDirectoryPath}/ref-${hashUrl(audioUrl)}${fileExtensionFromUrl(audioUrl)}`
  try {
    await downloadFile({ fromUrl: audioUrl, toFile: localPath }).promise
    const transcripts = await transcribeAudioFile(localPath, hints)
    if (transcripts.length === 0) {
      log(`Reference audio transcription returned no transcripts for ${audioUrl}`, 'warning')
      return null
    }
    return transcripts
  } catch (error) {
    // Non-fatal by design (the exercise falls back to the written-word comparison) and expected in
    // normal operation (offline, or audio files the recognizer cannot decode), so only a breadcrumb.
    const errorCode = (error as { code?: string }).code
    log(`Reference audio transcription failed (${errorCode ?? String(error)}) for ${audioUrl}`, 'warning')
    return null
  } finally {
    unlink(localPath).catch(() => undefined)
  }
}

// Transcribes the reference pronunciation audio with the same on-device recognizer as the user's
// speech, so a word with unusual pronunciation is misheard identically on both sides. Resolves to
// null when no reference transcript is available (missing audio or transcription not possible).
export const getReferenceTranscripts = (audioUrl: string | null, hints: string[] = []): Promise<string[] | null> => {
  if (!audioUrl) {
    return Promise.resolve(null)
  }

  const cached = referenceTranscriptsCache.get(audioUrl)
  if (cached) {
    return cached
  }

  const transcriptsPromise = downloadAndTranscribe(audioUrl, hints)
  referenceTranscriptsCache.set(audioUrl, transcriptsPromise)
  return transcriptsPromise
}
