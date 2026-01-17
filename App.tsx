import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTimer } from './src/hooks/useTimer';
import { Timer } from './src/components/Timer';
import { Controls } from './src/components/Controls';
import { SettingsModal } from './src/components/SettingsModal';
import { Colors } from './src/constants/Colors';

const SettingsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </Svg>
);

export default function App() {
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const { timeLeft, isActive, mode, toggleTimer, resetTimer, totalTime } = useTimer(workDuration, breakDuration);

  const handleSaveSettings = (newWork: number, newBreak: number) => {
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.title}>Pomodoro</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setIsSettingsVisible(true)}>
          <SettingsIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Timer timeLeft={timeLeft} totalTime={totalTime} mode={mode} isActive={isActive} />
        <Controls isActive={isActive} onToggle={toggleTimer} onReset={resetTimer} />
      </View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        workTime={workDuration}
        breakTime={breakDuration}
        onSave={handleSaveSettings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerSpacer: {
    width: 24, // Balance the settings icon
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
