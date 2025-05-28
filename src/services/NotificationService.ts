import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native'

import Theme from '../constants/theme'
import { getLabels } from './helpers'
import { reportError } from './sentry'

const LUNES_NOTIFICATION_ICON = 'ic_notification_icon'

const REPETITION_REMINDER_ID = 'repetition-reminder'

export default class NotificationService {
  public static scheduleRepetitionReminder = async (date: Date): Promise<void> => {
    const { title, body, channelName } = getLabels().repetition.reminder

    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'reminders',
      name: channelName,
      badge: true,
      importance: AndroidImportance.LOW,
    })

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      alarmManager: false,
    }

    try {
      await notifee.createTriggerNotification(
        {
          title,
          body,
          // provide an id, so that rescheduling this notification will update the previous one
          id: REPETITION_REMINDER_ID,
          android: {
            channelId,
            smallIcon: LUNES_NOTIFICATION_ICON,
            color: Theme.colors.primary,
          },
        },
        trigger,
      )
    } catch (e) {
      reportError(e)
    }
  }

  public static clearRepetitionReminder = async (): Promise<void> => {
    await notifee.cancelNotification(REPETITION_REMINDER_ID)
  }
}
