import { TurboModuleRegistry, type TurboModule } from 'react-native'

// RN codegen requires interface instead of type to generate the native bridge
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Spec extends TurboModule {
  record(hints: string[]): Promise<Array<string>>
  stop(): Promise<void>
  openVoiceInputSettings(): Promise<void>
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpeechToText')
