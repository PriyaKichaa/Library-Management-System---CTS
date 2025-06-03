import { Component, OnInit } from '@angular/core';
import { BookborrowService } from '../../service/bookborrow.service';
import { BookService } from '../../service/book.service';
import { CommonModule } from '@angular/common';

interface BorrowingTransaction {
  transactionId: number;
  bookId: number;
  memberId: string;
  borrowDate: string;
  returnDate: string;
  expectedDate: string;
  amount?: string;
  status: string;
  bookName?: string; // Optional property to store the book name
}

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  transactions: BorrowingTransaction[] = [];
  totalfine: number = 0;
  historyExist: boolean = false; // Use boolean instead of string

  constructor(private bookborrowService: BookborrowService, private bookService: BookService) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    const memberId = localStorage.getItem('memberId');
    if (memberId) {
      this.bookborrowService.getBorrowingHistory(memberId).subscribe(
        result => {
          this.transactions = result;
          this.historyExist = this.transactions.length === 0; // Set historyExist based on transactions length
          this.transactions.forEach(transaction => {
            this.findBookName(transaction);
          });
        },
        (error) => {
          console.error('Error fetching transactions', error);
        }
      );
    } else {
      console.error('No memberId found in local storage');
    }
  }

  findBookName(transaction: BorrowingTransaction): void {
    this.bookService.getBookById(transaction.bookId).subscribe(
      (data: any) => {
        transaction.bookName = data.title; // Assuming the book data has a 'title' property
        if (!transaction.returnDate) {
          transaction.returnDate = 'need to be returned';
        }

        const currentDate = new Date();
        const expectedDate = new Date(transaction.expectedDate);
        const diffTime = currentDate.getTime() - expectedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays);
        if (diffDays > 0 && transaction.status === 'Borrowed') {
          transaction.amount = diffDays.toString();
          this.totalfine += diffDays;
        } else {
          transaction.amount = '0';
        }
      },
      (error) => {
        console.error('Error fetching book data:', error);
      }
    );
  }

  confirmReturn(book: BorrowingTransaction): void {
    if (confirm(`Do you want to return ${book.bookName}?`)) {
      this.bookToLib(book);
    }
  }

  bookToLib(book: BorrowingTransaction): void {
    const bookData = { memberId: book.memberId, bookId: book.bookId };
    this.bookborrowService.returnBook(bookData).subscribe(
      response => {
        console.log('Book returned successfully', response);
        this.getTransactions(); // Refresh the transactions list
      },
      (error) => {
        console.error('Error returning book:', error);
      }
    );
  }


}
