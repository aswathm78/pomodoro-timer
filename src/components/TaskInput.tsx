import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface TaskInputProps {
    task: string;
    onChangeTask: (text: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ task, onChangeTask }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={task}
                onChangeText={onChangeTask}
                placeholder="What are you working on?"
                placeholderTextColor="#666"
                textAlign="center"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        width: '80%',
    },
    input: {
        color: Colors.text,
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.surface,
        paddingBottom: 5,
    },
});
