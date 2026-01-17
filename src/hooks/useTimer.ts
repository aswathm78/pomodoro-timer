import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Vibration, Platform } from 'react-native';

type TimerMode = 'work' | 'break';

// Remote sound file for notification (short beep)
const SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

export const useTimer = (workDuration: number, breakDuration: number) => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(workDuration);
    const [isActive, setIsActive] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);

    // Update timeLeft if duration changes while inactive and in matching mode
    useEffect(() => {
        if (!isActive) {
            if (mode === 'work' && timeLeft === workDuration) return; // Already matching
            // If the duration setting changed, we might want to reset or adjust.
            // For simplicity, if inactive, reset to new duration.
            setTimeLeft(mode === 'work' ? workDuration : breakDuration);
        }
    }, [workDuration, breakDuration]);

    // Cleanup sound
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const playSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.replayAsync();
            } else {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: SOUND_URL },
                    { shouldPlay: true }
                );
                soundRef.current = sound;
            }
        } catch (error) {
            console.log('Error playing sound', error);
        }
        // Vibrate as backup/complement
        if (Platform.OS !== 'web') {
            Vibration.vibrate();
        }
    };

    const switchMode = useCallback(() => {
        const nextMode = mode === 'work' ? 'break' : 'work';
        const nextTime = nextMode === 'work' ? workDuration : breakDuration;

        playSound(); // Play sound on completion/switch

        setMode(nextMode);
        setTimeLeft(nextTime);
        setIsActive(false);
    }, [mode, workDuration, breakDuration]);

    const toggleTimer = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? workDuration : breakDuration);
    }, [mode, workDuration, breakDuration]);

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

    return {
        timeLeft,
        isActive,
        mode,
        toggleTimer,
        resetTimer,
        totalTime: mode === 'work' ? workDuration : breakDuration,
    };
};
