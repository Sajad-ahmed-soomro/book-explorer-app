import axios from 'axios';
import { Book, Rating, ApiError } from '../types';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';
const OPEN_LIBRARY_API = 'https://openlibrary.org';
const NYTIMES_API = 'https://api.nytimes.com/svc/books/v3';

const NYTIMES_API_KEY = '';

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    publisher?: string;
    ratingsCount?: number;
    averageRating?: number;
  };
}

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    if (!query.trim()) return [];

    const response = await axios.get(
      `${GOOGLE_BOOKS_API}/volumes?q=${encodeURIComponent(query)}&maxResults=20`
    );

    const books = response.data.items?.map((item: GoogleBookVolume) => ({
      id: item.id,
      title: item.volumeInfo.title || 'Unknown Title',
      author: item.volumeInfo.authors?.[0] || 'Unknown Author',
      publishedYear: item.volumeInfo.publishedDate?.split('-')[0],
      coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      description: item.volumeInfo.description,
      isbn: item.volumeInfo.industryIdentifiers?.find(
        (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier,
      publisher: item.volumeInfo.publisher,
      rating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
    })) || [];

    return books;
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books. Please try again.');
  }
};

export const getBookDetails = async (bookId: string): Promise<Book> => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_API}/volumes/${bookId}`);
    const item = response.data;

    return {
      id: item.id,
      title: item.volumeInfo.title || 'Unknown Title',
      author: item.volumeInfo.authors?.[0] || 'Unknown Author',
      publishedYear: item.volumeInfo.publishedDate?.split('-')[0],
      coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
      description: item.volumeInfo.description,
      isbn: item.volumeInfo.industryIdentifiers?.find(
        (id:any) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier,
      publisher: item.volumeInfo.publisher,
      rating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details. Please try again.');
  }
};

export const getBookRatings = async (isbn: string): Promise<Rating | null> => {
  try {
   
    const response = await axios.get(`${GOOGLE_BOOKS_API}/volumes?q=isbn:${isbn}`);
    
    if (response.data.items?.[0]?.volumeInfo) {
      const info = response.data.items[0].volumeInfo;
      return {
        source: 'Google Books',
        value: info.averageRating || 0,
        maxValue: 5,
        reviewCount: info.ratingsCount || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return null;
  }
};

export const getNYTimesReviews = async (isbn: string): Promise<any> => {
  try {
    if (!NYTIMES_API_KEY || NYTIMES_API_KEY === 'YOUR_NYTIMES_API_KEY') {
      console.warn('NYTimes API key not configured');
      return null;
    }

    const response = await axios.get(
      `${NYTIMES_API}/reviews.json?isbn=${isbn}&api-key=${NYTIMES_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching NYTimes reviews:', error);
    return null;
  }
};