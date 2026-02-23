import axios from 'axios';
import { searchBooks, getBookDetails } from '../services/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  describe('searchBooks', () => {
    it('returns empty array for empty query', async () => {
      const result = await searchBooks('');
      expect(result).toEqual([]);
    });

    it('fetches and maps books correctly', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: '1',
              volumeInfo: {
                title: 'Test Book',
                authors: ['Test Author'],
                publishedDate: '2023',
                imageLinks: {
                  thumbnail: 'http://example.com/cover.jpg',
                },
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await searchBooks('test');
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: '2023',
        coverImage: 'https://example.com/cover.jpg',
        description: undefined,
        isbn: undefined,
        publisher: undefined,
        rating: undefined,
        ratingsCount: undefined,
      });
    });

    it('handles API errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchBooks('test')).rejects.toThrow('Failed to search books. Please try again.');
    });
  });

  describe('getBookDetails', () => {
    it('fetches and maps book details correctly', async () => {
      const mockResponse = {
        data: {
          id: '1',
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author'],
            publishedDate: '2023',
            description: 'Test description',
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getBookDetails('1');
      
      expect(result).toEqual({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: '2023',
        coverImage: undefined,
        description: 'Test description',
        isbn: undefined,
        publisher: undefined,
        rating: undefined,
        ratingsCount: undefined,
      });
    });
  });
});