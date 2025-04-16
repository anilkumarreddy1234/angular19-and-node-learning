import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, MatToolbar, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular19';
  isLoggedOut = false;
  username = "test";

  private subscription: Subscription = new Subscription();


  constructor(private userService: UserService, private authService: AuthService, private router: Router) { 
    // if (sessionStorage.getItem('token')) {
    //   this.router.navigate(['/home']); 
    // }else{
    //   this.userService.logout(false);
    //   sessionStorage.clear();
    // }
  }

  public logout() {
    this.isLoggedOut = false;
    console.log("logout hit");
    this.userService.logout(false);
    this.router.navigate(['/login']);
    sessionStorage.removeItem('token');
  }

  ngOnInit(): void {
    // Subscribe to isLoggedOut
    this.subscription.add(
      this.userService.getIsLoggedOutObservable().subscribe({
        next: (isLoggedOut) => {
          if(isLoggedOut){
          this.isLoggedOut = true;
          }
          // this.router.navigate(['/home']);
        },
      })
    );
  }

}
