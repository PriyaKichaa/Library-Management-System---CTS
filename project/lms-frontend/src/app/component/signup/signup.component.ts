import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common'; // Ensure Location is imported from @angular/common
import { UsersService } from '../../service/users.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    membershipStatus: null,
    userType: '',
    password: ''
  };
  message: any = '';

  constructor(private usersService: UsersService, private router: Router, private location: Location) {}

  onSubmit() {
    console.log(this.user);
    this.usersService.signup(this.user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error.error);
          this.message = 'Error signing up user: please fill the details';
          return throwError(() => new Error('Something went wrong; please try again later.'));
        })
      )
      .subscribe(
        response => {
          this.message = 'Signup successful';
          this.router.navigate(['']);
        }
      );
  }
}
