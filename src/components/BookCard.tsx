import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Change this
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(book)}>
      {book.coverImage ? (
        <Image source={{ uri: book.coverImage }} style={styles.cover} />
      ) : (
        <View style={styles.placeholderCover}>
          <MaterialIcons name="menu-book" size={40} color="#999" /> {/* Changed */}
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        {book.publishedYear && (
          <Text style={styles.year}>{book.publishedYear}</Text>
        )}
        {book.rating !== undefined && (
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#f1c40f" /> {/* Changed */}
            <Text style={styles.rating}>
              {book.rating.toFixed(1)} ({book.ratingsCount || 0})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ... styles remain the same

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  placeholderCover: {
    width: 60,
    height: 90,
    backgroundColor: '#e1e4e8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default BookCard;