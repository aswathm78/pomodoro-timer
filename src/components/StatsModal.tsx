import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { SessionRecord } from '../hooks/useStorage';

interface StatsModalProps {
    visible: boolean;
    onClose: () => void;
    history: SessionRecord[];
}

export const StatsModal: React.FC<StatsModalProps> = ({ visible, onClose, history }) => {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Weekly Activity</Text>

                    {history.length === 0 ? (
                        <Text style={styles.emptyText}>No sessions recorded yet.</Text>
                    ) : (
                        <View style={styles.list}>
                            {history.map((record) => (
                                <View key={record.date} style={styles.row}>
                                    <Text style={styles.date}>{record.date}</Text>
                                    <Text style={styles.count}>{record.count} sessions</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
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
        minHeight: 200,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    list: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    date: {
        color: Colors.text,
    },
    count: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: Colors.secondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 'auto',
    },
    buttonText: {
        color: '#111',
        fontWeight: 'bold',
    },
});
