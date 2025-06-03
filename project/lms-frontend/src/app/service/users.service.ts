import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) { }

  login(loginData: { userType: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  signup(userData: { name: string; username: string; email: string; phone: string; address: string; membershipStatus: string | null; userType: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/allusers`);
  }

  deleteUser(memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/deleteuser/${memberId}`);
  }

  getUserProfile(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${email}`);
  }

  updateUserProfile(user: User): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/update`, user);
  }

  addBook(book: any): Observable<any> {
    return this.http.post('http://localhost:8083/api/books/add', book);
  }
  
}
