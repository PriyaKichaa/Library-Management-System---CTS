import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://localhost:8083/api/books';

  constructor(private http: HttpClient) { }

  // Get all books
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/view-all`).pipe(
      catchError(this.handleError)
    );
  }

  // Get book by ID
  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/view/${bookId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add new book
  addBook(bookData: any): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/add`, bookData).pipe(
      catchError(this.handleError)
    );
  }

  // Update existing book
  updateBook(bookId: number, bookData: any): Observable<Book> {
    return this.http.patch<Book>(`${this.baseUrl}/update/${bookId}`, bookData).pipe(
      catchError(this.handleError)
    );
  }

  // Delete book
  deleteBook(bookId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${bookId}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Search books by author
  searchBooksByAuthor(author: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search/author/${encodeURIComponent(author)}`, {
      params: { author }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Search books by title
  searchBooksByTitle(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search/title/${encodeURIComponent(title)}`, {
      params: { title }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Search books by genre
  searchBooksByGenre(genre: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search/genre/${encodeURIComponent(genre)}`, {
      params: { genre }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.status === 0) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error}`;
    } else {
      // Backend returned error response
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server returned code ${error.status}: ${error.message}`;
      }

      // Specific error messages based on your backend
      switch (error.status) {
        case 400:
          errorMessage = error.error || 'Validation failed';
          break;
        case 404:
          errorMessage = error.error || 'Resource not found';
          break;
        case 409:
          errorMessage = 'ISBN already exists';
          break;
        case 403:
          errorMessage = 'Cannot delete borrowed book';
          break;
      }
    }
    
    alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}