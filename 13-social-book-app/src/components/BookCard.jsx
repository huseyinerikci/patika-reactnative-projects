import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookCard = ({ book, user: bookUser, onUserPress, onBookPress }) => {
  if (!bookUser) return null;
  return (
    <View style={styles.bookCard}>
      <TouchableOpacity
        style={styles.bookHeader}
        onPress={() => onUserPress(bookUser)}
      >
        <View style={styles.smallAvatar}>
          <Icon name="person" size={16} color="#6366F1" />
        </View>
        <Text style={styles.bookOwner}>{bookUser.fullName}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookContent}
        onPress={() => onBookPress(book, bookUser)}
      >
        <View style={styles.bookIcon}>
          <Icon name="menu-book" size={20} color="#6366F1" />
        </View>
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>Yazar: {book.author}</Text>
          <Text style={styles.bookGenre}>Tür: {book.genre}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bookOwner: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookDetails: { flex: 1 },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  bookGenre: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default BookCard;
