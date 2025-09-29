import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
	selector: 'app-add-edit-product',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './add-edit-product.component.html',
	styleUrl: './add-edit-product.component.css',
})
export class AddEditProductComponent implements OnInit {

	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

	form!: FormGroup;

	imageFile: File | null = null;              // Store selected image
	imageUrl: string = '';                      // Preview image URL
	isEditing: boolean = false;                 // Flag to differentiate between Add/Edit
	productId: string | null = null;            // Product ID if in edit mode
	categories: any[] = [];                     // List of categories from backend
	message: string = '';                       // Feedback message

	// Endpoint to upload image (optional fallback - not used here directly)
	private imageUploadUrl = 'http://localhost:5050/images/products/';


	constructor(
		private fb: FormBuilder,
		private apiService: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient
	) { }


	ngOnInit(): void {
		this.form = this.fb.group({
			name: ['', Validators.required],
			sku: ['', Validators.required],
			price: ['', Validators.required],
			stockQuantity: ['', Validators.required],
			categoryId: ['', Validators.required],
			description: [''],
		});

		// Read productId from route to determine if in edit mode
		this.productId = this.route.snapshot.paramMap.get('productId');

		// Load categories list
		this.fetchCategories();

		if (this.productId) {
			this.isEditing = true;

			// Fetch product data and populate the form
			this.fetchProductById(this.productId);
		}
	}

	// Fetch list of categories for dropdown
	fetchCategories(): void {
		this.apiService.getAllCategory().subscribe({
			next: (res: any) => {
				if (res.status === 200) {
					this.categories = res.categories;
				}
			},
			error: (error) => {
				this.showMessage(error?.error?.message || error?.message || 'Unable to get all categories');
			},
		});
	}

	// Fetch product by ID for editing
	fetchProductById(productId: string): void {
		this.apiService.getProductById(productId).subscribe({
			next: (res: any) => {
				if (res.status === 200) {
					const product = res.product;
					this.form.patchValue({
						name: product.name,
						sku: product.sku,
						price: product.price,
						stockQuantity: product.stockQuantity,
						categoryId: product.categoryId,
						description: product.description,
					});

					// Set the image preview for editing if product has image
					if (product.imageUrl) { // Added condition to avoid null error
						this.imageUrl = this.imageUploadUrl + product.imageUrl; // Sets preview for backend image
					} else {
						this.imageFile = null;
						this.imageUrl = '';
					}
				} else {
					this.showMessage(res.message);
				}
			},
			error: (error) => {
				this.showMessage(error?.error?.message || error?.message || 'Unable to fetch product');
			},
		});
	}

	// When an image is selected in the input
	onImageSelected(event: Event): void {
		// Type-cast the event target to HTMLInputElement (to access .files)
		const input = event.target as HTMLInputElement;

		// Ensure a file was selected
		if (input.files && input.files.length > 0) {
			this.imageFile = input.files[0]; // Save the selected file

			// Use FileReader to preview the image locally
			const reader = new FileReader();

			// When file is read, assign the result (base64) to imageUrl for preview
			reader.onloadend = () => {
				// Show the uploaded image as preview (overrides existing backend image)
				this.imageUrl = reader.result as string;
			};

			// Start reading the file as a base64-encoded string
			reader.readAsDataURL(this.imageFile);
		} else {
			// If user cleared the input (not via red "X") or no file selected 
			this.imageFile = null;
			this.imageUrl = '';
		}
	}

	// Submit the form (create or update product)
	handleSubmit(event: Event): void {
		event.preventDefault();

		if (this.form.invalid) {
			this.showMessage('Please fill all required fields');
			return;
		}

		const formValue = this.form.value;

		// Build FormData
		const formData = new FormData();
		formData.append('name', formValue.name);
		formData.append('sku', formValue.sku);
		formData.append('price', formValue.price.toString());
		formData.append('stockQuantity', formValue.stockQuantity.toString());
		formData.append('categoryId', formValue.categoryId.toString());
		if (formValue.description) {
			formData.append('description', formValue.description);
		}
		if (this.imageFile) {
			this.imageUrl = `/images/products/${this.imageFile}`; // Set preview to product image URL (When Editing)
			formData.append('imageFile', this.imageFile);
		}
		if (this.isEditing && this.productId) {
			formData.append('productId', this.productId);
		}

		// Call API
		if (this.isEditing) {
			this.apiService.updateProduct(formData).subscribe({
				next: (res: any) => {
					if (res.status === 200) {
						this.showMessage("Product updated successfully");
						this.router.navigate(['/product']);
					}
				},
				error: (error) => {
					this.showMessage(error?.error?.message || error?.message || "Unable to update product");
				}
			});
		} else {
			this.apiService.addProduct(formData).subscribe({
				next: (res: any) => {
					if (res.status === 200) {
						this.showMessage("Product saved successfully");
						this.router.navigate(['/product']);
					}
				},
				error: (error) => {
					this.showMessage(error?.error?.message || error?.message || "Unable to save product");
				}
			});
		}
	}

	// Allow only digits 
	enforceDigitsOnly(event: Event): void {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '');

		// Optional: update the Angular FormControl manually
		const controlName = input.getAttribute('formControlName');
		if (controlName && this.form.get(controlName)) {
			this.form.get(controlName)?.setValue(input.value, { emitEvent: false });
		}
	}

	// Called on drag-over to allow dropping
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
	}

	// Called when a file is dropped
	onFileDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		const file = event.dataTransfer?.files?.[0];
		if (file) {
			this.onImageSelected({ target: { files: [file] } } as any);
		}
	}

	// Clear preview + reset file input
	clearImage(event: Event): void {
		event.stopPropagation(); // prevent re-opening file dialog
		this.imageUrl = '';
		this.imageFile = null;

		if (this.fileInput?.nativeElement) {
			this.fileInput.nativeElement.value = '';
		}
	}

	// Display temporary message
	showMessage(message: string): void {
		this.message = message;
		setTimeout(() => {
			this.message = '';
		}, 6000);
	}
}
