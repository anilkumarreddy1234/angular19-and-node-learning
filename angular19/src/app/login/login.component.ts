import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ContentObserver } from '@angular/cdk/observers';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username : string = "";
  password : string  = "";
  showSpinner : boolean = false;
  isAuthenticate: boolean = false;
  errorMessage: string = '';



  phone = '';
  email = '';
  emailOtpDigits="";
  otpDigits: string[] = ['', '', '', '', '', '']; // Array for 6 OTP digits
  // showSpinner: boolean = false;
  showOtpForm: boolean = false; // Toggle between phone and OTP forms
  emailShowOtpForm: boolean = false;
  private phoneRegex: RegExp = /^[1-9][0-9]{9}$/;
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  constructor(private router: Router,private auth:AuthService, private userService:UserService, private snackBar: MatSnackBar,) {
  }
  ngOnInit() {}

  public login() : void {
    let credentials = {
      username:this.username,
      password: this.password
    }

    this.userService.login(credentials).subscribe({
      next: () => {
        let token = this.userService.getToken();
        if(token){
          this.router.navigate(['/home']);
        }
        // Token is set in AuthService; navigate to /home
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed. Please try again.';
      },
    });
  }

  // public otpLogin(){
  //   let phoneNumber = {
  //     phone:this.phone
  //   }

  //   this.userService.sendOTP(phoneNumber).subscribe({
  //     next: () => {
  //       let token = this.userService.getToken();
  //       if(token){
  //         this.router.navigate(['/home']);
  //       }
  //       // Token is set in AuthService; navigate to /home
  //     },
  //     error: (error) => {
  //       this.errorMessage = error.message || 'Login failed with OTP. Please try again.';
  //     },
  //   });
  // }

  otpLogin() {
    if (!this.phone || !/^[1-9][0-9]{9}$/.test(this.phone)) {
      this.snackBar.open('Enter a valid 10-digit phone number (no leading 0)', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.showSpinner = true;
    this.userService.sendOTP({ phone: this.phone }).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.showOtpForm = true; // Show OTP form
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.showSpinner = false;
        this.snackBar.open(err.message, 'Close', { duration: 3000 });
      },
    });
  };

  verifyOTP() {
    const otp = this.otpDigits.join('');
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      this.snackBar.open('Enter a valid 6-digit OTP', 'Close', { duration: 3000 });
      return;
    }

    this.showSpinner = true;
    this.userService.verifyOTP({ phone: this.phone, otp }).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.showSpinner = false;
        this.snackBar.open(err.message, 'Close', { duration: 3000 });
      },
    });
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    if (input.value.length === 0 && index > 0 && event instanceof KeyboardEvent && event.key === 'Backspace') {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    this.otpDigits[index] = input.value;
  }

  isPhoneValid(): boolean {
    return !!this.phone && this.phoneRegex.test(this.phone);
  }

  isEmailValid(): boolean {
    return !!this.email && this.emailRegex.test(this.email);
  }

  resetForm() {
    this.phone = '';
    this.otpDigits = ['', '', '', '', '', ''];
    this.showOtpForm = false;
    this.showSpinner = false;
  }


  signup(){
    this.router.navigate(['/signup']);
  }

  // keyDownFunctionn(event:any) {
  //   if (event.keyCode === 13) {
  //     this.login();
  //   }
  // }

  // keyDownFunction(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     this.otpLogin();
  //   }
  // }

  // emailkeyDownFunction(event: KeyboardEvent) {
  //   if (event.key === 'Enter' && this.isEmailValid()) {
  //     this.emailOtpLogin();
  //   }
  // }

  public emailOtpLogin(){
    this.showSpinner = true;
    this.userService.emailSendOTP({ email: this.email }).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.emailShowOtpForm = true; // Show OTP form
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.showSpinner = false;
        this.snackBar.open(err.message, 'Close', { duration: 3000 });
      },
    });
  }

  public emailVerifyOTP(){
    const otp = this.emailOtpDigits;
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      this.snackBar.open('Enter a valid 6-digit OTP', 'Close', { duration: 3000 });
      return;
    }
    this.showSpinner = true;
    this.userService.emailVerifyOTP({ email: this.email, otp }).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.showSpinner = false;
        this.snackBar.open(err.message, 'Close', { duration: 3000 });
      },
    });
  }

}
