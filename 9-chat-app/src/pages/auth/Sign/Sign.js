import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import styles from './Sign.style';
import { getAuth } from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import authErrorMessageParser from '../../../utils/authErrorMessageParser';

const Sign = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    navigation.goBack();
  };
  const intialFormValues = {
    usermail: '',
    password: '',
    repassword: '',
  };
  const handleFormSubmit = async formValues => {
    if (formValues.password !== formValues.repassword) {
      showMessage({
        message: 'Şifreler uyuşmuyor',
        type: 'danger',
      });
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      await auth.createUserWithEmailAndPassword(
        formValues.usermail.trim(),
        formValues.password,
      );
      showMessage({
        message: 'Kullanıcı oluşturuldu',
        type: 'success',
      });
      navigation.navigate('LoginPage');
    } catch (error) {
      console.log(error);
      showMessage({
        message: authErrorMessageParser(error.code),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
    console.log(formValues);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Hi Chat</Text>
      <Formik initialValues={intialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <>
            <Input
              value={values.usermail}
              onType={handleChange('usermail')}
              placeholder="E-posta giriniz"
            />
            <Input
              value={values.password}
              onType={handleChange('password')}
              placeholder="Şifre giriniz"
              isSecure
            />
            <Input
              value={values.repassword}
              onType={handleChange('repassword')}
              placeholder="Şifre tekrar giriniz"
              isSecure
            />
            <Button text="Kayıt Ol" onPress={handleSubmit} loading={loading} />
          </>
        )}
      </Formik>

      <Button text="Geri" theme="secondary" onPress={handleLogin} />
    </SafeAreaView>
  );
};

export default Sign;
