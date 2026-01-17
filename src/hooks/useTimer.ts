import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { Vibration, Platform } from 'react-native';
import { sendNotification } from '../services/Notifications';
import Constants from 'expo-constants';

type TimerMode = 'work' | 'break' | 'longBreak';

const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
const RAIN_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3';
const WHITE_NOISE_URL = 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3';

export const useTimer = (
    workDuration: number,
    breakDuration: number,
    longBreakDuration: number,
    backgroundSoundType: string,
    onSessionComplete: () => void
) => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(workDuration);
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Audio Players
    const notificationPlayer = useAudioPlayer(NOTIFICATION_SOUND_URL);
    const rainPlayer = useAudioPlayer(RAIN_SOUND_URL);
    const whiteNoisePlayer = useAudioPlayer(WHITE_NOISE_URL);

    useEffect(() => {
        // Configure looping for background sounds
        rainPlayer.loop = true;
        whiteNoisePlayer.loop = true;
    }, [rainPlayer, whiteNoisePlayer]);

    // Sync duration
    useEffect(() => {
        if (!isActive) {
            if (mode === 'work') setTimeLeft(workDuration);
            else if (mode === 'break') setTimeLeft(breakDuration);
            else if (mode === 'longBreak') setTimeLeft(longBreakDuration);
        }
    }, [workDuration, breakDuration, longBreakDuration, mode]);

    // Manage Background Audio
    useEffect(() => {
        const manageAudio = async () => {
            // Pause all first
            if (rainPlayer.playing) await rainPlayer.pause();
            if (whiteNoisePlayer.playing) await whiteNoisePlayer.pause();

            if (isActive && mode === 'work') {
                if (backgroundSoundType === 'rain') {
                    rainPlayer.volume = 0.5;
                    rainPlayer.play();
                } else if (backgroundSoundType === 'white_noise') {
                    whiteNoisePlayer.volume = 0.5;
                    whiteNoisePlayer.play();
                }
            }
        };
        manageAudio();

        // Cleanup on unmount or change
        return () => {
            // We can't easily wait here in cleanup, but effect re-run handles it
        };
    }, [isActive, mode, backgroundSoundType, rainPlayer, whiteNoisePlayer]);

    const playNotificationSound = async () => {
        try {
            notificationPlayer.seekTo(0);
            notificationPlayer.play();
        } catch (error) {
            console.warn('Error playing notification sound', error);
        }
        if (Platform.OS !== 'web') {
            Vibration.vibrate();
        }
    };

    const safeSendNotification = async (title: string, body: string) => {
        // Check if we are in Expo Go, where local notifications might be flaky or restricted if permissions fail
        // But typically local notifications work. However, let's wrap in try/catch to be safe.
        try {
            await sendNotification(title, body);
        } catch (e) {
            console.warn("Failed to send notification:", e);
        }
    }

    const switchMode = useCallback(() => {
        playNotificationSound();

        if (mode === 'work') {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);
            onSessionComplete();

            safeSendNotification('Session Complete', 'Time for a break!');

            if (newSessions % 4 === 0) {
                setMode('longBreak');
                setTimeLeft(longBreakDuration);
            } else {
                setMode('break');
                setTimeLeft(breakDuration);
            }
        } else {
            safeSendNotification('Break Over', 'Time to focus!');
            setMode('work');
            setTimeLeft(workDuration);
        }

        setIsActive(false);
    }, [mode, sessionsCompleted, breakDuration, longBreakDuration, workDuration, onSessionComplete, notificationPlayer]);

    const toggleTimer = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        if (mode === 'work') setTimeLeft(workDuration);
        else if (mode === 'break') setTimeLeft(breakDuration);
        else setTimeLeft(longBreakDuration);
    }, [mode, workDuration, breakDuration, longBreakDuration]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            switchMode();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, switchMode]);

    const totalTime = mode === 'work' ? workDuration : (mode === 'break' ? breakDuration : longBreakDuration);

    return {
        timeLeft,
        isActive,
        mode,
        sessionsCompleted,
        toggleTimer,
        resetTimer,
        totalTime,
    };
};
