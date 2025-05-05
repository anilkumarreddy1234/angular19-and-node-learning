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

  // public sendOTP(credentials: { phone: any;}): Observable<{ token: string }> {
  //   return this.http.post<{ token: string }>(`${this.baseUrl}/login/send-otp`, credentials).pipe(
  //     tap((response) => {
  //       if (response.token) {
  //         sessionStorage.setItem('token', response.token);
  //         this.setToken(response.token);
  //         this.isLoggedOutSubject.next(false);
  //         this.isLoggedOutSubjectlogin.next(true);
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Login failed:', error);
  //       return throwError(() => new Error(error.error?.message || 'Invalid credentials'));
  //     })
  //   );
  // };

  sendOTP(credentials: { phone: string }): Observable<{ message: string }> {
    // Format phone number (e.g., +917411706600)
    const formattedPhone = this.formatPhoneNumber(credentials.phone);

    return this.http
      .post<{ message: string }>(`${this.baseUrl}/login/send-otp`, { phone: formattedPhone })
      .pipe(
        catchError((error) => {
          console.error('Send OTP failed:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to send OTP'));
        })
      );
  }

  // Verify OTP and get token
  verifyOTP(credentials: { phone: string; otp: string }): Observable<{ token: string }> {
    // Format phone number
    const formattedPhone = this.formatPhoneNumber(credentials.phone);

    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login/verify-otp`, {
        phone: formattedPhone,
        otp: credentials.otp,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            // Store token and update login state
            sessionStorage.setItem('token', response.token);
            this.setToken(response.token);
            this.isLoggedOutSubject.next(false);
            this.isLoggedOutSubjectlogin.next(true);
          }
        }),
        catchError((error) => {
          console.error('Verify OTP failed:', error);
          return throwError(() => new Error(error.error?.message || 'Invalid OTP'));
        })
      );
  }


  //email otp


  public emailSendOTP(credentials: { email: string }): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/login/email-send-otp`, { email: credentials.email })
      .pipe(
        catchError((error) => {
          console.error('Send OTP failed:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to send OTP'));
        })
      );
  }

 

  public emailVerifyOTP(credentials: { email: string; otp: string }): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login/email-verify-otp`, {
        email: credentials.email,
        otp: credentials.otp,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            // Store token and update login state
            sessionStorage.setItem('token', response.token);
            this.setToken(response.token);
            this.isLoggedOutSubject.next(false);
            this.isLoggedOutSubjectlogin.next(true);
          }
        }),
        catchError((error) => {
          console.error('Verify OTP failed:', error);
          return throwError(() => new Error(error.error?.message || 'Invalid OTP'));
        })
      );
  }




  private formatPhoneNumber(phone: string): string {
    // Remove non-digits and leading zeros
    let cleanedPhone = phone.replace(/[^0-9]/g, '').replace(/^0+/, '');

    // Add country code (e.g., +91 for India)
    if (!cleanedPhone.startsWith('+91')) {
      cleanedPhone = `+91${cleanedPhone}`;
    }

    return cleanedPhone;
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
