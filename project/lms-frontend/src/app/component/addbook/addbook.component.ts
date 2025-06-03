import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../../service/book.service';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../searchbar/searchbar.component';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-addbook',
  imports: [FormsModule, CommonModule, SearchBarComponent, ReactiveFormsModule],
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})


export class AddBookComponent implements OnInit {
addForm: any;


  @ViewChild(SearchBarComponent)
  searchBarComponent: SearchBarComponent = new SearchBarComponent;

viewBookDetails(bookId: number) {
    this.router.navigate(['admindashboard/bookdetails', bookId]);
  }

  book = {
    bookId: '',
    title: '',
    author: '',
    genre: '',
    isbn: '',
    yearPublished: null,
    availableCopies: null
  };

  
  searchResults: Book[] = [];
  isLoading: boolean = false;
  showAddForm: boolean = true;
  showModal: boolean = false;
  books: any[] = [];
  responseMessage: string | null = null;
  errorMessage: string | null = null;
  showPopup: boolean = false;
  addButtonDisabled: boolean = false;
  onSearch = false;

  constructor(
    private bookService: BookService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks() {
  this.bookService.getAllBooks().subscribe({
    next: (data) => {
      this.books = data;
      console.log(this.books);
      if (this.books && this.books.length === 0) {
        // Optionally, you can set a specific message for the "no books" case
        this.errorMessage = ''; // Clear any previous error message
        console.log('No books found in the database.');
        // You might also want to display a user-friendly message in your UI here
      }
    },
    error: (error) => {
      console.error('Error fetching books:', error);
      this.errorMessage = 'Error fetching books: ' + error.message;
    }
  });
}

  showAddBookPopup() {
    this.showPopup = true;
    this.addButtonDisabled = true;
    this.searchResults = [];
    this.showAddForm = true; // Show the add form when the popup is opened
  }

  closePopup() {
    this.showPopup = false;
    this.addButtonDisabled = false;
    this.resetForm();
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



  onSubmit() {
    this.bookService.addBook(this.book).subscribe(
      (response) => {
        this.responseMessage = 'Book added successfully';
        this.errorMessage = null;
        this.closePopup();
        this.fetchBooks();
        this.showModal = true; // Show success modal after adding
      },
      (error) => {
        this.errorMessage = 'Error adding book: ' + error.message;
        this.responseMessage = null;
      }
    );
  }

  closeModal() {
    this.showModal = false; // Ensure this method sets showModal to false
  }

  resetForm() {
    this.book = {
      bookId: '',
      title: '',
      author: '',
      genre: '',
      isbn: '',
      yearPublished: null,
      availableCopies: null
    };
  }

  confirmDelete(book: any): void {
    if (confirm(`Do you want to delete ${book.title}?`)) {
      this.deleteBook(book.bookId);
    }
  }

  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe(
      (response) => {
        this.responseMessage = 'Book deleted successfully';
        this.errorMessage = null;
        console.log("Book deleted successfully");
        this.fetchBooks(); // Refresh the book list after deletion
      },
      (error) => {
        this.errorMessage = 'Error deleting book: ' + error.message;
        this.responseMessage = null;
      }
    );
  }

  editBook(book: any): void {
    this.router.navigate(['/admindashboard/editbook', book.bookId]);
    console.log("Book details edited");
  }
}
