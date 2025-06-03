import { Component, OnInit } from '@angular/core';
//import { UserService } from '../user.service'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { UsersService } from '../../service/users.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-adminservice',
  imports:[CommonModule,FormsModule,SignupComponent],
  templateUrl: './adminservice.component.html',
  styleUrls: ['./adminservice.component.css']
})
export class AdminserviceComponent implements OnInit {
  showUsers: boolean = false;
  showFindUser: boolean = false;
  showAddBook: boolean = false;
  showAddUser: boolean = false;
  usersData: User[] = [];

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.fetchUsersData();
  }

  fetchUsersData(): void {
    this.usersService.getAllUsers().subscribe(result => {
      this.usersData = result;
      console.log(this.usersData);
    });
  }

  showAllUsers(): void {
    this.resetViews();
    this.showUsers = true;
  }

  findUser(): void {
    this.resetViews();
    this.showFindUser = true;
  }

  addBook(): void {
    this.resetViews();
    this.showAddBook = true;
  }

  addUser(): void {
    this.resetViews();
    this.showAddUser = true;
  }

  resetViews(): void {
    this.showUsers = false;
    this.showFindUser = false;
    this.showAddBook = false;
    this.showAddUser = false;
  }

  confirmDelete(user: User): void {
    if (confirm(`Do you want to delete ${user.name}?`)) {
      this.deleteUser(user.username);
    }
  }

  deleteUser(username: string): void {
    this.usersService.deleteUser(username).subscribe(() => {
      this.usersData = this.usersData.filter(user => user.username !== username);
      console.log(`User with username ${username} deleted`);
    });
  }
}
