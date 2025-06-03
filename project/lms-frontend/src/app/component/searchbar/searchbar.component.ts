import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchBarComponent {
  searchQuery = '';
  searchOption = 'title'; // Default search option
  isLoading = false;
  
   // This property is not used in the component, but can be used for additional logic if needed.
  @Output() search = new EventEmitter<{query: string, option: string}>();
  @Output() searchCleared = new EventEmitter<void>();

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
     console.log(this.searchOption);
     
      
      this.search.emit({
        query: this.searchQuery.trim(),
        option: this.searchOption
      });
      this.isLoading=false;
      // Note: Caller should set isLoading to false when search completes
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchCleared.emit();
    this.isLoading = false;
  
  }
}
