import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    workTime: number;
    breakTime: number;
    longBreakTime: number;
    keepScreenOn: boolean;
    backgroundSound: string; // 'none' | 'rain' | 'white_noise'
    onSave: (settings: { work: number; breakVal: number; longBreak: number; screenOn: boolean; sound: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    visible,
    onClose,
    workTime,
    breakTime,
    longBreakTime,
    keepScreenOn,
    backgroundSound,
    onSave,
}) => {
    const [work, setWork] = useState(String(Math.floor(workTime / 60)));
    const [breakVal, setBreakVal] = useState(String(Math.floor(breakTime / 60)));
    const [longBreak, setLongBreak] = useState(String(Math.floor(longBreakTime / 60)));
    const [screenOn, setScreenOn] = useState(keepScreenOn);
    const [sound, setSound] = useState(backgroundSound);

    const handleSave = () => {
        const w = parseInt(work, 10);
        const b = parseInt(breakVal, 10);
        const lb = parseInt(longBreak, 10);
        if (!isNaN(w) && !isNaN(b) && !isNaN(lb)) {
            onSave({
                work: w * 60,
                breakVal: b * 60,
                longBreak: lb * 60,
                screenOn,
                sound,
            });
            onClose();
        }
    };

    const sounds = [
        { id: 'none', label: 'None' },
        { id: 'rain', label: 'Rain' },
        { id: 'white_noise', label: 'White Noise' },
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Settings</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Focus Duration (min)</Text>
                            <TextInput
                                style={styles.input}
                                value={work}
                                onChangeText={setWork}
                                keyboardType="number-pad"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Break Duration (min)</Text>
                            <TextInput
                                style={styles.input}
                                value={breakVal}
                                onChangeText={setBreakVal}
                                keyboardType="number-pad"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Long Break Duration (min)</Text>
                            <TextInput
                                style={styles.input}
                                value={longBreak}
                                onChangeText={setLongBreak}
                                keyboardType="number-pad"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.rowContainer}>
                            <Text style={styles.label}>Keep Screen On</Text>
                            <Switch
                                value={screenOn}
                                onValueChange={setScreenOn}
                                trackColor={{ false: '#444', true: Colors.primary }}
                                thumbColor={screenOn ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Background Sound</Text>
                            <View style={styles.soundButtons}>
                                {sounds.map((s) => (
                                    <TouchableOpacity
                                        key={s.id}
                                        style={[
                                            styles.soundButton,
                                            sound === s.id && styles.activeSoundButton,
                                        ]}
                                        onPress={() => setSound(s.id)}
                                    >
                                        <Text style={[
                                            styles.soundButtonText,
                                            sound === s.id && styles.activeSoundButtonText
                                        ]}>{s.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        maxHeight: '80%',
        backgroundColor: Colors.surface,
        padding: 20,
        borderRadius: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        color: Colors.text,
        marginBottom: 5,
    },
    input: {
        backgroundColor: Colors.background,
        color: Colors.text,
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    soundButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 5,
    },
    soundButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#444',
    },
    activeSoundButton: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    soundButtonText: {
        color: Colors.text,
        fontSize: 14,
    },
    activeSoundButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#444',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
