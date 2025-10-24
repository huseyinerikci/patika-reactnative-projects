import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SIZES, COLORS, SHADOWS } from '../constants/theme';
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Restoran, mutfak veya şehir ara...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = new Animated.Value(0);

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  // animasyonlu border rengi
  const borderColor = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });
  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      <Icon
        name="search"
        size={SIZES.iconMd}
        color={isFocused ? COLORS.primary : COLORS.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        returnKeyType="search"
      />
      {/* temizle butonu */}
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon
            name="close-circle"
            size={SIZES.iconMd}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      )}
      {/* filtre buton */}
      <TouchableOpacity style={styles.filterButton}>
        <Icon name="options" size={SIZES.iconMd} color={COLORS.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
    borderWidth: 2,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SIZES.sm,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.text,
    padding: 0,
  },
  clearButton: {
    padding: SIZES.xs,
    marginRight: SIZES.xs,
  },
  filterButton: {
    padding: SIZES.xs,
    marginLeft: SIZES.xs,
  },
});

export default SearchBar;
