import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from '../guards/auth.guard';
import { UsereditComponent } from './useredit/useredit.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent,canActivate:[authGuard] },
    { path: 'useredit/:id', component: UsereditComponent,canActivate:[authGuard] },

    { path: '', component: HomeComponent, canActivate:[authGuard] },
];
