import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../service/book.service';
import { BookborrowService } from '../../service/bookborrow.service';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../searchbar/searchbar.component';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-allbooks',
  imports: [CommonModule,SearchBarComponent, FormsModule],
  templateUrl: './allbooks.component.html',
  styleUrl: './allbooks.component.css'
})
export class AllbooksComponent implements OnInit {

  @ViewChild(SearchBarComponent)
  searchBarComponent: SearchBarComponent = new SearchBarComponent;

  book = {
    bookId: '',
    title: '',
    author: '',
    genre: '',
    isbn: '',
    yearPublished: null,
    availableCopies: null
  };

  showAddForm: boolean = true;
  onSearch = false;
  searchResults: Book[] = [];
  isLoading: boolean = false;
  books: any[] = [];
  errorMessage: string | null = null;
  borrowMessage: string | null = null; // To display borrow success/error messages
  isAdmin: boolean = false; // Flag to check if the user is an admin

  constructor(
    private bookService: BookService,
    private bookBorrowService: BookborrowService, // Inject the borrow service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.fetchBooks();
  }

  checkAdminStatus(): void {
    const userRole = localStorage.getItem('role');
    if (userRole === 'admin') {
      this.isAdmin = true;
    }
  }
  fetchBooks() {
    this.bookService.getAllBooks().subscribe(
      (data) => {
        this.books = data;
        console.log(this.books);
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.errorMessage = 'Error fetching books: ' + error.message;
      }
    );
  }

  confirmBorrow(book: any): void {
    book.availableCopies = book.availableCopies - 1; // Decrease available copies by 1
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      alert('You must be logged in to borrow a book.');
      return;
    }
    if (confirm(`Do you want to borrow "${book.title}"?`)) {
      const bookdata = { memberId: memberId, bookId: book.bookId };
      this.borrowBook(bookdata);
    }
  }

  borrowBook(borrowData: any): void {
    this.bookBorrowService.borrowOneBook(borrowData).subscribe(
      (response) => {
        console.log('Book borrowed successfully:', response);
        this.borrowMessage = `"${this.books.find(b => b.bookId === borrowData.bookId)?.title}" borrowed successfully!`;
        // Optionally, you might want to update the book list to reflect the borrowed status
        this.fetchBooks();
        setTimeout(() => {
          this.borrowMessage = null; // Clear the message after a few seconds
        }, 3000);
      },
      (error) => {
        console.error('Error borrowing book:', error);
        this.borrowMessage = 'Error borrowing book: ' + (error.error?.message || error.message);
        setTimeout(() => {
          this.borrowMessage = null; // Clear the message after a few seconds
        }, 3000);
      }
    );
  }

  handleSearch(searchData: { query: string, option: string }): void {
      this.isLoading = true;
      this.showAddForm = false; // Hide the add form when searching
      this.searchResults = [];
      this.onSearch = true; // Set onSearch to true when searching
      const searchMethod = this.getSearchMethod(searchData.option);
      if (searchMethod) {
        searchMethod(searchData.query).subscribe({
          next: (results: Book[]) => {
            this.searchResults = results;
            this.isLoading = false;
            if(this.searchBarComponent){
              this.searchBarComponent.isLoading=false;
            }
          },
          error: () => {
            this.searchResults = [];
            this.isLoading = false;
            if(this.searchBarComponent){
              this.searchBarComponent.isLoading=false;
            }
          }
        });
      }
    }
  
    clearSearch(): void {
      this.searchResults = [];
      this.showAddForm = true; // Show the add form again
      this.onSearch=false; // Reset onSearch when clearing search
      this.isLoading = false;
    }
  
    private getSearchMethod(type: string): ((query: string) => Observable<Book[]>) | null {
      switch (type) {
        case 'title': return q => this.bookService.searchBooksByTitle(q);
        case 'author': return q => this.bookService.searchBooksByAuthor(q);
        case 'genre': return q => this.bookService.searchBooksByGenre(q);
        default: return null;
      }
    }

}