import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [possuiDependente, setPossuiDependente] = useState(false);
  const [nomeDependente, setNomeDependente] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleCadastro = () => {
    // Aqui no futuro enviaremos todos esses dados para o seu Backend
    console.log("Tentando cadastrar:", { nome, email, dataNascimento, possuiDependente, nomeDependente });
    navigation.replace('MainTabs');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#131826" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar sua jornada no PsicOn.</Text>
          </View>

          <View style={styles.formContainer}>

            {/* Campo de Nome */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu Nome Completo"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="words"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            {/* Campo de E-mail */}
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

            {/* Campo de Data de Nascimento */}
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                maxLength={10}
                value={dataNascimento}
                onChangeText={setDataNascimento}
              />
            </View>

            {/* Switch para Dependentes */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Adicionar perfil para um dependente?</Text>
              <Switch
                trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
                thumbColor={possuiDependente ? "#168C04" : "#f4f3f4"}
                onValueChange={setPossuiDependente}
                value={possuiDependente}
              />
            </View>

            {/* Campo Extra se tiver Dependente */}
            {possuiDependente && (
              <View style={[styles.inputContainer, { borderColor: '#168C04', borderWidth: 1.5 }]}>
                <Ionicons name="people-outline" size={20} color="#168C04" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome do Dependente"
                  placeholderTextColor="#A0A0A0"
                  autoCapitalize="words"
                  value={nomeDependente}
                  onChangeText={setNomeDependente}
                />
              </View>
            )}

            {/* Campo de Senha */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Crie uma Senha"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIcon}>
                <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="#A0A0A0" />
              </TouchableOpacity>
            </View>

            {/* Campo de Confirmar Senha */}
            <View style={styles.inputContainer}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirme sua Senha"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!mostrarConfirmarSenha}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
              <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} style={styles.eyeIcon}>
                <Ionicons name={mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="#A0A0A0" />
              </TouchableOpacity>
            </View>

            {/* Botão Principal de Cadastrar */}
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleCadastro}>
              <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
              <Ionicons name="arrow-forward-outline" size={22} color="#131826" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Link para voltar ao Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginText}>Fazer Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardContainer: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#131826',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#131826',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 5,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#131826',
  },
  buttonPrimary: {
    backgroundColor: '#05F2F2',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: '#05F2F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonPrimaryText: {
    color: '#131826',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 15,
    color: '#A0A0A0',
  },
  loginText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#168C04',
  },
});