import React from 'react';
import styles from './Login.style';
import { SafeAreaView, Text, View } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Input placeholder="E-posta giriniz" />
      <Input placeholder="Şifre giriniz" />
      <Button text={'Giriş Yap'} />
      <Button text={'Kayıt Ol'} theme={'secondary'} />
    </SafeAreaView>
  );
};

export default Login;
