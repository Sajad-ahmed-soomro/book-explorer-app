import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookCard from '../components/BookCard';

const mockBook = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  publishedYear: '2023',
  coverImage: 'https://example.com/cover.jpg',
  rating: 4.5,
  ratingsCount: 100,
};

describe('BookCard', () => {
  it('renders book information correctly', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <BookCard book={mockBook} onPress={onPressMock} />
    );

    expect(getByText('Test Book')).toBeTruthy();
    expect(getByText('Test Author')).toBeTruthy();
    expect(getByText('2023')).toBeTruthy();
    expect(getByText('4.5 (100)')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <BookCard book={mockBook} onPress={onPressMock} />
    );

    fireEvent.press(getByTestId('book-card'));
    expect(onPressMock).toHaveBeenCalledWith(mockBook);
  });

  it('renders placeholder when no cover image', () => {
    const bookWithoutCover = { ...mockBook, coverImage: undefined };
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <BookCard book={bookWithoutCover} onPress={onPressMock} />
    );

    expect(getByTestId('placeholder-cover')).toBeTruthy();
  });
});