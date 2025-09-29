import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, CdkDragStart } from '@angular/cdk/drag-drop';
import { PaginationComponent } from '../pagination/pagination.component';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, PaginationComponent, FormsModule, DragDropModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
    constructor(private apiService: ApiService, private router: Router, private renderer: Renderer2) { }

    // Full product list fetched from API
    products: any[] = [];

    // Filtered product list to display in view (search + pagination)
    filteredProducts: any[] = [];

    // Search input value (two-way bound)
    searchQuery: string = '';

    // UI state
    message: string = '';
    currentPage: number = 1;
    totalPages: number = 0;
    itemsPerPage: number = 9;
    isGridView: boolean = true;

    grabOffset = { x: 0, y: 0 };
    draggedRow: HTMLElement | null = null;



    ngOnInit(): void {
        // Load view mode from localStorage if available (grid or table)
        const savedView = localStorage.getItem('productViewMode');
        this.isGridView = savedView !== 'table';

        // Fetch product list from API
        this.loadAndFilterProducts()

    }

    // Toggle View Grid/Table
    toggleView(): void {
        this.isGridView = !this.isGridView;
        // Persist the new choice
        localStorage.setItem('productViewMode', this.isGridView ? 'grid' : 'table');
    }

    loadAndFilterProducts(): void {
        const query = this.searchQuery.trim().toLowerCase(); // <--- search keyword

        this.apiService.getAllProducts().subscribe({
            next: (res: any) => {
                const allProducts = (res.products || []).sort((a: any, b: any) => a.position - b.position); // <--- sort by saved position in DB

                // Map each product with imageSrc for display
                this.products = allProducts.map((product: any) => ({
                    ...product,
                    imageSrc: this.buildImageUrl(product.imageUrl),
                }));

                // Apply filtering if a search keyword is present
                const filtered = !query
                    ? [...this.products] // <--- copy of current order
                    : this.products.filter(product =>
                        product.name?.toLowerCase().includes(query) ||
                        product.sku?.toLowerCase().includes(query) ||
                        product.price?.toString().includes(query) ||
                        product.stockQuantity?.toString().includes(query)
                    );

                // Recalculate pagination
                this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

                // Slice the result for current page
                this.filteredProducts = filtered.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                );
            },

            error: (error: any) => {
                this.showMessage(
                    error?.error?.message ||
                    error?.message ||
                    'Unable to fetch products: ' + error
                );
            },
        });
    }


    // Delete product by ID with confirmation
    handleProductDelete(productId: string): void {
        if (window.confirm('Are you sure you want to delete this product?')) {
            this.apiService.deleteProduct(productId).subscribe({
                next: (res: any) => {
                    if (res.status === 200) {
                        this.showMessage('Product deleted successfully');
                        this.loadAndFilterProducts(); // Reload products after deletion
                    }
                },
                error: (error: any) => {
                    this.showMessage(
                        error?.error?.message ||
                        error?.message ||
                        'Unable to delete product: ' + error
                    );
                },
            });
        }
    }

    // Handle pagination change
    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadAndFilterProducts(); // Refresh filtered results for current page
    }

    // Navigate to Add Product page
    navigateToAddProductPage(): void {
        this.router.navigate(['/add-product']);
    }

    // Navigate to Edit Product page
    navigateToEditProductPage(productId: string): void {
        this.router.navigate([`/edit-product/${productId}`]);
    }

    // Construct product image URL with cache-busting
    buildImageUrl(imageFileName: string): string {
        const encoded = encodeURIComponent(imageFileName || '');
        const version = 'v=' + Date.now();
        return `http://localhost:5050/images/products/${encoded}?${version}`;
    }

    // Replace broken images with fallback
    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        if (target.dataset && target.dataset['fallbackApplied'] !== 'true') {
            target.src = 'assets/images/fallback.png';
            target.dataset['fallbackApplied'] = 'true';
        }
    }

    // Show temporary message to user
    showMessage(message: string): void {
        this.message = message;
        setTimeout(() => {
            this.message = '';
        }, 4000);
    }

    onDragStarted(event: CdkDragStart): void {
        const el = event.source.element.nativeElement as HTMLElement;
        this.draggedRow = el;

        // Save offset to keep pointer aligned
        const dragRef: any = (event.source as any)._dragRef;
        const offset = dragRef._pickupPositionInElement;
        this.grabOffset = { x: offset.x, y: offset.y };

        // Inline glowing + animated style
        const glowStyle = {
            transform: 'scale(1.01)',
            opacity: '0.95',
            zIndex: '1000',
            color: '#e0edff',
            textShadow: '0 0 5px #94a3b8, 0 0 10px #b7c6da, 0 0',
            background: 'linear-gradient(to right, #00ff660d, #00ff6614)',
            boxShadow: `
                    0 0 8px 2px #00ff66,       /* outer glow all around */
                    0 0 16px 4px #00ff66aa,    /* wider outer glow */
                    inset 0 0 4px #00ff6633,   /* subtle inner glow */
                    inset 0 0 8px #00ff6655`,
            transition: 'transform 0.15s ease, box-shadow 0.3s ease, background 0.3s ease',
            cursor: 'grab'
        };

        if (this.draggedRow) {
            Object.entries(glowStyle).forEach(([prop, value]) => {
                el.style[prop as any] = value;
            });
            console.log('[+] Inline styles Applied');
        }
    }

    onRowMouseDown(event: MouseEvent): void {
        const el = event.currentTarget as HTMLElement;
        this.draggedRow = el;

        // Apply all styles inline
        const glowStyle = {
            transform: 'scale(1.01)',
            opacity: '0.95',
            zIndex: '1000',
            color: '#e0edff',
            textShadow: '0 0 5px #94a3b8, 0 0 10px #b7c6da, 0 0',
            background: 'linear-gradient(to right, #00ff660d, #00ff6614)',
            boxShadow: `
                    0 0 8px 2px #00ff66,       /* outer glow all around */
                    0 0 16px 4px #00ff66aa,    /* wider outer glow */
                    inset 0 0 4px #00ff6633,   /* subtle inner glow */
                    inset 0 0 8px #00ff6655`,
            transition: 'transform 0.15s ease, box-shadow 0.3s ease, background 0.3s ease',
            cursor: 'grabbing !important'
        };

        Object.entries(glowStyle).forEach(([prop, value]) => {
            el.style[prop as any] = value;
        });
    }

    onDragMoved(event: any): void {
        if (!this.draggedRow) return;

        const x = event.pointerPosition.x - this.grabOffset.x;
        const y = event.pointerPosition.y - this.grabOffset.y;

        this.draggedRow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    onDragEnded(): void {
        if (!this.draggedRow) return;

        const el = this.draggedRow;
        this.draggedRow = null;

        // Clear applied styles after short delay (optional)
        setTimeout(() => {
            el.removeAttribute('style');
            console.log('[-] Inline styles cleaned');
        }, 100);
    }

    dropTableRow(event: CdkDragDrop<any[]>): void {
        // 1. Update the local array immediately for visual feedback
        moveItemInArray(this.products, event.previousIndex, event.currentIndex);

        // 2. Reflect new order visually in filteredProducts
        const query = this.searchQuery.trim().toLowerCase();
        const filtered = !query
            ? this.products
            : this.products.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.sku?.toLowerCase().includes(query) ||
                product.price?.toString().includes(query) ||
                product.stockQuantity?.toString().includes(query)
            );

        // 3. Paginate filtered results immediately
        this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        this.filteredProducts = filtered.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
        );

        // 4. Sync positions to backend (non-blocking)
        const reordered = this.products.map((product, index) => ({
            id: product.id,
            position: index
        }));

        this.apiService.reorderProducts(reordered).subscribe({
            next: () => console.log('[✓] Order persisted'),
            error: err => console.error('[X] Failed to update order:', err)
        });
    }

}

