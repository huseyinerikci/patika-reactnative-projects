import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import styles from './Detail.style';
import useFetch from '../../hooks/useFetch';
import Config from 'react-native-config';
import Loader from '../../components/Loader';
import RenderHTML from 'react-native-render-html';
import Button from '../../components/Button/Button';

const Detail = ({ route }) => {
  const { id } = route.params;
  const { width } = useWindowDimensions();

  const { loading, error, data } = useFetch(Config.API_URL + '/' + id);
  console.log(Config.API_URL + '/' + id);
  console.log(data);
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  // Ortak stil tanımı
  const commonHtmlStyle = {
    color: '#333',
    fontSize: 11,
  };

  // Etiket listesi
  const htmlTags = ['p', 'span', 'li', 'strong', 'b', 'i'];

  // Ortak stili tüm etiketlere uygula
  const tagsStyles = htmlTags.reduce(
    (acc, tag) => {
      acc[tag] = commonHtmlStyle;
      return acc;
    },
    {
      ul: { paddingLeft: 20 },
      a: { color: 'blue', textDecorationLine: 'underline' },
    },
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.inner_container}>
          <Text style={styles.title}>{data.name} </Text>
          <View style={styles.text_container}>
            <Text style={styles.text}>Locations: </Text>
            <Text style={styles.name}>{data.locations[0].name} </Text>
          </View>
          <View style={styles.text_container}>
            <Text style={styles.text}>Job Level: </Text>
            <Text style={styles.name}> {data.levels[0].name} </Text>
          </View>
          <Text style={styles.det}>Job Detail</Text>
        </View>

        <View style={styles.body_container}>
          <RenderHTML
            contentWidth={width}
            source={{ html: data.contents }}
            tagsStyles={tagsStyles}
          />
        </View>
        <View style={styles.butn_container}>
          <Button
            text="Submit"
            loading={loading}
            onPress={null}
            iconName="right-to-bracket"
          />
          <Button
            text="Favorite Job"
            loading={loading}
            onPress={null}
            iconName={'heart'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Detail;
