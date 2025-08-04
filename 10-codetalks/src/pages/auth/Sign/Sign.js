import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import styles from './Sign.style';
import { Formik } from 'formik';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { showMessage } from 'react-native-flash-message';
import { getAuth } from '@react-native-firebase/auth';
import authErrorMessageParser from '../../../utils/authErrorMessageParser';

const Sign = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const initialFormValues = {
    usermail: '',
    password: '',
    repassword: '',
  };
  const handleFormSubmit = async (formValues, { resetForm }) => {
    if (formValues.password !== formValues.repassword) {
      showMessage({
        message: 'Şifreler uyuşmuyor',
        type: 'danger',
      });
      return;
    }
    setLoading(true);
    try {
      await getAuth().createUserWithEmailAndPassword(
        formValues.usermail.trim(),
        formValues.password,
      );
      await getAuth().signOut();
      showMessage({
        message: 'Kullanıcı oluşturuldu',
        type: 'success',
      });
      resetForm();
    } catch (error) {
      showMessage({
        message: authErrorMessageParser(error.code),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Codetalks</Text>
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values, formikHelpers) =>
          handleFormSubmit(values, formikHelpers)
        }
      >
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
            <Input
              value={values.repassword}
              onType={handleChange('repassword')}
              placeholder={'şifrenizi tekrar giriniz...'}
              isSecure
            />
            <Button
              text={'Kayıt Ol'}
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        )}
      </Formik>
      <Button text={'Geri'} theme="secondary" onPress={handleLogin} />
    </SafeAreaView>
  );
};

export default Sign;
