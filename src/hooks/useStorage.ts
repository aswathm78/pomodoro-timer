import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const SESSIONS_KEY = '@pomodoro_sessions';

export interface SessionRecord {
    date: string;
    count: number;
}

export const useStorage = () => {
    const [history, setHistory] = useState<SessionRecord[]>([]);

    const loadHistory = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SESSIONS_KEY);
            if (jsonValue != null) {
                setHistory(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error('Failed to load sessions', e);
        }
    };

    const saveSession = async () => {
        const today = new Date().toISOString().split('T')[0];
        let newHistory = [...history];
        const todayIndex = newHistory.findIndex((h) => h.date === today);

        if (todayIndex >= 0) {
            newHistory[todayIndex].count += 1;
        } else {
            newHistory.push({ date: today, count: 1 });
        }

        // Keep only last 7 days for simplicity
        if (newHistory.length > 7) {
            newHistory = newHistory.slice(newHistory.length - 7);
        }

        try {
            await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(newHistory));
            setHistory(newHistory);
        } catch (e) {
            console.error('Failed to save session', e);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return { history, saveSession };
};
