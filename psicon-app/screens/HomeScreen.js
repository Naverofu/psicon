import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// IMPORTAÇÃO CORRIGIDA: Usando a biblioteca moderna e atualizada
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [menuVisivel, setMenuVisivel] = useState(false);

  const slideAnim = useRef(new Animated.Value(width)).current;

  const abrirMenu = () => {
    setMenuVisivel(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fecharMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisivel(false));
  };

  const humores = [
    { id: '1', emoji: '😢', label: 'Triste' },
    { id: '2', emoji: '😕', label: 'Ansioso' },
    { id: '3', emoji: '😐', label: 'Neutro' },
    { id: '4', emoji: '🙂', label: 'Bem' },
    { id: '5', emoji: '😄', label: 'Ótimo' },
  ];

  const dicas = [
    { id: '1', titulo: 'Respire fundo', texto: 'Inspire por 4s, segure por 4s e expire por 6s.', icone: 'leaf-outline', cor: '#E8F5E9', iconeCor: '#168C04' },
    { id: '2', titulo: 'Pausa para água', texto: 'A hidratação é fundamental para a clareza mental.', icone: 'water-outline', cor: '#E3F2FD', iconeCor: '#1E88E5' },
    { id: '3', titulo: 'Desconecte-se', texto: 'Que tal 30 minutos longe das telas hoje?', icone: 'phone-portrait-outline', cor: '#FFF3E0', iconeCor: '#F57C00' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Olá, Phil!</Text>
            <Text style={styles.subtitleText}>Como você está se sentindo hoje?</Text>
          </View>
          <TouchableOpacity onPress={abrirMenu} style={styles.profileButton}>
            <Ionicons name="person" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.moodContainer}>
          {humores.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.moodItem, humorSelecionado === item.id && styles.moodItemSelected]}
              onPress={() => setHumorSelecionado(item.id)}
            >
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <Text style={[styles.moodLabel, humorSelecionado === item.id && styles.moodLabelSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Ionicons name="calendar" size={20} color="#05F2F2" />
            <Text style={styles.appointmentTitle}>Sua consulta é hoje!</Text>
          </View>
          <Text style={styles.doctorName}>Dra. Ana Souza</Text>
          <Text style={styles.appointmentTime}>14:00 - 15:00 • Terapia Cognitiva</Text>
          <TouchableOpacity style={styles.joinButton}>
            <Ionicons name="videocam" size={18} color="#131826" style={{ marginRight: 8 }} />
            <Text style={styles.joinButtonText}>Entrar na Sala</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Dicas para o seu dia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollView} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {dicas.map((dica) => (
            <View key={dica.id} style={[styles.tipCard, { backgroundColor: dica.cor }]}>
              <View style={[styles.tipIconContainer, { backgroundColor: '#FFF' }]}>
                <Ionicons name={dica.icone} size={24} color={dica.iconeCor} />
              </View>
              <Text style={styles.tipTitle}>{dica.titulo}</Text>
              <Text style={styles.tipText}>{dica.texto}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.emergencyCard}>
          <View style={styles.emergencyIconContainer}>
            <Ionicons name="warning" size={28} color="#FFF" />
          </View>
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>Precisa de ajuda agora?</Text>
            <Text style={styles.emergencySubtitle}>Acesse contatos de emergência (CVV) e rede de apoio.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={menuVisivel} transparent={true} animationType="none" onRequestClose={fecharMenu}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={fecharMenu} />

          <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.sideMenuHeader}>
              <View style={styles.sideMenuProfile}>
                <Ionicons name="person" size={32} color="#FFF" />
              </View>
              <Text style={styles.sideMenuName}>Phil</Text>
              <Text style={styles.sideMenuEmail}>phil@psicon.com.br</Text>
            </View>

            <View style={styles.menuItemsContainer}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="person-outline" size={22} color="#131826" />
                <Text style={styles.menuItemText}>Meu Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={22} color="#131826" />
                <Text style={styles.menuItemText}>Configurações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="notifications-outline" size={22} color="#131826" />
                <Text style={styles.menuItemText}>Notificações</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={fecharMenu}>
              <Ionicons name="log-out-outline" size={22} color="#E53935" />
              <Text style={styles.logoutButtonText}>Sair do Aplicativo</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 30 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#131826' },
  subtitleText: { fontSize: 15, color: '#A0A0A0', marginTop: 4 },
  profileButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#131826', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 25 },
  moodItem: { alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 15, borderWidth: 1, borderColor: '#E0E0E0', width: 60 },
  moodItemSelected: { backgroundColor: '#E8F5E9', borderColor: '#168C04' },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodLabel: { fontSize: 11, color: '#A0A0A0', fontWeight: '600' },
  moodLabelSelected: { color: '#168C04' },
  appointmentCard: { marginHorizontal: 20, backgroundColor: '#131826', borderRadius: 20, padding: 20, marginBottom: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 },
  appointmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  appointmentTitle: { color: '#05F2F2', fontWeight: 'bold', fontSize: 14, marginLeft: 8, textTransform: 'uppercase' },
  doctorName: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  appointmentTime: { color: '#A0A0A0', fontSize: 15, marginTop: 4, marginBottom: 15 },
  joinButton: { backgroundColor: '#05F2F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  joinButtonText: { color: '#131826', fontWeight: 'bold', fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', paddingHorizontal: 20, marginBottom: 15 },
  tipsScrollView: { marginBottom: 25 },
  tipCard: { width: 220, borderRadius: 18, padding: 15, marginRight: 15 },
  tipIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826', marginBottom: 5 },
  tipText: { fontSize: 13, color: '#666', lineHeight: 18 },
  emergencyCard: { marginHorizontal: 20, backgroundColor: '#B3261E', borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  emergencyIconContainer: { marginRight: 15 },
  emergencyTextContainer: { flex: 1 },
  emergencyTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emergencySubtitle: { color: '#FFCDD2', fontSize: 13, marginTop: 2, lineHeight: 18 },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sideMenu: { width: width * 0.75, backgroundColor: '#FFF', height: '100%', position: 'absolute', right: 0, shadowColor: '#000', shadowOffset: { width: -5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  sideMenuHeader: { backgroundColor: '#131826', padding: 30, paddingTop: 60, borderBottomLeftRadius: 30 },
  sideMenuProfile: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2A3143', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  sideMenuName: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  sideMenuEmail: { color: '#05F2F2', fontSize: 14 },
  menuItemsContainer: { padding: 20, paddingTop: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuItemText: { fontSize: 16, color: '#131826', fontWeight: '500', marginLeft: 15 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 40, left: 20 },
  logoutButtonText: { color: '#E53935', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});