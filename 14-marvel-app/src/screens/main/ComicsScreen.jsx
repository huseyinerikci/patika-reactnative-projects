import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ComicsScreen = () => {
  const dummyComics = [
    { id: 1, title: 'Amazing Spider-Man #1', year: '2023' },
    { id: 2, title: 'Iron Man #50', year: '2023' },
    { id: 3, title: 'Avengers: Endgame', year: '2022' },
    { id: 4, title: 'X-Men Origins', year: '2023' },
    { id: 5, title: 'Captain Marvel Adventures', year: '2022' },
  ];
  const renderComic = ({ item }) => (
    <TouchableOpacity style={styles.comicCard}>
      <View style={styles.comicInfo}>
        <Text style={styles.comicTitle}>{item.title}</Text>
        <Text style={styles.comicYear}>{item.year}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#8e8e93" />
    </TouchableOpacity>
  );
  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marvel Comics</Text>
      </View>

      <FlatList
        data={dummyComics}
        renderItem={renderComic}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  comicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  comicInfo: {
    flex: 1,
  },
  comicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  comicYear: {
    fontSize: 14,
    color: '#8e8e93',
  },
});

export default ComicsScreen;
