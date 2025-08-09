import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import styles from './InfoCard.style';
import ReactNativeModal from 'react-native-modal';

const InfoCard = ({ visible, close, user }) => {
  if (!user) return null;

  const formatDate = isoDate => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <ReactNativeModal
      style={styles.modal}
      isVisible={visible}
      swipeDirection={'down'}
      onSwipeComplete={close}
      onBackButtonPress={close}
      onBackdropPress={close}
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        {/* Profil Fotoğrafı */}
        <Image source={{ uri: user.picture.large }} style={styles.avatar} />

        {/* İsim */}
        <Text style={styles.fullname}>
          {user.name.title} {user.name.first} {user.name.last}
        </Text>

        {/* Temel Bilgiler */}
        <Text style={styles.info}>Gender: {user.gender}</Text>
        <Text style={styles.info}>Age: {user.dob.age}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Text style={styles.info}>Phone: {user.phone}</Text>
        <Text style={styles.info}>Cell: {user.cell}</Text>

        {/* Konum */}
        <Text style={styles.info}>
          Location: {user.location.city}, {user.location.state},{' '}
          {user.location.country}
        </Text>

        {/* Tarihler */}
        <Text style={styles.info}>
          Date of Birth: {formatDate(user.dob.date)}
        </Text>
        <Text style={styles.info}>
          Registered: {formatDate(user.registered.date)}
        </Text>

        <SafeAreaView style={styles.safeArea} />
      </View>
    </ReactNativeModal>
  );
};

export default InfoCard;
