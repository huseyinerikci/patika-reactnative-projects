import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../constants/colors';

const SearchBar = ({ onSearch, loading = false }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      Keyboard.dismiss(); //klavyeyi kapat
      onSearch(searchText.trim());
      setSearchText('');
    }
  };
  const handleSubmit = () => {
    handleSearch();
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Şehir ara... (örn:İstanbul)"
          placeholderTextColor={colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
          editable={!loading}
        />

        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.text.primary}
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={!searchText.trim()}
          >
            <Text style={styles.searchButtonText}>Ara</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.card.border,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 8,
  },
  loader: {
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: colors.text.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  searchButtonText: {
    color: colors.weather.default.start,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SearchBar;
