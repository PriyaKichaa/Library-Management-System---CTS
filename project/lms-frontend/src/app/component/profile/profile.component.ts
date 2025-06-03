import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile: User = {
    memberId: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    membershipStatus: '',
    userType: '',
    password: ''
  };
  data: any;
  message: string = '';
  showModal: boolean = false;

  constructor(private usersService: UsersService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    const email = localStorage.getItem('email');

    if (email) {
      this.usersService.getUserProfile(email).subscribe(
        response => {
          this.profile = response;
        },
        error => {
          console.error('Error fetching profile details:', error);
        }
      );
    }
  }

  saveProfile() {
    console.log("inside save profile");
    if (this.profile.phone.length !== 10) {
      alert('Phone number must be 10 digits.');
      return;
    }

    this.usersService.updateUserProfile(this.profile).subscribe(
      response => {
        this.data = response;
        console.log(this.data.message);
        this.message = this.data.message; // Display backend message
        if (this.data.success) {
          this.showModal = true; // Show success modal if update is successful
        }
      },
      (error: HttpErrorResponse) => {
        console.error("Error in saving data:", error);
        this.message = 'Error updating profile: ' + error.error.message;
      }
    );
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit(){
    this.location.back();
  }
}