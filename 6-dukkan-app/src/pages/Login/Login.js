import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, View } from 'react-native';
import styles from './Login.style';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Formik } from 'formik';
import usePost from '../../hooks/usePost';
import Config from 'react-native-config';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Login = () => {
  const { data, error, loading, post } = usePost();
  const dispatch = useDispatch();
  const [uname, setUname] = useState('');

  // Giriş işlemi sırasında kullanıcı adını state'e kaydet
  const handleLogin = values => {
    setUname(values.username);
    post(Config.API_AUTH_URL + '/login', values);
  };

  // Hatalı girişte alert göster
  useEffect(() => {
    if (error) {
      Alert.alert('Dükkan', 'Kullanıcı adı veya şifre hatalı!');
    }
  }, [error]);

  // Login başarılıysa kullanıcı bilgilerini çek ve redux'a kaydet
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('https://fakestoreapi.com/users');
        const foundUser = res.data.find(u => u.username === uname);
        if (foundUser) {
          dispatch({ type: 'SET_USER', payload: { user: foundUser } });
        } else {
          Alert.alert('Dükkan', 'Kullanıcı bulunamadı.');
        }
      } catch (e) {
        Alert.alert('Dükkan', 'Kullanıcı bilgisi alınamadı.');
      }
    };

    if (data && data.token && uname) {
      fetchUser();
    }
  }, [data, uname]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo_container}>
        <Image style={styles.logo} source={require('../../assets/cart.png')} />
      </View>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleLogin}
      >
        {({ handleSubmit, handleChange, values }) => (
          <View style={styles.body_container}>
            <Input
              iconName={'user-large'}
              placeholder={'Kullanıcı Adını giriniz'}
              value={values.username}
              onType={handleChange('username')}
            />
            <Input
              iconName={'key'}
              placeholder={'Şifrenizi giriniz'}
              value={values.password}
              onType={handleChange('password')}
              isSecure
            />
            <Button text="Giriş Yap" onPress={handleSubmit} loading={loading} />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;
