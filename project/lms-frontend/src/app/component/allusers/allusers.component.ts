import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { BookborrowService } from '../../service/bookborrow.service';
import { CommonModule } from '@angular/common';

interface User {
  memberId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  membershipStatus: string | null;
  userType: string;
  password: string;
  bookcount?: string; // Optional property to store the book count
}

@Component({
  selector: 'app-allusers',
  imports: [FormsModule, CommonModule],
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {
  usersData: User[] = [];
  
  constructor(private usersService: UsersService, private bookborrowService: BookborrowService) { }

  ngOnInit(): void {
    this.fetchUsersData();
  }

  fetchUsersData(): void {
    this.usersService.getAllUsers().subscribe(result => {
      this.usersData = result;
      this.usersData.forEach(user => {
        this.setBookCount(user);
      });
      console.log(this.usersData);
    });
  }

  setBookCount(user: User): void {
    this.bookborrowService.getHoldingBooks(user.memberId).subscribe(result => {
      user.bookcount = result.length.toString(); // Assuming result is an array of books
    });
  }

  confirmDelete(user: User): void {
    if (confirm(`Do you want to delete ${user.name}?`)) {
      if (parseInt(user.bookcount || '0', 10) > 0) {
        alert('The user has borrowed some books and cannot be deleted.');
      } else {
        this.deleteUser(user.memberId);
      }
    }
  }
  

  deleteUser(memberId: string): void {
    this.usersService.deleteUser(memberId).subscribe(() => {
      this.usersData = this.usersData.filter(user => user.memberId !== memberId);
      console.log(`User with memberId ${memberId} deleted`);
    });
  }
}
