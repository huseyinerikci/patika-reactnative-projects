import React, { useState } from 'react';
import { Alert, SafeAreaView, Text } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';

const MemberSign = ({ navigation }) => {
  const [username, setUsername] = useState(null);
  const [userlastname, setUserlastname] = useState(null);
  const [userage, setUserage] = useState(null);
  const [usermail, setUsermail] = useState(null);

  const handleSubmit = () => {
    if (!username || !userlastname || !userage || !usermail) {
      Alert.alert('Fitness Salonu', 'Tüm bilgileri doldurunuz!');
      return;
    }
    const user = {
      username,
      userlastname,
      userage,
      usermail,
    };
    navigation.navigate('MemberResultScreen', { user });
  };
  return (
    <SafeAreaView>
      <Input
        label={'Üye Adı'}
        placeholder={'Üye ismini giriniz...'}
        onChangeText={setUsername}
      />
      <Input
        label={'Üye Soyadı'}
        placeholder={'Üye soyismini giriniz...'}
        onChangeText={setUserlastname}
      />
      <Input
        label={'Üye Yaş'}
        placeholder={'Üye yaşını giriniz...'}
        onChangeText={setUserage}
      />
      <Input
        label={'Üye E-posta'}
        placeholder={'Üye e-postasını giriniz...'}
        onChangeText={setUsermail}
      />
      <Button text={'Kaydet'} onPress={handleSubmit} />
    </SafeAreaView>
  );
};

export default MemberSign;
