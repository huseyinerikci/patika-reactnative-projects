import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import muscic_data from './music-data.json';
import SongCard from './components/SongCard/SongCard';
import SearcBar from './components/SearcBar';
import { useState } from 'react';
import NotFound from './components/NotFound';

function App() {
  const [list, setList] = useState(muscic_data);
  const renderSong = ({ item }) => <SongCard song={item} />;
  const renderSeperator = () => <View style={styles.seperator} />;
  const handleSearch = text => {
    const filteredList = muscic_data.filter(song => {
      const seearchText = text.toLowerCase();
      const currentTitle = song.title.toLowerCase();
      return currentTitle.indexOf(seearchText) > -1;
    });
    setList(filteredList);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>MUSIC APP</Text>
      <SearcBar handleSearch={handleSearch} />
      {list.length > 0 ? (
        <FlatList
          keyExtractor={item => item.id}
          data={list}
          renderItem={renderSong}
          ItemSeparatorComponent={renderSeperator}
        />
      ) : (
        <NotFound />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    margin: 10,
    color: '#3D74B6',
  },
  seperator: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default App;
