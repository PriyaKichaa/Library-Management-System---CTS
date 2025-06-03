import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../../service/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { UsersService } from '../../service/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  isLoading = true;
  errorMessage = '';
  private userSubscription: Subscription | undefined;
  isAdmin: boolean = false; // Property to track if the user is an admin

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.checkAdminStatus();
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loadBookDetails(+bookId);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  checkAdminStatus(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        this.isAdmin = parsedData && parsedData.role === 'ADMIN';
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }

  loadBookDetails(bookId: number): void {
    this.isLoading = true;
    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load book details';
        this.isLoading = false;
      }
    });
  }

  deleteBook(bookId: number | undefined): void {
    if (!bookId) {
      return;
    }
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.router.navigate(['/admindashboard/addbook']);
          alert('Book deleted successfully');
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete book';
          alert('Failed to delete book');
        }
      });
    }
  }

  goBack(): void {
    if (this.isAdmin) {
      this.location.back(); // Use Location service to go back
    } else {
      this.router.navigate(['/userdashboard/allbooks']);
    }
  }
}