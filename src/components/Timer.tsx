import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const size = width * 0.8;
const strokeWidth = 20;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

interface TimerProps {
    timeLeft: number;
    totalTime: number;
    mode: 'work' | 'break' | 'longBreak';
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime, mode }) => {
    const progress = timeLeft / totalTime;
    const strokeDashoffset = circumference - progress * circumference;

    const color = mode === 'work' ? Colors.primary : Colors.secondary;

    const getModeText = () => {
        switch (mode) {
            case 'work': return 'FOCUS';
            case 'break': return 'BREAK';
            case 'longBreak': return 'LONG BREAK';
        }
    };

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    stroke={Colors.surface}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <Circle
                    stroke={color}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    fill="none"
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={styles.timeContainer}>
                <Text style={[styles.timeText, { color }]}>{formatTime(timeLeft)}</Text>
                <Text style={styles.modeText}>{getModeText()}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginVertical: 40,
    },
    timeContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 72,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    modeText: {
        fontSize: 24,
        color: Colors.text,
        marginTop: 10,
        letterSpacing: 4,
        fontWeight: '600',
    },
});
