import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

export default function PerfilScreen({ navigation }) {
  const [idUsuario, setIdUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isPsicologo, setIsPsicologo] = useState(false);
  const [precoConsulta, setPrecoConsulta] = useState('150.00');

  const [possuiDependente, setPossuiDependente] = useState(false);
  const [nomeDependente, setNomeDependente] = useState('');
  const [dataNascDependente, setDataNascDependente] = useState('');

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  useEffect(() => {
    const carregarDadosPerfil = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          const usuario = JSON.parse(jsonValue);

          setIdUsuario(usuario.idUsuario);
          setNome(usuario.nomeUsuario || '');
          setEmail(usuario.emailUsuario || '');
          setDataNascimento(usuario.dataNasc || '');
          setFotoPerfil(usuario.fotoPerfil || null);

          if (usuario.tipoUsuario === 'PSICOLOGO') {
            setIsPsicologo(true);
            if (usuario.precoConsulta) {
              setPrecoConsulta(usuario.precoConsulta.toString());
            }
          } else {
            try {
              const respostaDependentes = await api.get(`/dependentes/titular/${usuario.idUsuario}`);
              if (respostaDependentes.data && respostaDependentes.data.length > 0) {
                const dependente = respostaDependentes.data[0];
                setPossuiDependente(true);
                setNomeDependente(dependente.nomeDependente || '');
                setDataNascDependente(dependente.dataNasc || '');
              }
            } catch (depError) {
              console.log("Erro ao buscar dependentes", depError);
            }
          }
        }
      } catch (error) {
        console.log("Erro ao carregar o cofre:", error);
      }
    };

    carregarDadosPerfil();
  }, []);

  const gerenciarFoto = () => {
    Alert.alert(
      "Foto de Perfil",
      "O que deseja fazer?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover Foto", onPress: () => atualizarFotoNoBanco(null), style: "destructive" },
        { text: "Escolher da Galeria", onPress: abrirGaleria }
      ]
    );
  };

  const abrirGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.status !== 'granted') {
      Alert.alert("Permissão negada", "Precisamos de acesso à sua galeria para alterar a foto.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true
    });

    if (!result.canceled && result.assets[0].base64) {
      const imagemBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      atualizarFotoNoBanco(imagemBase64);
    }
  };

  const atualizarFotoNoBanco = async (imagemBase64) => {
    if (!idUsuario) return;
    setSalvandoFoto(true);

    try {
      await api.put(`/usuarios/${idUsuario}/foto`, { fotoPerfil: imagemBase64 });
      setFotoPerfil(imagemBase64);

      const jsonValue = await AsyncStorage.getItem('usuarioData');
      if (jsonValue != null) {
          let usuario = JSON.parse(jsonValue);
          usuario.fotoPerfil = imagemBase64;
          await AsyncStorage.setItem('usuarioData', JSON.stringify(usuario));
      }

    } catch (error) {
      console.log("Erro ao salvar foto", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
    } finally {
      setSalvandoFoto(false);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      if (isPsicologo && idUsuario) {
        const precoNumerico = parseFloat(precoConsulta.replace(',', '.'));
        if (isNaN(precoNumerico)) {
            Alert.alert("Erro", "Por favor, insira um valor válido para o preço.");
            setSalvando(false);
            return;
        }

        await api.put(`/usuarios/${idUsuario}/preco?preco=${precoNumerico}`);

        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
            let usuario = JSON.parse(jsonValue);
            usuario.precoConsulta = precoNumerico;
            await AsyncStorage.setItem('usuarioData', JSON.stringify(usuario));
        }
      }

      setEditando(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioData');
    } catch(e) {}
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#131826" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={() => setEditando(!editando)} style={styles.editButton}>
            <Ionicons name={editando ? "close" : "pencil"} size={22} color="#05F2F2" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={gerenciarFoto} disabled={salvandoFoto}>
            <View style={styles.profileImageWrapper}>
              {salvandoFoto ? (
                <ActivityIndicator size="large" color="#05F2F2" />
              ) : fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person" size={50} color="#FFF" />
              )}
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nome Completo</Text>
                {editando ? <TextInput style={styles.inputEdit} value={nome} onChangeText={setNome} /> : <Text style={styles.infoValue}>{nome}</Text>}
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#A0A0A0" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>E-mail</Text>
                {editando ? <TextInput style={styles.inputEdit} value={email} onChangeText={setEmail} keyboardType="email-address" /> : <Text style={styles.infoValue}>{email}</Text>}
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#A0A0A0" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Data de Nascimento</Text>
                {editando ? <TextInput style={styles.inputEdit} value={dataNascimento} onChangeText={setDataNascimento} /> : <Text style={styles.infoValue}>{dataNascimento}</Text>}
              </View>
            </View>
          </View>
        </View>

        {isPsicologo && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Configurações Profissionais</Text>
            <View style={[styles.infoCard, { borderColor: '#E8F5E9', borderWidth: 1 }]}>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={20} color="#168C04" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Valor da Consulta (R$)</Text>
                  {editando ? (
                    <TextInput style={styles.inputEdit} value={precoConsulta} onChangeText={setPrecoConsulta} keyboardType="numeric" />
                  ) : (
                    <Text style={[styles.infoValue, { color: '#168C04', fontWeight: 'bold' }]}>R$ {parseFloat(precoConsulta).toFixed(2)}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {possuiDependente && !isPsicologo && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Meu Dependente</Text>
            <View style={[styles.infoCard, { borderColor: '#C8E6C9', borderWidth: 1, backgroundColor: '#F7FCF8' }]}>
              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={20} color="#168C04" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Nome</Text>
                  {editando ? <TextInput style={styles.inputEdit} value={nomeDependente} onChangeText={setNomeDependente} /> : <Text style={styles.infoValue}>{nomeDependente}</Text>}
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#168C04" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Data de Nascimento</Text>
                  {editando ? <TextInput style={styles.inputEdit} value={dataNascDependente} onChangeText={setDataNascDependente} /> : <Text style={styles.infoValue}>{dataNascDependente}</Text>}
                </View>
              </View>
            </View>
          </View>
        )}

        {editando && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} disabled={salvando}>
            {salvando ? <ActivityIndicator size="small" color="#131826" /> : (
                <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#131826" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </>
            )}
          </TouchableOpacity>
        )}

        {!editando && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="lock-closed-outline" size={20} color="#131826" />
              <Text style={styles.actionButtonText}>Alterar Senha</Text>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#E53935" />
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  editButton: { padding: 8, backgroundColor: '#131826', borderRadius: 12, elevation: 2 },
  profileImageContainer: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  profileImageWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2A3143', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 5 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#05F2F2', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#131826' },
  profileEmail: { fontSize: 14, color: '#A0A0A0', marginTop: 4 },
  sectionContainer: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826', marginBottom: 12, marginLeft: 4 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  infoIcon: { marginRight: 15, width: 25, textAlign: 'center' },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#A0A0A0', marginBottom: 4 },
  infoValue: { fontSize: 15, color: '#131826', fontWeight: '500' },
  inputEdit: { fontSize: 15, color: '#131826', fontWeight: '500', borderBottomWidth: 1, borderBottomColor: '#05F2F2', paddingVertical: 0, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 40 },
  saveButton: { backgroundColor: '#05F2F2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 15, marginHorizontal: 20, marginTop: 10, elevation: 3 },
  saveButtonText: { color: '#131826', fontSize: 16, fontWeight: 'bold' },
  actionContainer: { paddingHorizontal: 20, marginTop: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  actionButtonText: { fontSize: 16, color: '#131826', fontWeight: '500', marginLeft: 15 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEBEE', padding: 18, borderRadius: 15 },
  logoutButtonText: { fontSize: 16, color: '#E53935', fontWeight: 'bold', marginLeft: 10 },
});