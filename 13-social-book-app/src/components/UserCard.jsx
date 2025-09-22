import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserCard = ({ user, onPress }) => {
  if (!user) return null;
  return (
    <TouchableOpacity style={styles.userCard} onPress={() => onPress(user)}>
      <View style={styles.avatar}>
        <Icon name="person" size={24} color="#6366F1" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.bookCount}>
          {user.favoriteBooks?.length || 0} favori kitap
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  bookCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default UserCard;
