import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracoesScreen({ navigation }) {

  const handleExcluirConta = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todo o seu histórico será perdido.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Excluir", onPress: () => console.log("Conta excluída"), style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#131826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Sua Conta</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('Perfil')}>
            <Ionicons name="person-circle-outline" size={22} color="#131826" style={styles.actionIcon} />
            <Text style={styles.actionLabel}>Gerenciar Dados do Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#131826" style={styles.actionIcon} />
            <Text style={styles.actionLabel}>Privacidade e Segurança</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="document-text-outline" size={22} color="#131826" style={styles.actionIcon} />
            <Text style={styles.actionLabel}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="information-circle-outline" size={22} color="#131826" style={styles.actionIcon} />
            <Text style={styles.actionLabel}>Versão do PsicOn</Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Zona de Perigo</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleExcluirConta}>
            <Ionicons name="trash-outline" size={22} color="#E53935" style={styles.actionIcon} />
            <Text style={[styles.actionLabel, { color: '#E53935' }]}>Excluir Minha Conta</Text>
          </TouchableOpacity>
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
  card: { backgroundColor: '#FFF', borderRadius: 18, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 18 },
  actionIcon: { marginRight: 15 },
  actionLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: '#131826' },
  versionText: { fontSize: 15, color: '#A0A0A0', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 52 },
});