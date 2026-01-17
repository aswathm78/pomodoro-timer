import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    workTime: number;
    breakTime: number;
    onSave: (work: number, breakTime: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    visible,
    onClose,
    workTime,
    breakTime,
    onSave,
}) => {
    const [work, setWork] = useState(String(Math.floor(workTime / 60)));
    const [breakVal, setBreakVal] = useState(String(Math.floor(breakTime / 60)));

    const handleSave = () => {
        const w = parseInt(work, 10);
        const b = parseInt(breakVal, 10);
        if (!isNaN(w) && !isNaN(b)) {
            onSave(w * 60, b * 60);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Settings</Text>

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
        width: '80%',
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
