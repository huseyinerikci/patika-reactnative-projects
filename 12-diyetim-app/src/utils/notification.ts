import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

export const scheduleNotification = async (
  id: string,
  title: string,
  body: string,
  date: Date,
) => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      android: {
        channelId: 'diet-reminder',
        smallIcon: 'ic_launcher', // Android icon
      },
    },
    trigger,
  );
};

export const cancelNotification = async (id: string) => {
  await notifee.cancelNotification(id);
};

export const createChannel = async () => {
  await notifee.createChannel({
    id: 'diet-reminder',
    name: 'Diet Reminder',
  });
};
