import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,private http:HttpClient) { }

  IsloggedIn(username:any,password:any){
    return this.http.get<any>("http://localhost:3000/usercreds");
  }
}
