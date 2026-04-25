import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import AgendaScreen from './screens/AgendaScreen';
import ConsultasScreen from './screens/ConsultasScreen';
import PerfilScreen from './screens/PerfilScreen';
import NotificacoesScreen from './screens/NotificacoesScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';
import EmergenciaScreen from './screens/EmergenciaScreen';
import ChatScreen from './screens/ChatScreen';
import PagamentoScreen from './screens/PagamentoScreen';

import PsicologoHomeScreen from './screens/PsicologoHomeScreen';
import ProntuariosScreen from './screens/ProntuariosScreen';
import PsicologoAgendaScreen from './screens/PsicologoAgendaScreen';
import ProntuarioDetalheScreen from './screens/ProntuarioDetalheScreen';
import PsicologoFinancasScreen from './screens/PsicologoFinancasScreen';
import PsicologoInboxScreen from './screens/PsicologoInboxScreen';

const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';
    switch (routeName) {
      case 'Agenda': icon = 'calendar'; break;
      case 'Consultas': icon = 'folder-open'; break;
    }
    // 👇 INJEÇÃO: Ícones laterais agora usam o Verde Sálvia (#BECFBB) quando selecionados 👇
    return <Ionicons name={icon} size={28} color={routeName === selectedTab ? '#BECFBB' : '#A0A0A0'} />;
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => (
    <TouchableOpacity onPress={() => navigate(routeName)} style={[styles.tabbarItem, { paddingBottom: insets.bottom }]}>
      {_renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );

  return (
    <CurvedBottomBar.Navigator
      type="UP" style={styles.bottomBar} shadowStyle={styles.shadow} height={(Platform.OS === 'ios' ? 85 : 70) + insets.bottom} circleWidth={55} bgColor="#131826" initialRouteName="Início" borderTopLeftRight screenOptions={{ headerShown: false }}
      renderCircle={({ selectedTab, navigate }) => {
        const isActive = selectedTab === 'Início';
        return (
          <Animated.View style={[
            styles.btnCircleUp,
            { bottom: (Platform.OS === 'ios' ? 30 : -25) + insets.bottom },
            isActive ? styles.btnCircleActive : styles.btnCircleInactive
          ]}>
            <TouchableOpacity style={styles.button} onPress={() => navigate('Início')}>
              <Ionicons name="home" color={isActive ? "#131826" : "#A0A0A0"} size={28} />
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen name="Agenda" position="LEFT" component={AgendaScreen} />
      <CurvedBottomBar.Screen name="Início" position="CENTER" component={HomeScreen} />
      <CurvedBottomBar.Screen name="Consultas" position="RIGHT" component={ConsultasScreen} />
    </CurvedBottomBar.Navigator>
  );
}

function PsicologoTabs() {
  const insets = useSafeAreaInsets();
  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';
    switch (routeName) {
      case 'Prontuarios': icon = 'document-text'; break;
      case 'Horarios': icon = 'time'; break;
    }
    // 👇 INJEÇÃO: Ícones laterais do Psicólogo também atualizados para o Verde Sálvia 👇
    return <Ionicons name={icon} size={28} color={routeName === selectedTab ? '#BECFBB' : '#A0A0A0'} />;
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => (
    <TouchableOpacity onPress={() => navigate(routeName)} style={[styles.tabbarItem, { paddingBottom: insets.bottom }]}>
      {_renderIcon(routeName, selectedTab)}
    </TouchableOpacity>
  );

  return (
    <CurvedBottomBar.Navigator
      type="UP" style={styles.bottomBar} shadowStyle={styles.shadow} height={(Platform.OS === 'ios' ? 85 : 70) + insets.bottom} circleWidth={55} bgColor="#131826" initialRouteName="PsicologoHome" borderTopLeftRight screenOptions={{ headerShown: false }}
      renderCircle={({ selectedTab, navigate }) => {
        const isActive = selectedTab === 'PsicologoHome';
        return (
          <Animated.View style={[
            styles.btnCircleUp,
            { bottom: (Platform.OS === 'ios' ? 30 : -25) + insets.bottom },
            isActive ? styles.btnCircleActive : styles.btnCircleInactive
          ]}>
            <TouchableOpacity style={styles.button} onPress={() => navigate('PsicologoHome')}>
              <Ionicons name="home" color={isActive ? "#131826" : "#A0A0A0"} size={28} />
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen name="Prontuarios" position="LEFT" component={ProntuariosScreen} />
      <CurvedBottomBar.Screen name="PsicologoHome" position="CENTER" component={PsicologoHomeScreen} />
      <CurvedBottomBar.Screen name="Horarios" position="RIGHT" component={PsicologoAgendaScreen} />
    </CurvedBottomBar.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PsicologoTabs" component={PsicologoTabs} />

        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
        <Stack.Screen name="Emergencia" component={EmergenciaScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Pagamentos" component={PagamentoScreen} />

        <Stack.Screen name="ProntuarioDetalhe" component={ProntuarioDetalheScreen} />
        <Stack.Screen name="PsicologoFinancas" component={PsicologoFinancasScreen} />
        <Stack.Screen name="PsicologoInbox" component={PsicologoInboxScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 10 },
  button: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomBar: { backgroundColor: 'transparent' },

  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnCircleActive: {
    backgroundColor: '#BECFBB',
    shadowColor: '#BECFBB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8
  },

  btnCircleInactive: {
    backgroundColor: '#2A3143',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },

  tabbarItem: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: Platform.OS === 'ios' ? -10 : 0 },
});