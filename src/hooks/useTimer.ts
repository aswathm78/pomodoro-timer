import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { Vibration, Platform } from 'react-native';
import { sendNotification } from '../services/Notifications';
import Constants from 'expo-constants';
import { BACKGROUND_SOUNDS, NOTIFICATION_SOUNDS } from '../constants/Sounds';

type TimerMode = 'work' | 'break' | 'longBreak';



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
    // Audio Players
    const notificationPlayer = useAudioPlayer(NOTIFICATION_SOUNDS.bell.url);
    const rainPlayer = useAudioPlayer(BACKGROUND_SOUNDS.rain.url);
    const whiteNoisePlayer = useAudioPlayer(BACKGROUND_SOUNDS.white_noise.url);
    const forestPlayer = useAudioPlayer(BACKGROUND_SOUNDS.forest.url);
    const cafePlayer = useAudioPlayer(BACKGROUND_SOUNDS.cafe.url);
    const gammaPlayer = useAudioPlayer(BACKGROUND_SOUNDS.gamma.url);

    useEffect(() => {
        // Configure looping for background sounds
        rainPlayer.loop = true;
        whiteNoisePlayer.loop = true;
        forestPlayer.loop = true;
        cafePlayer.loop = true;
        gammaPlayer.loop = true;
    }, [rainPlayer, whiteNoisePlayer, forestPlayer, cafePlayer, gammaPlayer]);

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
            if (forestPlayer.playing) await forestPlayer.pause();
            if (cafePlayer.playing) await cafePlayer.pause();
            if (gammaPlayer.playing) await gammaPlayer.pause();

            if (isActive && mode === 'work') {
                const playerMap: Record<string, any> = {
                    rain: rainPlayer,
                    white_noise: whiteNoisePlayer,
                    forest: forestPlayer,
                    cafe: cafePlayer,
                    gamma: gammaPlayer
                };

                const player = playerMap[backgroundSoundType];
                if (player) {
                    player.volume = 0.5;
                    player.play();
                }
            }
        };
        manageAudio();

        // Cleanup on unmount or change
        return () => {
            // We can't easily wait here in cleanup, but effect re-run handles it
        };
    }, [isActive, mode, backgroundSoundType, rainPlayer, whiteNoisePlayer, forestPlayer, cafePlayer, gammaPlayer]);

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
