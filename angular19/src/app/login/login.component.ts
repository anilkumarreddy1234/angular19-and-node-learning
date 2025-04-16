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
import { ContentObserver } from '@angular/cdk/observers';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
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
  
  constructor(private router: Router,private auth:AuthService, private userService:UserService) {
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

  signup(){
    this.router.navigate(['/signup']);
  }

  keyDownFunction(event:any) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

}
