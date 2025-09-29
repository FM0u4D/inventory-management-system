import { Routes } from '@angular/router';
import { GuardService } from './service/guard.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CategoryComponent } from './category/category.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';
import { ProductComponent } from './product/product.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SellComponent } from './sell/sell.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

export const routes: Routes = [

	// Auth routes (no title needed)
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },

	// Admin-only routes with dynamic titles
	{
		path: 'category',
		component: CategoryComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '📂 Manage Categories' }
	},
	{
		path: 'supplier',
		component: SupplierComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '🏭 Manage Suppliers' }
	},
	{
		path: 'edit-supplier/:supplierId',
		component: AddEditSupplierComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '✏️ Edit Supplier' }
	},
	{
		path: 'add-supplier',
		component: AddEditSupplierComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '➕ Add New Supplier' }
	},
	{
		path: 'product',
		component: ProductComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '🛒 Explore Products' }
	},
	{
		path: 'edit-product/:productId',
		component: AddEditProductComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '✏️ Edit Product' }
	},
	{
		path: 'add-product',
		component: AddEditProductComponent,
		canActivate: [GuardService],
		data: { requiresAdmin: true, title: '➕ Add New Product' }
	},

	// General routes
	{
		path: 'purchase',
		component: PurchaseComponent,
		canActivate: [GuardService],
		data: { title: '📦 Purchase Management' }
	},
	{
		path: 'sell',
		component: SellComponent,
		canActivate: [GuardService],
		data: { title: '💸 Sell Products' }
	},
	{
		path: 'transactions',
		component: TransactionComponent,
		canActivate: [GuardService],
		data: { title: '🔁 Transaction History' }
	},
	{
		path: 'transaction/:transactionId',
		component: TransactionDetailsComponent,
		canActivate: [GuardService],
		data: { title: '🔍 Transaction Details' }
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [GuardService],
		data: { title: '👤 My Profile' }
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [GuardService],
		data: { title: '📊 Dashboard Overview' }
	},
	{
		path: 'forbidden',
		component: ForbiddenComponent,
		data: { title: '🚫 Access Forbidden' }
	},

	// Redirects
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{ path: '**', redirectTo: 'dashboard' }
];
