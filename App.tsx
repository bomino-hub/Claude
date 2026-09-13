import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FinanceProvider } from './src/context/FinanceContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <FinanceProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </FinanceProvider>
  );
}
