import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotificacoesScreen({ navigation }) {
  // Estados dos botões de notificação
  const [avisoDiaConsulta, setAvisoDiaConsulta] = useState(true);
  const [avisoUmaHora, setAvisoUmaHora] = useState(true);
  const [novasMensagens, setNovasMensagens] = useState(true);
  const [emailsPromocionais, setEmailsPromocionais] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#131826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} /> {/* Espaçador para centralizar o título */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Consultas e Lembretes</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.settingLabel}>Avisar no dia da consulta</Text>
              <Text style={styles.settingSubLabel}>Lembrete pela manhã no dia agendado.</Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
              thumbColor={avisoDiaConsulta ? "#168C04" : "#f4f3f4"}
              onValueChange={setAvisoDiaConsulta}
              value={avisoDiaConsulta}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.settingLabel}>Avisar 1 hora antes</Text>
              <Text style={styles.settingSubLabel}>Notificação push antes de entrar na sala.</Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
              thumbColor={avisoUmaHora ? "#168C04" : "#f4f3f4"}
              onValueChange={setAvisoUmaHora}
              value={avisoUmaHora}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Comunicações</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.settingLabel}>Novas mensagens no chat</Text>
              <Text style={styles.settingSubLabel}>Quando seu psicólogo enviar uma mensagem.</Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
              thumbColor={novasMensagens ? "#168C04" : "#f4f3f4"}
              onValueChange={setNovasMensagens}
              value={novasMensagens}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.settingLabel}>E-mails e Novidades</Text>
              <Text style={styles.settingSubLabel}>Receber dicas de saúde mental e atualizações.</Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#E8F5E9" }}
              thumbColor={emailsPromocionais ? "#168C04" : "#f4f3f4"}
              onValueChange={setEmailsPromocionais}
              value={emailsPromocionais}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826', marginBottom: 10, marginTop: 15, marginLeft: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 18, paddingVertical: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
  textContainer: { flex: 1, paddingRight: 15 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#131826' },
  settingSubLabel: { fontSize: 13, color: '#A0A0A0', marginTop: 4, lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 15 },
});