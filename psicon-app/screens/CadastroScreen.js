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
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function CadastroScreen({ navigation }) {
  // Dados Básicos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Dados do Psicólogo
  const [isPsicologo, setIsPsicologo] = useState(false);
  const [crp, setCrp] = useState('');

  // Dados do Dependente
  const [possuiDependente, setPossuiDependente] = useState(false);
  const [nomeDependente, setNomeDependente] = useState('');
  const [dataNascimentoDependente, setDataNascimentoDependente] = useState('');

  // Controles de UI
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // FUNÇÃO DE MÁSCARA
  const handleDateChange = (text, setDateFunction) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) {
      cleaned = cleaned.slice(0, 8);
    }
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (cleaned.length > 2) {
      formatted = cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    setDateFunction(formatted);
  };

  const handleCadastro = async () => {
    // 1. Validações locais
    if (!nome || !email || !dataNascimento || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem!');
      return;
    }
    if (isPsicologo && !crp.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o seu número de CRP.');
      return;
    }
    if (!isPsicologo && possuiDependente && (!nomeDependente || !dataNascimentoDependente)) {
      Alert.alert('Atenção', 'Por favor, preencha os dados do dependente.');
      return;
    }

    setCarregando(true);

    try {
      const payloadUsuario = {
        nomeUsuario: nome,
        emailUsuario: email,
        senhaUsuario: senha,
        dataNasc: dataNascimento,
        tipoUsuario: isPsicologo ? "PSICOLOGO" : "PACIENTE",
        crp: isPsicologo ? crp : null,
        disponivelEmergencia: false
      };

      // 1ª CHAMADA DA API: Cadastra primeiro o Usuário Titular
      const response = await api.post('/usuarios/cadastrar', payloadUsuario);

      // Pegamos o ID que o Java acabou de criar para esse usuário
      const idUsuarioCriado = response.data.idUsuario;

      // 2ª CHAMADA DA API: Se tiver dependente, cadastra o filho atrelado ao Titular
      if (!isPsicologo && possuiDependente) {
        try {
          const payloadDependente = {
            nomeDependente: nomeDependente,
            dataNasc: dataNascimentoDependente,
            grauParentesco: 'Filho(a)' // Enviando valor padrão exigido pelo backend
          };
          await api.post(`/dependentes/titular/${idUsuarioCriado}`, payloadDependente);
        } catch (depError) {
          console.log("Erro ao salvar dependente:", depError);
          // Não paramos o fluxo se o dependente falhar, apenas avisamos no log.
          // O titular já foi criado com sucesso.
        }
      }

      // SUCESSO: Navega para o Login
      if (Platform.OS === 'web') {
        window.alert('Sucesso! Sua conta foi criada. Você já pode fazer login no aplicativo.');
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'Sucesso!',
          'Sua conta foi criada. Você já pode fazer login no aplicativo.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Erro no Cadastro', 'Dados inválidos ou e-mail já em uso. Verifique e tente novamente.');
      } else {
        Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor. Verifique se o Spring Boot está a rodar.');
      }
    } finally {
      setCarregando(false);
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
              <Ionicons name="calendar-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sua Data de Nasc. (DD/MM/AAAA)"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                maxLength={10}
                value={dataNascimento}
                onChangeText={(text) => handleDateChange(text, setDataNascimento)}
              />
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Sou Psicólogo(a)</Text>
                <Text style={styles.switchSubLabel}>Criar conta como profissional</Text>
              </View>
              <Switch
                trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
                thumbColor={isPsicologo ? "#168C04" : "#f4f3f4"}
                onValueChange={(valor) => {
                  setIsPsicologo(valor);
                  if (valor) setPossuiDependente(false);
                }}
                value={isPsicologo}
              />
            </View>

            {isPsicologo && (
              <View style={[styles.inputContainer, { borderColor: '#168C04', borderWidth: 1 }]}>
                <Ionicons name="card-outline" size={20} color="#168C04" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número do CRP (Ex: 06/12345)"
                  placeholderTextColor="#A0A0A0"
                  autoCapitalize="characters"
                  value={crp}
                  onChangeText={setCrp}
                />
              </View>
            )}

            {!isPsicologo && (
              <View style={styles.switchContainer}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Adicionar Dependente?</Text>
                  <Text style={styles.switchSubLabel}>Para agendar consultas para menores</Text>
                </View>
                <Switch
                  trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
                  thumbColor={possuiDependente ? "#168C04" : "#f4f3f4"}
                  onValueChange={setPossuiDependente}
                  value={possuiDependente}
                />
              </View>
            )}

            {!isPsicologo && possuiDependente && (
              <View style={styles.dependenteBox}>
                <View style={[styles.inputContainer, styles.dependenteInput]}>
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
                <View style={[styles.inputContainer, styles.dependenteInput, { marginBottom: 0 }]}>
                  <Ionicons name="calendar-outline" size={20} color="#168C04" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Data Nasc. Dependente"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                    maxLength={10}
                    value={dataNascimentoDependente}
                    onChangeText={(text) => handleDateChange(text, setDataNascimentoDependente)}
                  />
                </View>
              </View>
            )}

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

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleCadastro} disabled={carregando}>
              {carregando ? (
                <ActivityIndicator size="small" color="#131826" />
              ) : (
                <>
                  <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
                  <Ionicons name="arrow-forward-outline" size={22} color="#131826" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

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
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#131826',
  },
  switchSubLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  dependenteBox: {
    backgroundColor: '#F7FCF8',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 16,
  },
  dependenteInput: {
    borderColor: '#168C04',
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPrimary: {
    backgroundColor: '#BECFBB',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: '#BECFBB',
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