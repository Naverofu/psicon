import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { Ionicons } from '@expo/vector-icons'; // Adaptado para o Expo
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // INSERIDO

// Importando as Telas do seu projeto
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import AgendaScreen from './screens/AgendaScreen';
import ConsultasScreen from './screens/ConsultasScreen';

const Stack = createNativeStackNavigator();

// Este componente cria a nossa barra curvada
function MainTabs() {
  const insets = useSafeAreaInsets(); // INSERIDO

  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';

    switch (routeName) {
      case 'Agenda': // TROCADO
        icon = 'calendar'; // TROCADO
        break;
      case 'Consultas':
        icon = 'folder-open';
        break;
    }

    return (
      <Ionicons
        name={icon}
        size={28}
        // Se estiver selecionado, usa o Ciano. Se não, Cinza.
        color={routeName === selectedTab ? '#05F2F2' : '#A0A0A0'}
      />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={[styles.tabbarItem, { paddingBottom: insets.bottom }]} // INSERIDO
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      type="UP"
      style={styles.bottomBar}
      shadowStyle={styles.shadow}
      // Altura responsiva com inserção do SafeArea
      height={(Platform.OS === 'ios' ? 85 : 70) + insets.bottom} // INSERIDO
      circleWidth={55}
      bgColor="#131826"
      initialRouteName="Início"
      borderTopLeftRight
      screenOptions={{ headerShown: false }}
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={[styles.btnCircleUp, { bottom: (Platform.OS === 'ios' ? 30 : -25) + insets.bottom }]}>
          {/* INSERIDO OVERRIDE DE BOTTOM PARA A BOLINHA ACOMPANHAR A BARRA */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate('Início')} // TROCADO
          >
            <Ionicons name="home" color="#131826" size={28} /> {/* TROCADO */}
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen
        name="Agenda" // TROCADO
        position="LEFT"
        component={AgendaScreen} // TROCADO
      />
      <CurvedBottomBar.Screen
        name="Início" // TROCADO
        position="CENTER"
        component={HomeScreen} // TROCADO
      />
      <CurvedBottomBar.Screen
        name="Consultas"
        position="RIGHT"
        component={ConsultasScreen}
      />
    </CurvedBottomBar.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos adaptados da biblioteca para a identidade do PsicOn
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    // Garante que a barra não fique com espaços brancos estranhos
    backgroundColor: 'transparent',
  },
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#05F2F2', // Ciano destaque da paleta PsicOn
    bottom: Platform.OS === 'ios' ? 30 : 18, // Posição do salto do botão
    shadowColor: '#05F2F2', // Sombra da mesma cor para dar brilho
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Ajuste para descer um pouco os ícones laterais e não colarem no topo da barra
    marginTop: Platform.OS === 'ios' ? -10 : 0,
  },
});