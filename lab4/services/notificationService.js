import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Помилка', 'Не вдалося отримати дозвіл на push-сповіщення!');
    return false;
  }
  return true;
}

export function setupNotificationListeners() {
    const notificationInteractionSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      const taskId = response.notification.request.content.data?.taskId;
      if (taskId) {
        Alert.alert("Сповіщення натиснуто!", `Ви натиснули на сповіщення для завдання з ID: ${taskId}`);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationInteractionSubscription);
    };
}


export async function scheduleTaskNotification(task) {
  const trigger = new Date(task.reminderTime);
  if (trigger.getTime() <= Date.now()) {
    Alert.alert("Увага", "Час нагадування вже минув для завдання: " + task.title + ". Сповіщення не буде заплановано.");
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Нагадування: " + task.title,
        body: task.description || 'Час виконати завдання!',
        data: { taskId: task.id },
      },
      trigger,
    });
    return notificationId;
  } catch (e) {
    console.error("Помилка планування сповіщення:", e);
    Alert.alert("Помилка", "Не вдалося запланувати сповіщення для: " + task.title);
    return null;
  }
}

export async function cancelTaskNotification(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Заплановане сповіщення скасовано:', notificationId);
  } catch (e) {
    console.error("Помилка скасування сповіщення:", e);
    Alert.alert("Помилка", "Не вдалося скасувати заплановане сповіщення.");
  }
}