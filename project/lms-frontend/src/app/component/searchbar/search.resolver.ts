import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookService } from '../../service/book.service';
import { Book } from '../../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class SearchResolver implements Resolve<Book[] | null> {
  constructor(private bookService: BookService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Book[] | null> {
    const searchType = route.queryParamMap.get('type');
    const searchQuery = route.queryParamMap.get('query');

    if (!searchType || !searchQuery?.trim()) {
      return of(null);
    }

    const searchMethod = this.getSearchMethod(searchType);
    return searchMethod ? searchMethod(searchQuery.trim()).pipe(
      catchError(() => of(null))
    ) : of(null);
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