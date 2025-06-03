import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { UsersService } from '../../service/users.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { userType: '', email: '', password: '' };
  result: any;
  errorMessage: string = '';

  constructor(private usersService: UsersService, private router: Router, private location: Location) {}

  ngOnInit() {
    // Check if user is already logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData && parsedData.role) {
        if (parsedData.role === 'ADMIN') {
          this.router.navigate(['/admindashboard']);
        } else {
          this.router.navigate(['/userdashboard']);
        }
      }
    }
  }

  onSubmit() {
    this.usersService.login(this.loginData).subscribe(response => {
      this.result = response;
      if (this.result.success) {
        console.log(this.result);
        // Decode the token
        const decodedToken: any = jwtDecode(this.result.message);
        const userType = decodedToken.role;
        const email = decodedToken.sub;
        const memberId = decodedToken.userId;
        const token = this.result.message;
        console.log(decodedToken);

        // Store token information in local storage
        localStorage.setItem('userData', JSON.stringify(decodedToken));
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('email', email);
        localStorage.setItem('memberId', memberId);

        if (userType === 'ADMIN') {
          this.router.navigate(['/admindashboard']);
          // Disable back button
          this.location.replaceState('/admindashboard');
        } else {
          this.router.navigate(['/userdashboard']);
          this.location.replaceState('/userdashboard');
        }
      } else {
        this.errorMessage = this.result.message;
      }
    }, error => {
      if (error.status === 400) {
        this.result = error.error;
        this.errorMessage = this.result.message;
        console.log(this.errorMessage);
      } else {
        console.error('Error:', error);
      }
    });
  }

  navigateToSignup() {
    console.log('hii')
    this.router.navigate(['/signup']);
  }
}
