import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
	selector: 'app-pagination',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.css'
})
export class PaginationComponent {

	@Input() currentPage: number = 1;
	@Input() totalPages: number = 1;
	@Output() pageChange = new EventEmitter<number>;

	// Method to generate page numbers
	get pageNumbers() {
		return Array.from({ length: this.totalPages }, (_, i) => i + 1);
	}

	// Method to handle page change
	onPageChange(page: number): void {
		if (page >= 1 && page <= this.totalPages) {
			this.pageChange.emit(page)
		}
	}

}
