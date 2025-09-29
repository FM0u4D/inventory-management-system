import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GuardService } from '../service/guard.service';
import { of, switchMap } from 'rxjs';



@Component({
	selector: 'app-transaction-details',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './transaction-details.component.html',
	styleUrl: './transaction-details.component.css',
})
export class TransactionDetailsComponent implements OnInit {

	constructor(
		private apiService: ApiService,
		private route: ActivatedRoute,
		private router: Router,
		private guard: GuardService
	) { }


	transactionId: string | null = '';
	transaction: any = null;
	status: string = '';
	message: string = ''

	ngOnInit(): void {
		//extract transaction id from routes
		this.route.params.subscribe(params => {
			this.transactionId = params['transactionId'];
			this.getTransactionDetails();
		})
	}

	getTransactionDetails(): void {
		if (!this.transactionId) return;

		this.apiService.getTransactionById(this.transactionId)
			.pipe(
				switchMap((res: any) => {
					// Accept common shapes: {transaction: {...}} | {data: {...}} | raw body
					const t = res?.transaction ?? res?.data ?? res;

					if (!t) {
						this.showMessage('Transaction payload is empty.');
						return of(null);
					}

					// Set base transaction + status immediately so UI can render
					this.transaction = t;
					this.status = t.status ?? '';

					// Decide what needs enrichment
					const needProduct = (!t.product || !t.product?.name) && !!t.productId;
					// Only fetch supplier if admin wants to see it AND we only have the ID
					const needSupplier = this.isAdmin && (!t.supplier || !t.supplier?.name) && !!t.supplierId;

					if (!needProduct && !needSupplier) {
						return of(null); // nothing else to fetch
					}

					// Fetch product first (if needed), then supplier (if needed)
					return (needProduct ? this.apiService.getProductById(String(t.productId)) : of(null)).pipe(
						switchMap((p: any) => {
							if (p) this.transaction = { ...this.transaction, product: p };
							return needSupplier ? this.apiService.getSupplierById(String(t.supplierId)) : of(null);
						})
					);
				})
			)
			.subscribe({
				next: (supplier: any) => {
					if (supplier) this.transaction = { ...this.transaction, supplier };
				},
				error: (error) => {
					this.showMessage(
						error?.error?.message ||
						error?.message ||
						'Unable to Get Transaction by id ' + error
					);
				}
			});
	}

	//UPDATE STATUS
	handleUpdateStatus(): void {
		if (this.transactionId && this.status) {
			this.apiService.updateTransactionStatus(this.transactionId, this.status).subscribe({
				next: (result) => {
					this.router.navigate(['/transactions'])
				},
				error: (error) => {
					this.showMessage(
						error?.error?.message ||
						error?.message ||
						'Unable to Update a Transaction ' + error
					);
				}
			})
		}
	}

	//SHOW ERROR
	showMessage(message: string) {
		this.message = message;
		setTimeout(() => {
			this.message = '';
		}, 4000);
	}

	// (optional) if roles can change at runtime, use a getter instead:
	get isAdmin(): boolean {
		return this.guard.isAdmin();
	}

	get t() { return this.transaction as any; } // shorthand

	// Product fallbacks
	/** Small helper: coerce to number when possible (for currency pipe) */
	private toNumber(v: any): number | null {
		if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return null;
		return Number(v);
	}

	/** Try multiple common DTO shapes: product, productDto, productResponse… */
	private get productObj(): any {
		const t: any = this.t;
		return t?.product
			?? t?.productDto
			?? t?.productDTO
			?? t?.productResponse
			?? t?.product_response
			?? null;
	}

	/* ---------- Product fallbacks (robust to various DTOs/casings) ---------- */
	get productName(): string {
		const p = this.productObj;
		return p?.name
			?? p?.productName
			?? this.t?.productName
			?? this.t?.product_name
			?? '—';
	}

	get productSku(): string {
		const p = this.productObj;
		return p?.sku
			?? p?.skuCode
			?? p?.code
			?? this.t?.productSku
			?? this.t?.sku
			?? '—';
	}

	get productPrice(): number | null {
		const p = this.productObj;
		const raw =
			p?.price
			?? p?.unitPrice
			?? this.t?.productPrice
			?? this.t?.price;
		return this.toNumber(raw); // currency pipe needs a number
	}

	get productStock(): number | string {
		const p = this.productObj;
		const raw =
			p?.stockQuantity
			?? p?.stockQty
			?? p?.quantity
			?? this.t?.productStockQuantity
			?? this.t?.stockQuantity
			?? this.t?.qty;
		return raw ?? '—';
	}

	get productDescription(): string {
		const p = this.productObj;
		return p?.description
			?? this.t?.productDescription
			?? '—';
	}

	get productImageUrl(): string | null {
		const p = this.productObj;
		return p?.imageUrl
			?? p?.image
			?? this.t?.productImageUrl
			?? null;
	}


	// Supplier fallbacks (SELL may not have supplier; show dashes gracefully)
	get supplierName(): string {
		return this.t?.supplier?.name ?? this.t?.supplierName ?? '—';
	}
	get supplierAddress(): string {
		return this.t?.supplier?.address ?? this.t?.supplierAddress ?? '—';
	}

}
