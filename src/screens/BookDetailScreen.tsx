import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Changed from 'react-native-vector-icons/MaterialIcons'
import { RootStackParamList } from '../types';
import { getBookRatings } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import RatingStars from '../components/RatingStars';

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

const BookDetailScreen = () => {
  const route = useRoute<BookDetailRouteProp>();
  const { book } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<any>(null);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    if (!book.isbn) return;

    setLoading(true);
    setError(null);

    try {
      const ratingData = await getBookRatings(book.isbn);
      setRatings(ratingData);
    } catch (err) {
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMore = () => {
    Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author)}`);
  };

  const handleOpenLibrary = () => {
    Linking.openURL(`https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {book.coverImage ? (
          <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderCover}>
            <MaterialIcons name="menu-book" size={80} color="#999" /> {/* Changed from Icon to MaterialIcons */}
          </View>
        )}
        
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          {book.publishedYear && (
            <Text style={styles.year}>Published: {book.publishedYear}</Text>
          )}
          {book.publisher && (
            <Text style={styles.publisher}>{book.publisher}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating & Reviews</Text>
        
        {loading ? (
          <ActivityIndicator size="small" color="#2c3e50" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : ratings ? (
          <View style={styles.ratingContainer}>
            <RatingStars rating={ratings.value} maxValue={ratings.maxValue} />
            <Text style={styles.ratingText}>
              {ratings.value.toFixed(1)} / {ratings.maxValue}
            </Text>
            {ratings.reviewCount > 0 && (
              <Text style={styles.reviewCount}>
                Based on {ratings.reviewCount} reviews
              </Text>
            )}
            <Text style={styles.ratingSource}>Source: {ratings.source}</Text>
          </View>
        ) : (
          <Text style={styles.noRating}>No ratings available</Text>
        )}
      </View>

      {book.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Book</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Find More</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSearchMore}>
            <MaterialIcons name="search" size={20} color="#fff" /> {/* Changed from Icon to MaterialIcons */}
            <Text style={styles.buttonText}>Search Online</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleOpenLibrary}>
            <MaterialIcons name="library-books" size={20} color="#2c3e50" /> {/* Changed from Icon to MaterialIcons */}
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Open Library</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  placeholderCover: {
    width: 120,
    height: 180,
    backgroundColor: '#e1e4e8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  publisher: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginTop: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  ratingSource: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  noRating: {
    fontSize: 16,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#ecf0f1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2c3e50',
  },
});

export default BookDetailScreen;