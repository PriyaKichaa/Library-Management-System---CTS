import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from '../../service/users.service';


@Component({
  selector: 'app-userdashboard',
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  
  userName: string = '';
  email = localStorage.getItem('email');

  constructor(private router: Router, private location: Location, private usersService: UsersService) {}

  ngOnInit() {
    if (!localStorage.getItem('jwtToken')) {
      this.router.navigate(['']);
    } else {
      this.location.replaceState('/userdashboard');
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
