import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function ProntuarioDetalheScreen({ route, navigation }) {
  // Recebe o ID da consulta e o nome do paciente da tela anterior
  // Usamos fallback vazio caso o desenvolvedor acesse a tela direto sem passar parâmetros
  const consultaId = route.params?.consultaId || null;
  const pacienteNome = route.params?.pacienteNome || 'Paciente Desconhecido';

  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [historico, setHistorico] = useState([]);

  // Controles de estado da API
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // 👇 INJEÇÃO: Busca as anotações dessa consulta específica no banco de dados 👇
  useEffect(() => {
    const carregarAnotacoes = async () => {
      if (!consultaId) {
        setCarregandoHistorico(false);
        return;
      }

      try {
        const response = await api.get(`/prontuarios/consulta/${consultaId}`);
        const prontuarioDoBanco = response.data;

        // Se encontrou um prontuário, nós o formatamos para exibir no histórico
        if (prontuarioDoBanco) {
          const dataObj = new Date(prontuarioDoBanco.dataRegistro);
          const dia = String(dataObj.getDate()).padStart(2, '0');
          const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
          const ano = dataObj.getFullYear();

          const historicoFormatado = [{
            id: prontuarioDoBanco.idProntuario.toString(),
            data: `${dia}/${mes}/${ano}`,
            texto: prontuarioDoBanco.anotacoes
          }];

          setHistorico(historicoFormatado);
        }
      } catch (error) {
        // Erro 404 significa que ainda não existe prontuário para esta consulta, o que é normal.
        if (error.response && error.response.status !== 404) {
          console.log("Erro ao carregar prontuário:", error);
        }
      } finally {
        setCarregandoHistorico(false);
      }
    };

    carregarAnotacoes();
  }, [consultaId]);
  // 👆 FIM DA INJEÇÃO 👆

  const salvarAnotacao = async () => {
    if (novaAnotacao.trim() === '') {
      Alert.alert('Atenção', 'Escreva algo antes de salvar.');
      return;
    }

    if (!consultaId) {
      Alert.alert('Erro', 'Não foi possível identificar a sessão deste prontuário.');
      return;
    }

    setSalvando(true);

    try {
      // 👇 INJEÇÃO: Envia o texto para a rota POST do Spring Boot 👇
      const response = await api.post(`/prontuarios/consulta/${consultaId}`, novaAnotacao, {
        headers: {
          'Content-Type': 'text/plain' // O backend espera apenas uma String no body
        }
      });

      const prontuarioSalvo = response.data;

      // Formata a data retornada para jogar na tela na hora
      const dataObj = new Date(prontuarioSalvo.dataRegistro);
      const dia = String(dataObj.getDate()).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const ano = dataObj.getFullYear();

      const novaAnotacaoHistorico = {
        id: prontuarioSalvo.idProntuario.toString(),
        data: `${dia}/${mes}/${ano}`,
        texto: prontuarioSalvo.anotacoes
      };

      // Coloca no topo da lista e limpa o campo
      setHistorico([novaAnotacaoHistorico, ...historico]);
      setNovaAnotacao('');
      Alert.alert('Sucesso', 'Anotação salva com segurança!');

    } catch (error) {
      console.log("Erro ao salvar prontuário:", error);
      Alert.alert('Erro', 'Não foi possível salvar o prontuário no servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#131826" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Prontuário Clínico</Text>
            {/* Nome puxado dinamicamente */}
            <Text style={styles.pacienteName}>Paciente: {pacienteNome}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* Área para Nova Anotação da Sessão Atual */}
          <Text style={styles.sectionTitle}>Sessão de Hoje</Text>
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite as observações, sintomas e evoluções desta sessão..."
              placeholderTextColor="#A0A0A0"
              multiline
              textAlignVertical="top"
              value={novaAnotacao}
              onChangeText={setNovaAnotacao}
              editable={!salvando} // Bloqueia a escrita enquanto salva
            />
            <View style={styles.editorFooter}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach-outline" size={24} color="#1E88E5" />
                <Text style={styles.attachText}>Anexar Arquivo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, salvando && { opacity: 0.7 }]}
                onPress={salvarAnotacao}
                disabled={salvando}
              >
                {salvando ? (
                   <ActivityIndicator size="small" color="#131826" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color="#131826" style={{ marginRight: 6 }} />
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Histórico de Sessões Passadas */}
          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Histórico de Evolução</Text>

          {carregandoHistorico ? (
             <ActivityIndicator size="small" color="#05F2F2" style={{ marginTop: 20 }} />
          ) : historico.length === 0 ? (
             <Text style={{ color: '#A0A0A0', marginTop: 10 }}>Nenhuma anotação prévia para esta consulta.</Text>
          ) : (
            historico.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Ionicons name="calendar" size={16} color="#05F2F2" style={{ marginRight: 6 }} />
                  <Text style={styles.historyDate}>{item.data}</Text>
                </View>
                <Text style={styles.historyText}>{item.texto}</Text>
              </View>
            ))
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 20, backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  backButton: { padding: 8, backgroundColor: '#F5F5F5', borderRadius: 12, marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 14, color: '#A0A0A0', fontWeight: '600' },
  pacienteName: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 15 },
  editorContainer: { backgroundColor: '#FFF', borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: '#E3F2FD' },
  textInput: { minHeight: 180, padding: 20, fontSize: 16, color: '#131826', lineHeight: 24 },
  editorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#F5F5F5', backgroundColor: '#FAFAFA', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  attachButton: { flexDirection: 'row', alignItems: 'center' },
  attachText: { color: '#1E88E5', fontWeight: '500', marginLeft: 4 },
  saveButton: { backgroundColor: '#05F2F2', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  saveButtonText: { color: '#131826', fontWeight: 'bold', fontSize: 15 },
  historyCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 18, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#131826', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  historyDate: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  historyText: { fontSize: 15, color: '#444', lineHeight: 22 }
});