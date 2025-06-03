import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookborrowService {
  private baseUrl = 'http://localhost:8083/lms/book/borrow';
  private borrowEndpoint = `${this.baseUrl}/borrow`;
  private returnEndpoint = `${this.baseUrl}/return`;
  private historyEndpoint = 'http://localhost:8083/api/borrowing/history';
  private holdingBooksEndpoint = 'http://localhost:8083/api/borrowing/holdingbook'; // New endpoint

  constructor(private http: HttpClient) { }

  borrowOneBook(borrowData: any): Observable<any> {
    return this.http.post(this.borrowEndpoint, borrowData);
  }

  returnBook(returnData: { memberId: string; bookId: number }): Observable<any> {
    return this.http.post(this.returnEndpoint, returnData);
  }

  getBorrowingHistory(memberId: string): Observable<any> {
    const url = `${this.historyEndpoint}/${memberId}`;
    return this.http.get(url);
  }

  getHoldingBooks(memberId: string): Observable<any> {
    const url = `${this.holdingBooksEndpoint}/${memberId}`;
    return this.http.get(url);
  }
}
