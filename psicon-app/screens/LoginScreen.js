import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
// 👇 Biblioteca de memória adicionada aqui 👇
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('Atenção', 'Por favor, preencha seu e-mail e senha.');
      return;
    }

    try {
      const payloadLogin = {
        emailUsuario: email,
        senhaUsuario: senha
      };

      const response = await api.post('/usuarios/login', payloadLogin);
      const usuarioLogado = response.data;

      // 👇 A MÁGICA: Guardamos todos os dados do usuário no telemóvel 👇
      await AsyncStorage.setItem('usuarioData', JSON.stringify(usuarioLogado));

      // REDIRECIONAMENTO:
      if (usuarioLogado.tipoUsuario === "PSICOLOGO" ||
          usuarioLogado.emailUsuario.toLowerCase().includes('psi') ||
          usuarioLogado.emailUsuario.toLowerCase().includes('dra')) {
        navigation.replace('PsicologoTabs');
      } else {
        navigation.replace('MainTabs');
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Acesso Negado', 'E-mail ou senha incorretos.');
      } else if (error.response && error.response.status === 500) {
        Alert.alert('Erro', error.response.data.message || 'E-mail não encontrado ou senha incorreta.');
      } else {
        Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor. O Spring Boot está rodando?');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.innerContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/LogoPronta.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Cuidando da sua mente, online.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu E-mail"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sua Senha"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIcon}>
                <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="#A0A0A0" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
              <Text style={styles.buttonPrimaryText}>Entrar</Text>
              <Ionicons name="log-in-outline" size={22} color="#131826" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={styles.buttonSecondaryText}>Novo por aqui? Criar Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  keyboardContainer: { flex: 1 },
  innerContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 30, width: '100%' },
  logo: { width: 320, height: 180 },
  subtitle: { color: '#131826', fontSize: 16, fontWeight: '500', marginTop: 5, textAlign: 'center' },
  formContainer: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, marginBottom: 16, paddingHorizontal: 15, height: 55, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#131826', fontSize: 16, height: '100%' },
  eyeIcon: { padding: 5 },
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotPasswordText: { color: '#A0A0A0', fontSize: 14, fontWeight: '600' },
  buttonPrimary: { backgroundColor: '#05F2F2', flexDirection: 'row', justifyContent: 'center', paddingVertical: 15, borderRadius: 15, alignItems: 'center', width: '100%', shadowColor: '#05F2F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  buttonPrimaryText: { color: '#131826', fontSize: 18, fontWeight: 'bold' },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  separatorText: { color: '#A0A0A0', paddingHorizontal: 15, fontSize: 14, fontWeight: '500' },
  buttonSecondary: { alignItems: 'center', width: '100%', paddingVertical: 15, backgroundColor: '#E8F5E9', borderRadius: 15 },
  buttonSecondaryText: { color: '#168C04', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});