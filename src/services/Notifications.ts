import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Set up notification handler with explicit type
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    } as any),
});

export const setupNotifications = async () => {
    // Check if running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';

    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        } catch (e) {
            console.warn("Failed to set notification channel", e);
            if (isExpoGo) return false;
        }
    }

    let finalStatus = 'undetermined';
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
    } catch (e) {
        console.warn("Failed to get push permissions", e);
        // In Expo Go, this might fail on Android if the service is missing
    }

    return finalStatus === 'granted';
};

export const sendNotification = async (title: string, body: string) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: null,
        });
    } catch (e) {
        console.warn("Failed to schedule notification", e);
    }
};
