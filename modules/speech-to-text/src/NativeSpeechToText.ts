import { TurboModuleRegistry, type TurboModule } from 'react-native'

// Looks like codegen won't recognize this if we use the `type Spec = TurboModule & {...}` approach
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Spec extends TurboModule {
  record(hints: string[]): Promise<Array<string>>
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSpeechToText')
