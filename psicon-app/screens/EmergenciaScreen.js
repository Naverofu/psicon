import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function EmergenciaScreen({ navigation }) {

  const [idPacienteAtual, setIdPacienteAtual] = useState(null);
  const [buscandoPlantao, setBuscandoPlantao] = useState(false);

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          const usuario = JSON.parse(jsonValue);
          setIdPacienteAtual(usuario.idUsuario);
        }
      } catch (error) {
        console.log("Erro ao carregar o paciente:", error);
      }
    };
    carregarPaciente();
  }, []);

  const solicitarPsicologoPlantao = async () => {
    if (!idPacienteAtual) {
      Alert.alert("Erro", "Não foi possível identificar a sua conta.");
      return;
    }

    setBuscandoPlantao(true);

    try {
      await api.post('/consultas/emergencia', null, {
        params: { idPaciente: idPacienteAtual }
      });

      // 👇 CORREÇÃO: Navegação aninhada para encontrar a aba Consultas 👇
      Alert.alert(
        "Profissional Encontrado!",
        "Um psicólogo de plantão aceitou o seu pedido. A sala de atendimento seguro foi criada.",
        [
          { text: "Entrar na Sala Agora", onPress: () => navigation.navigate('MainTabs', { screen: 'Consultas' }) }
        ]
      );

    } catch (error) {
      console.log("Erro ao buscar plantão:", error);
      Alert.alert(
        "Sem Profissionais Disponíveis",
        "No momento, não temos psicólogos disponíveis no plantão imediato do aplicativo. Por favor, utilize os canais de resgate abaixo (CVV 188) ou tente novamente em alguns minutos."
      );
    } finally {
      setBuscandoPlantao(false);
    }
  };

  const fazerLigacao = (numero) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${numero}`;
    } else {
      phoneNumber = `telprompt:${numero}`;
    }
    Linking.openURL(phoneNumber).catch(err => console.error("Erro ao tentar ligar", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergência SOS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={50} color="#B3261E" style={{ marginBottom: 10 }} />
          <Text style={styles.warningTitle}>Você não está sozinho.</Text>
          <Text style={styles.warningText}>
            Se você estiver em perigo imediato ou pensando em se machucar, por favor, busque ajuda profissional agora mesmo.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.plantaoCard}
          onPress={solicitarPsicologoPlantao}
          disabled={buscandoPlantao}
        >
          <View style={styles.plantaoIconContainer}>
            {buscandoPlantao ? (
              <ActivityIndicator size="small" color="#131826" />
            ) : (
              <Ionicons name="videocam" size={30} color="#131826" />
            )}
          </View>
          <View style={styles.plantaoTextContainer}>
            <Text style={styles.plantaoTitle}>Falar com Psicólogo Agora</Text>
            <Text style={styles.plantaoSubtitle}>Conexão imediata por vídeo com um profissional de plantão na plataforma.</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Apoio Emocional Imediato</Text>

        <TouchableOpacity style={styles.sosCard} onPress={() => fazerLigacao('188')}>
          <View style={styles.sosIconContainer}>
            <Ionicons name="call" size={30} color="#B3261E" />
          </View>
          <View style={styles.sosTextContainer}>
            <Text style={styles.sosTitle}>Ligar para o CVV</Text>
            <Text style={styles.sosSubtitle}>Centro de Valorização da Vida. Atendimento 24h, gratuito e sigiloso.</Text>
            <Text style={styles.sosNumber}>Disque 188</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Serviços de Resgate</Text>
        <View style={styles.rowCards}>
          <TouchableOpacity style={styles.halfCard} onPress={() => fazerLigacao('192')}>
            <Ionicons name="medkit-outline" size={28} color="#1E88E5" />
            <Text style={styles.halfCardTitle}>SAMU</Text>
            <Text style={styles.halfCardNumber}>192</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.halfCard} onPress={() => fazerLigacao('190')}>
            <Ionicons name="shield-checkmark-outline" size={28} color="#131826" />
            <Text style={styles.halfCardTitle}>Polícia Militar</Text>
            <Text style={styles.halfCardNumber}>190</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Rede de Apoio</Text>
        <TouchableOpacity style={styles.contactCard} onPress={() => fazerLigacao('999999999')}>
          <View style={styles.contactAvatar}>
            <Ionicons name="person" size={20} color="#FFF" />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactName}>Contato de Confiança</Text>
            <Text style={styles.contactRelation}>Adicionado no seu perfil</Text>
          </View>
          <Ionicons name="call-outline" size={24} color="#168C04" />
        </TouchableOpacity>

        <View style={styles.breatheCard}>
          <Ionicons name="leaf-outline" size={24} color="#168C04" style={{ marginBottom: 10 }} />
          <Text style={styles.breatheTitle}>Exercício de Aterramento</Text>
          <Text style={styles.breatheText}>1. Encontre 5 coisas que você pode ver.</Text>
          <Text style={styles.breatheText}>2. Toque em 4 coisas ao seu redor.</Text>
          <Text style={styles.breatheText}>3. Escute 3 sons diferentes.</Text>
          <Text style={styles.breatheText}>4. Sinta o cheiro de 2 coisas.</Text>
          <Text style={styles.breatheText}>5. Reconheça 1 emoção que está sentindo.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#131826' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, backgroundColor: '#131826' },
  backButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  scrollContainer: { padding: 20, paddingBottom: 40, backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: '100%' },
  warningContainer: { alignItems: 'center', backgroundColor: '#FFEBEE', padding: 20, borderRadius: 20, marginTop: 10, marginBottom: 25 },
  warningTitle: { fontSize: 20, fontWeight: 'bold', color: '#B3261E', marginBottom: 5 },
  warningText: { fontSize: 14, color: '#D32F2F', textAlign: 'center', lineHeight: 20 },
  plantaoCard: { backgroundColor: '#BECFBB', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', elevation: 4, shadowColor: '#BECFBB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, marginBottom: 25 },
  plantaoIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  plantaoTextContainer: { flex: 1 },
  plantaoTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  plantaoSubtitle: { fontSize: 13, color: '#131826', marginTop: 4, lineHeight: 18, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826', marginBottom: 12, marginLeft: 4 },
  sosCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', elevation: 4, shadowColor: '#B3261E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, marginBottom: 25, borderWidth: 1, borderColor: '#FFCDD2' },
  sosIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  sosTextContainer: { flex: 1 },
  sosTitle: { fontSize: 18, fontWeight: 'bold', color: '#B3261E' },
  sosSubtitle: { fontSize: 12, color: '#666', marginTop: 4, lineHeight: 16 },
  sosNumber: { fontSize: 15, fontWeight: 'bold', color: '#B3261E', marginTop: 8 },
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  halfCard: { flex: 0.48, backgroundColor: '#FFF', borderRadius: 18, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  halfCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#131826', marginTop: 10 },
  halfCardNumber: { fontSize: 14, color: '#666', marginTop: 4 },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, marginBottom: 25 },
  contactAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#A0A0A0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contactTextContainer: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  contactRelation: { fontSize: 13, color: '#A0A0A0', marginTop: 2 },
  breatheCard: { backgroundColor: '#E8F5E9', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  breatheTitle: { fontSize: 16, fontWeight: 'bold', color: '#168C04', marginBottom: 10 },
  breatheText: { fontSize: 14, color: '#2E7D32', marginBottom: 6, fontWeight: '500' }
});