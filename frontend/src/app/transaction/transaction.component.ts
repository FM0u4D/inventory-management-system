import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-transaction',
    standalone: true,
    imports: [PaginationComponent, FormsModule, CommonModule],
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {
    constructor(private apiService: ApiService, private router: Router) { }

    transactions: any[] = [];
    message: string = '';
    searchInput: string = '';
    valueToSearch: string = '';
    currentPage: number = 1;
    totalPages: number = 0;
    itemsPerPage: number = 10;

    ngOnInit(): void {
        this.loadTransactions();
    }

    //FETCH Transactions
    loadTransactions(): void {
        this.apiService.getAllTransactions(this.valueToSearch).subscribe({
            next: (res: any) => {
                const transactions = res.transactions || [];

                this.totalPages = Math.ceil(transactions.length / this.itemsPerPage);

                this.transactions = transactions.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                );

            },
            error: (error) => {
                this.showMessage(
                    error?.error?.message ||
                    error?.message ||
                    'Unable to Get all Transactions ' + error
                );
            },
        });
    }

    //HANDLE SERCH
    handleSearch(): void {
        this.currentPage = 1;
        this.valueToSearch = this.searchInput;
        this.loadTransactions()
    }

    //NAVIGATE TGO TRANSACTIONS DETAILS PAGE
    navigateTOTransactionsDetailsPage(transactionId: string): void {
        this.router.navigate([`/transaction/${transactionId}`])
    }

    //HANDLE PAGE CHANGRTE. NAVIGATR TO NEXT< PREVIOUS OR SPECIFIC PAGE CHANGE
    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadTransactions();
    }

    //SHOW ERROR
    showMessage(message: string) {
        this.message = message;
        setTimeout(() => {
            this.message = '';
        }, 4000);
    }
}
