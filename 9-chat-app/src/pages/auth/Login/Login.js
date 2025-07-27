import React, { useState } from 'react';
import styles from './Login.style';
import { SafeAreaView, Text } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Formik } from 'formik';
import { getAuth } from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import authErrorMessageParser from '../../../utils/authErrorMessageParser';

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleSign = () => {
    navigation.navigate('SignPage');
  };
  const intialFormValues = {
    usermail: '',
    password: '',
  };
  const handleFormSubmit = async formValues => {
    setLoading(true);
    try {
      const auth = getAuth();
      await auth.signInWithEmailAndPassword(
        formValues.usermail,
        formValues.password,
      );
      navigation.navigate('MessagesScreen');
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
            <Button text="Giriş Yap" onPress={handleSubmit} loading={loading} />
          </>
        )}
      </Formik>

      <Button text="Kayıt Ol" theme="secondary" onPress={handleSign} />
    </SafeAreaView>
  );
};

export default Login;
