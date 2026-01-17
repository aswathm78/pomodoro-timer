import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useKeepAwake } from 'expo-keep-awake';
import { useTimer } from './src/hooks/useTimer';
import { useStorage } from './src/hooks/useStorage';
import { Timer } from './src/components/Timer';
import { Controls } from './src/components/Controls';
import { SettingsModal } from './src/components/SettingsModal';
import { StatsModal } from './src/components/StatsModal';
import { TaskInput } from './src/components/TaskInput';
import { Colors } from './src/constants/Colors';
import { setupNotifications } from './src/services/Notifications';

// Simple Icons
const SettingsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </Svg>
);

const StatsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 20V10" />
    <Path d="M12 20V4" />
    <Path d="M6 20v-6" />
  </Svg>
);

const KeepAwakeAgent = () => {
  useKeepAwake();
  return null;
};

export default function App() {
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60);
  const [keepScreenOn, setKeepScreenOn] = useState(false);
  const [backgroundSound, setBackgroundSound] = useState('none');
  const [task, setTask] = useState('');

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  useEffect(() => {
    setupNotifications();
  }, []);

  const { history, saveSession } = useStorage();

  const { timeLeft, isActive, mode, sessionsCompleted, toggleTimer, resetTimer, totalTime } = useTimer(
    workDuration,
    breakDuration,
    longBreakDuration,
    backgroundSound,
    () => {
      saveSession();
    }
  );

  const handleSaveSettings = (settings: any) => {
    setWorkDuration(settings.work);
    setBreakDuration(settings.breakVal);
    setLongBreakDuration(settings.longBreak);
    setKeepScreenOn(settings.screenOn);
    setBackgroundSound(settings.sound);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {keepScreenOn && <KeepAwakeAgent />}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsStatsVisible(true)}>
          <StatsIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Pomodoro</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsSettingsVisible(true)}>
          <SettingsIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TaskInput task={task} onChangeTask={setTask} />

        <Timer timeLeft={timeLeft} totalTime={totalTime} mode={mode} isActive={isActive} />

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Sessions: {sessionsCompleted}</Text>
        </View>

        <Controls isActive={isActive} onToggle={toggleTimer} onReset={resetTimer} />
      </View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        workTime={workDuration}
        breakTime={breakDuration}
        longBreakTime={longBreakDuration}
        keepScreenOn={keepScreenOn}
        backgroundSound={backgroundSound}
        onSave={handleSaveSettings}
      />

      <StatsModal
        visible={isStatsVisible}
        onClose={() => setIsStatsVisible(false)}
        history={history}
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
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    marginVertical: 10,
  },
  statsText: {
    color: '#888',
    fontSize: 16,
  },
});
