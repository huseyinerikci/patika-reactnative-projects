import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const MemberResult = ({ route }) => {
  const { user } = route.params;
  return (
    <SafeAreaView>
      <Text style={styles.message}>Kayıt Tamamlandı</Text>
      <Text style={styles.label}>Üye Adı: {user.username} </Text>
      <Text style={styles.label}>Üye Soyadı: {user.userlastname} </Text>
      <Text style={styles.label}>Üye Yaş: {user.userage} </Text>
      <Text style={styles.label}>Üye E-posta: {user.usermail} </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  message: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
});
export default MemberResult;
