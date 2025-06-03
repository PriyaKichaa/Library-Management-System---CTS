import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../service/book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-book',
  templateUrl: './editbook.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./editbook.component.css']
})
export class EditBookComponent implements OnInit {
  editForm: FormGroup;
  bookId!: number; // Definite assignment assertion
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      isbn: ['', Validators.required],
      yearPublished: ['', Validators.required],
      availableCopies: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookId = +idParam; // Convert string to number
      this.loadBookData();
    } else {
      this.errorMessage = 'No book ID provided';
      this.isLoading = false;
    }
  }

  loadBookData(): void {
    this.bookService.getBookById(this.bookId).subscribe(
      (book) => {
        this.editForm.patchValue({
          title: book.title,
          author: book.author,
          genre: book.genre,
          isbn: book.isbn,
          yearPublished: book.yearPublished,
          availableCopies: book.availableCopies
        });
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load book data';
        this.isLoading = false;
      }
    );
  }

  cleanISBN(isbn: string): string {
    return isbn.replace(/-/g, '');
  }

  onSubmit(): void {
    if (this.editForm.valid) {
        const formData = { ...this.editForm.value,
        isbn: this.cleanISBN(this.editForm.value.isbn) // Clean the ISBN
    };
      this.bookService.updateBook(this.bookId, formData).subscribe(
        () => {
          this.router.navigate(['/admindashboard/addbook']);
          alert('Book updated successfully');
        },
        (error) => {
            console.error('Update error:', error);
          this.errorMessage = error.error.message || 'Failed to update book';
        }
      );
    }
  }

  onCancel(): void {
    this.location.back();
  }
}