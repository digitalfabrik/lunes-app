import { TurboModuleRegistry, type TurboModule } from 'react-native'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Spec extends TurboModule {
  record(hints: string[]): Promise<Array<string>>
  stop(): Promise<void>
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpeechToText')
