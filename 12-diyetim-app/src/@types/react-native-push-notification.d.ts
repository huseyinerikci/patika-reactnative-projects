declare module 'react-native-push-notification' {
  type LocalNotificationScheduleObject = {
    channelId?: string;
    id?: string;
    title: string;
    message: string;
    date: Date;
    allowWhileIdle?: boolean;
  };

  export function localNotificationSchedule(
    obj: LocalNotificationScheduleObject,
  ): void;

  export function cancelLocalNotifications(obj: { id: string }): void;

  export function createChannel(
    obj: { channelId: string; channelName: string },
    callback: (created: boolean) => void,
  ): void;

  const PushNotification: any;
  export default PushNotification;
}
