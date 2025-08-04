import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import styles from './Login.style';
import { Formik } from 'formik';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { getAuth } from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import authErrorMessageParser from '../../../utils/authErrorMessageParser';

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const initialFormValues = {
    usermail: '',
    password: '',
  };
  const handleFormSubmit = async formValues => {
    setLoading(true);
    try {
      await getAuth().signInWithEmailAndPassword(
        formValues.usermail,
        formValues.password,
      );
    } catch (error) {
      showMessage({
        message: authErrorMessageParser(error.code),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSign = () => {
    navigation.navigate('SignPage');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Codetalks</Text>
      <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <View style={styles.body_container}>
            <Input
              value={values.usermail}
              onType={handleChange('usermail')}
              placeholder={'e-postanızı giriniz...'}
            />
            <Input
              value={values.password}
              onType={handleChange('password')}
              placeholder={'şifrenizi giriniz...'}
              isSecure
            />
            <Button
              text={'Giriş Yap'}
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        )}
      </Formik>
      <Button text={'Kayıt Ol'} theme="secondary" onPress={handleSign} />
    </SafeAreaView>
  );
};

export default Login;
