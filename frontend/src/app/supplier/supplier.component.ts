import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-supplier',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
    constructor(private apiService: ApiService, private router: Router) { }
    suppliers: any[] = [];
    message: string = '';

    ngOnInit(): void {
        this.getSuppliers();
    }

    getSuppliers(): void {
        this.apiService.getAllSuppliers().subscribe({
            next: (res: any) => {
                if (res.status === 200) {
                    this.suppliers = res.suppliers;
                } else {
                    this.showMessage(res.message);
                }
            },
            error: (error) => {
                this.showMessage(
                    error?.error?.message ||
                    error?.message ||
                    'Unable to get suppliers' + error
                );
            },
        });
    }

    //Navigate to ass supplier Page
    navigateToAddSupplierPage(): void {
        this.router.navigate([`/add-supplier`]);
    }

    //Navigate to edit supplier Page
    navigateToEditSupplierPage(supplierId: string): void {
        this.router.navigate([`/edit-supplier/${supplierId}`]);
    }

    //Delete a caetgory
    handleDeleteSupplier(supplierId: string): void {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            this.apiService.deleteSupplier(supplierId).subscribe({
                next: (res: any) => {
                    if (res.status === 200) {
                        this.showMessage("Supplier deleted successfully")
                        this.getSuppliers(); //reload the category
                    }
                },
                error: (error) => {
                    this.showMessage(error?.error?.message || error?.message || "Unable to Delete Supplier" + error)
                }
            })
        }
    }

    showMessage(message: string) {
        this.message = message;
        setTimeout(() => {
            this.message = '';
        }, 4000);
    }
}
