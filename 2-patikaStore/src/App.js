import { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import products from './products.json';
import ProductCard from './components/ProductCard';

function App() {
  const [searchText, setSearchText] = useState('');

  const renderProducts = ({ item }) => <ProductCard products={item} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PATIKASTORE</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Ara..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {/* Product List */}
      <FlatList
        keyExtractor={(item, index) => item.id.toString()}
        data={products}
        renderItem={renderProducts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { padding: 10 },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'purple',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    margin: 5,
  },
  searchInput: {
    height: 30,
    fontSize: 16,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});

export default App;
