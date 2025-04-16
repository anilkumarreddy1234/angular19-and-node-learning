import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterdataPipe } from '../../pipes/filterdata.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

declare var window:any;

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    FilterdataPipe,
    NgxPaginationModule,
    RouterModule,
    MatFormFieldModule
  ],  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  users: User[] = [];

  deleteModal:any;
  idToDelete:number = 0;
  userInfo:User[] = [];
  sreachText = "";
  data$: any;
  names$:any;
  name!: string[];
  p: any = 1;
  count: any = 5;

  constructor(private userService:UserService){}

  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModel'));
    this.loadUsers();
  }

  public loadUsers(): void {
    this.userService.getUserList().subscribe({
      next: (users) => {
        this.users = users;
        this.userInfo = users;
      },
      error: (error) => {
        this.users = []; // Clear users on error
      },
    });
  }

  public usersList(){
    this.userService.getUserList().subscribe(data =>{
      console.log("user data", data);

    })
  }

  public postusersList(){
    this.userService.postUserList().subscribe(data =>{
      console.log("from post user", data);
    })
  }

  public logout(){
    this.userService.clearToken();
  }

  openDeleteModal(id:number){
    debugger
    this.idToDelete = id;
    this.deleteModal.show();
  }

  close(){
    this.deleteModal.hide();
  }

  
  delete(){
    this.userService.userDelete(this.idToDelete)
    .subscribe((data) =>{
      this.userInfo.filter(_ => _.id !== this.idToDelete);
      this.loadUsers();
      this.deleteModal.hide();
    })
  }
}
