import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TeamProvider } from './src/contexts/TeamContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { SelectSportScreen } from './src/screens/SelectSportScreen';
import { CreateTeamScreen } from './src/screens/CreateTeamScreen';
import { SportType } from './src/types';
import { COLORS } from './src/config/sports';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthScreen = 'onboarding' | 'login' | 'signup' | 'selectSport' | 'createTeam' | 'app';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('onboarding');
  const [selectedSport, setSelectedSport] = useState<SportType>('volleyball');
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [checkingFirstLaunch, setCheckingFirstLaunch] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (!authLoading && !checkingFirstLaunch) {
      if (user) {
        setCurrentScreen('app');
      } else {
        setCurrentScreen(isFirstLaunch ? 'onboarding' : 'login');
      }
    }
  }, [user, authLoading, checkingFirstLaunch, isFirstLaunch]);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
    } catch (error) {
      console.error('Error checking first launch:', error);
    } finally {
      setCheckingFirstLaunch(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  if (authLoading || checkingFirstLaunch) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen onNavigateToSignUp={() => setCurrentScreen('signup')} />;
  }

  if (currentScreen === 'signup') {
    return <SignUpScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'selectSport') {
    return (
      <SelectSportScreen
        onSelect={(sport) => {
          setSelectedSport(sport);
          setCurrentScreen('createTeam');
        }}
      />
    );
  }

  if (currentScreen === 'createTeam') {
    return (
      <CreateTeamScreen
        sport={selectedSport}
        onComplete={() => setCurrentScreen('app')}
      />
    );
  }

  return (
    <TeamProvider>
      <AppNavigator />
    </TeamProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  }
});
