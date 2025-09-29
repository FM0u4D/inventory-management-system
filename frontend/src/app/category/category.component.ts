import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


interface Category {
	id: string;
	name: string;
}

@Component({
	selector: 'app-category',
	standalone: true,
	imports: [CommonModule, FormsModule, DragDropModule],
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
	categories: Category[] = [];
	categoryName = '';
	message = '';
	isEditing = false;
	editingCategoryId: string | null = null;

	constructor(private apiService: ApiService) { }

	ngOnInit(): void {
		this.getCategories();
	}

	isAdmin(): boolean {
		return this.apiService.isAdmin();
	}

	drop(event: CdkDragDrop<Category[]>): void {
		if (!this.isAdmin()) return;  // silently exit if not admin

		// Optimistically reorder in the UI
		const previous = [...this.categories];
		moveItemInArray(this.categories, event.previousIndex, event.currentIndex);

		const orderedIds = this.categories.map(c => c.id);

		// Persist re-order
		this.apiService.updateCategoryOrder(orderedIds).subscribe({
			error: (err) => {
				// Revert if something fails
				this.categories = previous;
				this.showMessage(
					err?.error?.message || err?.message || `Failed to save new category order ! \n${err}`
				);
			}
		});
	}

	getCategories(): void {
		this.apiService.getAllCategory().subscribe({
			next: (res: any) => {
				if (res.status === 200) {
					this.categories = res.categories;
				}
			},
			error: (error) => {
				this.showMessage(
					error?.error?.message ||
					error?.message ||
					'Unable to get all categories' + error
				);
			},
		});
	}

	addCategory(): void {
		if (!this.categoryName) {
			this.showMessage('Category name is required');
			return;
		}
		this.apiService.createCategory({ name: this.categoryName }).subscribe({
			next: (res: any) => {
				if (res.status === 200) {
					this.showMessage('Category added successfully');
					this.categoryName = '';
					this.getCategories();
				}
			},
			error: (error) => {
				this.showMessage(
					error?.error?.message ||
					error?.message ||
					'Unable to save category' + error
				);
			},
		});
	}

	editCategory(): void {
		if (!this.editingCategoryId || !this.categoryName) {
			return;
		}
		this.apiService
			.updateCategory(this.editingCategoryId, { name: this.categoryName })
			.subscribe({
				next: (res: any) => {
					if (res.status === 200) {
						this.showMessage('Category updated successfully');
						this.categoryName = '';
						this.isEditing = false;
						this.getCategories();
					}
				},
				error: (error) => {
					this.showMessage(
						error?.error?.message ||
						error?.message ||
						'Unable to edit category' + error
					);
				},
			});
	}

	handleEditCategory(category: Category): void {
		this.isEditing = true;
		this.editingCategoryId = category.id;
		this.categoryName = category.name;
	}

	handleDeleteCategory(categoryId: string): void {
		if (window.confirm('Are you sure you want to delete this category?')) {
			this.apiService.deleteCategory(categoryId).subscribe({
				next: (res: any) => {
					if (res.status === 200) {
						this.showMessage('Category deleted successfully');
						this.getCategories();
					}
				},
				error: (error) => {
					this.showMessage(
						error?.error?.message ||
						error?.message ||
						'Unable to Delete category' + error
					);
				},
			});
		}
	}

	showMessage(message: string) {
		this.message = message;
		setTimeout(() => {
			this.message = '';
		}, 4000);
	}
}
