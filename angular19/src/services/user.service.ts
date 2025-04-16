import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = "http://localhost:3000";
  data = {
    name: "gagan",
    age: 3,
    email: "gagan@gmail.com"
  };


  private isLogout = new BehaviorSubject(true);
  isLogoutStatus = this.isLogout.asObservable();

  private isLoggedOutSubject = new BehaviorSubject<boolean>(false);
  private isLoggedOutSubjectlogin = new BehaviorSubject<boolean>(false);

  public tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  constructor(private http: HttpClient, private router: Router) { }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  setToken(token: string): void {
    if (token) {
      this.tokenSubject.next(token);
      this.isLoggedOutSubject.next(true);
    } else {
      this.logout(true);
    }
  }

  clearToken(): void {
    this.tokenSubject.next(null);
    this.router.navigate(['/']);
  }


  // isLoggedOut-related methods
  getIsLoggedOut(): boolean {
    return this.isLoggedOutSubject.getValue();
  }

  getIsLoggedOutObservable(): Observable<boolean> {

    return this.isLoggedOutSubjectlogin.asObservable();
  }

  logout(msg: boolean) {
    this.isLoggedOutSubject.next(msg);
    this.router.navigate(['/']);
  }

  public getUserList() {
    return this.http.get<User[]>(`${this.baseUrl}` + '/users');
  }

  public postUserList() {
    return this.http.post(`${this.baseUrl}/users`, this.data);
  }

  public login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          this.setToken(response.token);
          this.isLoggedOutSubject.next(false);
          this.isLoggedOutSubjectlogin.next(true);
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => new Error(error.error?.message || 'Invalid credentials'));
      })
    );
  }

  getById(id: number) {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }

  public userUpdate(payload: any) {
    return this.http.put(`http://localhost:3000/users/${payload._id}`, payload);
  }

  public userDelete(id:number){
    return this.http.delete(`http://localhost:3000/users/${id}`);
  }

}
