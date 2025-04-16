import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'useredit',
  imports: [FormsModule],
  templateUrl: './useredit.component.html',
  styleUrl: './useredit.component.css'
})
export class UsereditComponent {

  FruitsForm: User = {
    id: 0,
    username: "",
    email: "",
    age: 0,
    password: ""
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient) {

  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((param) => {
      debugger
      // console.log(this.route.snapshot.paramMap.keys)
      // var id = Number(this.route.snapshot.paramMap.get('id'));
      const idRaw = this.route.snapshot.paramMap.get('id');
      this.getById(idRaw);
    // })
  }

  getById(id: any) {
    debugger
    this.userService.getById(id)
      .subscribe((data) => {
        this.FruitsForm = data;
      })
  }

  cancle() {
    this.router.navigate(['/home']);
  }

  update() {
    this.userService.userUpdate(this.FruitsForm)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

}
