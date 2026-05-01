import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { TransactionProvider } from './src/context/TransactionContext';
import DashboardScreen from './src/screens/DashboardScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textLight,
            tabBarStyle: {
              backgroundColor: COLORS.white,
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              height: 65,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Inicio',
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{
              tabBarLabel: 'Adicionar',
              tabBarIcon: ({ color, size }) => (
                <Feather name="plus-circle" size={size + 4} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarLabel: 'Historico',
              tabBarIcon: ({ color, size }) => (
                <Feather name="list" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
}
