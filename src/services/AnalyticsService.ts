import DeviceInfo from 'react-native-device-info'

export type AnalyticsEvent = {
  name: string
  payload?: Record<string, unknown>
  timestamp?: Date | string
}

export type TrackingData = {
  installationId: string
  trackingConsentDate: string | null
}

export class AnalyticsService {
  private installationId!: string
  private trackingConsentDate: string | null = null
  private cmsAnalyticsEndpoint: string

  constructor(cmsAnalyticsEndpoint: string) {
    this.cmsAnalyticsEndpoint = cmsAnalyticsEndpoint
  }

  async init(): Promise<void> {
    this.installationId = await DeviceInfo.getUniqueId()
  }

  setTrackingConsent(consentGiven: boolean): void {
    this.trackingConsentDate = consentGiven ? new Date().toISOString() : null
  }

  private canTrack(): boolean {
    return this.trackingConsentDate !== null
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.canTrack()) {
      return
    }

    const data: TrackingData & AnalyticsEvent = {
      ...event,
      installationId: this.installationId,
      trackingConsentDate: this.trackingConsentDate,
      timestamp: event.timestamp ?? new Date().toISOString(),
    }

    try {
      await fetch(this.cmsAnalyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      throw new Error(`Analytics event could not be sent: ${message}`)
    }
  }
}
