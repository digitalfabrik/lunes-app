/* eslint-disable camelcase */
import { program } from 'commander'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

import {
  GITKEEP_FILE,
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  RELEASE_NOTES_DIR,
  UNRELEASED_DIR,
  DEFAULT_NOTES,
} from './constants'

// Release notes
type Platform = 'ios' | 'android'
type NoteType = {
  show_in_stores: boolean
  issue_key: string
  platforms: Platform
  de: string
}
type ParseOptions = {
  destination?: string
  source: string
  ios: boolean
  android: boolean
  production: boolean
}
const MAX_RELEASE_NOTES_LENGTH = 500

const formatNotes = (params: { notes: NoteType[]; production: boolean; platformName?: string }) => {
  const { notes, production, platformName } = params
  const defaultReleaseNote = production ? DEFAULT_NOTES : ''

  const formattedNotes = notes
    .map(note => {
      // Double quotes make mattermost status alerts fail
      const escapedNote = note.de.replace(/"/g, "'")
      return production ? `* ${escapedNote}` : `* [ ${note.issue_key} ] ${escapedNote}`
    })
    .reduce((text, note) => {
      // Make sure release notes don't get longer than the maximal allowed length
      if (production && text.length + note.length > MAX_RELEASE_NOTES_LENGTH) {
        return text
      }
      if (text.length === 0) {
        return note
      }
      return `${text}\n${note}`
    }, defaultReleaseNote)

  return platformName && formattedNotes ? `\n${platformName}:\n${formattedNotes}` : formattedNotes
}

const isNoteRelevant = ({ note, platforms }: { note: NoteType; platforms: string[] }) =>
  platforms.some(platform => note.platforms.includes(platform))
const isNoteCommon = ({ note, platforms }: { note: NoteType; platforms: string[] }) =>
  platforms.every(platform => note.platforms.includes(platform))

// Format the release notes for development purposes with all available information
const formatDevelopmentNotes = (params: { notes: NoteType[]; platforms: string[] }) => {
  const { notes, platforms } = params
  const emptyNotesMap = {
    common: [] as NoteType[],
    android: [] as NoteType[],
    ios: [] as NoteType[],
  }
  // Group notes by platform
  const notesMap = notes.reduce((notesMap, note) => {
    if (isNoteCommon({ note, platforms })) {
      notesMap.common.push(note)
    } else if (isNoteRelevant({ note, platforms: [PLATFORM_ANDROID] })) {
      notesMap.android.push(note)
    } else if (isNoteRelevant({ note, platforms: [PLATFORM_IOS] })) {
      notesMap.ios.push(note)
    }
    return notesMap
  }, emptyNotesMap)

  const commonNotes = formatNotes({ notes: notesMap.common, production: false })
  const androidNotes = formatNotes({
    notes: notesMap.android,
    production: false,
    platformName: PLATFORM_ANDROID,
  })
  const iosNotes = formatNotes({ notes: notesMap.ios, production: false, platformName: PLATFORM_IOS })

  const releaseNotes = `${commonNotes}${androidNotes}${iosNotes}`
  return `Release Notes:\n${releaseNotes || 'No release notes found. Looks like nothing happened for a while.'}`
}

const parseReleaseNotes = ({ source, ios, android, production }: ParseOptions): string => {
  const platforms: string[] = [android ? PLATFORM_ANDROID : undefined, ios ? PLATFORM_IOS : undefined].filter(
    (platform): platform is string => !!platform
  )

  if (platforms.length === 0) {
    throw new Error('No platforms selected! Use --ios and --android flags.')
  } else if (platforms.length > 1 && production) {
    // e.g. play store release notes should not contain ios release infos
    throw new Error('Usage of multiple platforms in production mode is not supported.')
  }

  const fileNames = fs.existsSync(source) ? fs.readdirSync(source) : []
  if (fileNames.length === 0) {
    console.warn(`No release notes found in source ${source}. Using default notes.`)
  }

  const asNoteType = (as: unknown): NoteType => as as NoteType

  // Load all notes not belonging to a release
  const relevantNotes = fileNames
    .filter(fileName => fileName !== GITKEEP_FILE)
    .map(fileName => asNoteType(yaml.load(fs.readFileSync(`${source}/${fileName}`, 'utf-8'))))
    .filter(note => isNoteRelevant({ note, platforms }))

  // If the production flag is set, hide information that is irrelevant for users
  if (production) {
    const productionNotes = relevantNotes.filter(note => note.show_in_stores)
    return formatNotes({ notes: productionNotes, production })
  }

  return formatDevelopmentNotes({ notes: relevantNotes, platforms })
}

const parseNotesProgram = (options: ParseOptions) => {
  try {
    const { destination } = options
    const notes = parseReleaseNotes(options)

    if (destination) {
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      fs.writeFileSync(destination, notes)
    }

    // Log to enable bash piping
    console.log(JSON.stringify(notes))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

program
  .command('parse-release-notes')
  .description(
    'parse the release notes and outputs the release notes as JSON string and writes them to the specified file'
  )
  .option('--ios', 'include release notes for ios')
  .option('--android', 'include release notes for android')
  .option(
    '--production',
    'whether to hide extra information, e.g. issue keys, hidden notes and platforms and prepare the notes for a store. may not be used with multiple platforms.'
  )
  .option('--destination <destination>', 'if specified the parsed notes are saved to the directory')
  .requiredOption(
    '--source <source>',
    'the directory of the release notes to parse',
    `../${RELEASE_NOTES_DIR}/${UNRELEASED_DIR}`
  )
  .action(parseNotesProgram)

// General store metadata
type StoreName = 'appstore' | 'playstore'

const metadataPath = (storeName: StoreName) =>
  `../${storeName === 'appstore' ? 'ios' : 'android'}/fastlane/metadata/de-DE`

const writeMetadata = (storeName: string, overrideVersionName?: string) => {
  if (storeName !== 'appstore' && storeName !== 'playstore') {
    throw new Error(`Invalid store name ${storeName} passed!`)
  }

  const path = metadataPath(storeName)
  fs.mkdirSync(path, {
    recursive: true,
  })

  // Prepare release notes
  const platforms = { ios: storeName === 'appstore', android: storeName === 'playstore' }
  const source = `../${RELEASE_NOTES_DIR}/${overrideVersionName ?? UNRELEASED_DIR}`
  const releaseNotesPath = `${metadataPath(storeName)}${storeName === 'playstore' ? '/changelogs' : ''}`
  fs.mkdirSync(releaseNotesPath, { recursive: true })

  const destination = `${releaseNotesPath}/${storeName === 'appstore' ? 'release_notes.txt' : 'default.txt'}`
  parseNotesProgram({ ...platforms, production: true, destination, source })

  console.warn(`${storeName} metadata successfully written.`)
}

program
  .command('prepare-metadata <storeName>')
  .description('prepare metadata for store')
  .option(
    '--override-version-name <override-version-name>',
    'if specified the release notes will be generated from the specified version name instead of the unreleased notes'
  )
  .action((storeName: string, options: { overrideVersionName: string }) => {
    try {
      const { overrideVersionName } = options
      writeMetadata(storeName, overrideVersionName)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
