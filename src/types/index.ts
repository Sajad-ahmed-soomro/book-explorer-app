export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: string;
  coverImage?: string;
  description?: string;
  isbn?: string;
  rating?: number;
  ratingsCount?: number;
  publisher?: string;
}

export interface Rating {
  source: string;
  value: number;
  maxValue: number;
  reviewCount?: number;
}

export interface SearchResponse {
  books: Book[];
  totalItems: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type RootStackParamList = {
  Home: undefined;
  BookDetail: { book: Book };
};