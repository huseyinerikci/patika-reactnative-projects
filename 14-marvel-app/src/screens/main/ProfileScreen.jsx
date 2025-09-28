import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', onPress: () => dispatch(logout()) },
    ]);
  };
  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Icon name="person" size={60} color="#fff" />
        </View>

        <Text style={styles.userName}>{user?.name || 'Marvel Fan'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" size={24} color="#fff" />
          <Text style={styles.menuText}>Ayarlar</Text>
          <Icon name="chevron-right" size={24} color="#8e8e93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info" size={24} color="#fff" />
          <Text style={styles.menuText}>Hakkında</Text>
          <Icon name="chevron-right" size={24} color="#8e8e93" />
        </TouchableOpacity>

        {/* Çıkış butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#e74c3c', '#c0392b']}
            style={styles.logoutButtonGradient}
          >
            <Icon name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#8e8e93',
  },
  menuContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    paddingVertical: 15,
  },
});
export default ProfileScreen;
