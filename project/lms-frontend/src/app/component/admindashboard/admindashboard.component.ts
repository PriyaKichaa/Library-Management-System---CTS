import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { UsersService } from '../../service/users.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admindashboard',
  imports: [CommonModule,FormsModule,RouterOutlet,RouterLink],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {
    userName: string = '';
    email= localStorage.getItem('email');
    
    constructor(private router: Router, private location: Location, private usersService: UsersService) {}


  ngOnInit() {
    if (!localStorage.getItem('jwtToken')) {
      this.router.navigate(['']);
    } else {
      this.location.replaceState('/admindashboard'); // Replace the state to prevent back navigation
      if (this.email) {
        this.fetchUserName(this.email);
      }
    } 
  }

  fetchUserName(email: string) {
    this.usersService.getUserProfile(email).subscribe(
      response => {
        this.userName = response.name;
      },
      error => {
        console.error('Error fetching user details:', error);
      }
    );
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
