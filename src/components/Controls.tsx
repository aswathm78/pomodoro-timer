import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
// Note: expo-vector-icons is standard in managed workflow. I will stick to Text for guaranteed safety unless I check package.json, 
// but actually standard expo template includes it. I'll stick to text buttons with better styling as requested in plan to be safe or minimal.
// Let's use text but styled purely.

interface ControlsProps {
    isActive: boolean;
    onToggle: () => void;
    onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = React.memo(({ isActive, onToggle, onReset }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, isActive ? styles.pauseButton : styles.startButton]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>{isActive ? 'PAUSE' : 'START'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={onReset}
                activeOpacity={0.7}
            >
                <Text style={[styles.buttonText, styles.resetText]}>RESET</Text>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 20,
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 20,
        minWidth: 140,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    startButton: {
        backgroundColor: Colors.accent,
    },
    pauseButton: {
        backgroundColor: Colors.paused,
    },
    resetButton: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
    resetText: {
        color: Colors.text,
    },
});
