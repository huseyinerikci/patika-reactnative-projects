import React, { useEffect } from 'react';
import { Alert, Image, SafeAreaView, View } from 'react-native';
import styles from './Login.style';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Formik } from 'formik';
import usePost from '../../hooks/usePost';
import Config from 'react-native-config';
import { useDispatch } from 'react-redux';

const Login = () => {
  const { data, error, loading, post } = usePost();
  const dispatch = useDispatch();

  const handleLogin = values => {
    post(Config.API_AUTH_URL + '/login', values);
  };

  if (error) {
    Alert.alert('Dükkan', 'Bir hata oluştu, lütfen tekrar deneyiniz.');
  }

  if (data) {
    if (data.status === 'Error') {
      Alert.alert('Dükkan', 'Kullanıcı Bulunamadı');
    } else {
      dispatch({ type: 'SET_USER', payload: { user: user } });
    }
  }

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
const user = {
  address: {
    geolocation: {
      lat: '-37.3159',
      long: '81.1496',
    },
    city: 'kilcoole',
    street: 'new road',
    number: 7682,
    zipcode: '12926-3874',
  },
  id: 1,
  email: 'john@gmail.com',
  username: 'johnd',
  password: 'm38rmF$',
  name: {
    firstname: 'john',
    lastname: 'doe',
  },
  phone: '1-570-236-7033',
  __v: 0,
};
export default Login;
