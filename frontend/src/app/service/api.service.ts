import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from 'crypto-js';


@Injectable({ providedIn: 'root' })
export class ApiService {
    authStatuschanged = new EventEmitter<void>();
    // NOTE: backend already serves under /api
    public static readonly BASE_URL = 'http://localhost:5050/api';
    private static readonly ENCRYPTION_KEY = '4GI_IMS';

    constructor(private http: HttpClient) { }

    // ---------- storage helpers ----------
    encryptAndSaveToStorage(key: string, value: string): void {
        const encrypted = CryptoJS.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
        localStorage.setItem(key, encrypted);
    }

    public getFromStorageAndDecrypt(key: string): string | null {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return CryptoJS.AES.decrypt(encrypted, ApiService.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        } catch {
            return null;
        }
    }

    private clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    private getHeader(): HttpHeaders {
        const token = this.getFromStorageAndDecrypt('token');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    // ---------- auth & users ----------
    authHeaders() {
        const token = this.getFromStorageAndDecrypt('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    registerUser(body: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
    }

    loginUser(body: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
    }

    getLoggedInUserInfo(): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/users/current`, { headers: this.getHeader() });
    }

    getAllUsers(): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/users/all`, {
            headers: this.getHeader(),
        });
    }

    // ---------- categories ----------
    createCategory(body: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, { headers: this.getHeader() });
    }

    getAllCategory(): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/categories/all`, { headers: this.getHeader() });
    }

    getCategoryById(id: string): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/categories/${id}`, { headers: this.getHeader() });
    }

    updateCategory(id: string, body: any): Observable<any> {
        return this.http.put(`${ApiService.BASE_URL}/categories/update/${id}`, body, { headers: this.getHeader() });
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, { headers: this.getHeader() });
    }

    updateCategoryOrder(orderedIds: string[]) {
        const url = `${ApiService.BASE_URL}/categories/reorder`;
        return this.http.put(url, orderedIds, { headers: this.authHeaders() });
    }

    // ---------- suppliers ----------
    addSupplier(body: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/suppliers/add`, body, { headers: this.getHeader() });
    }

    getAllSuppliers(): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/suppliers/all`, { headers: this.getHeader() });
    }

    getSupplierById(id: string): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`, { headers: this.getHeader() });
    }

    updateSupplier(id: string, body: any): Observable<any> {
        return this.http.put(`${ApiService.BASE_URL}/suppliers/update/${id}`, body, { headers: this.getHeader() });
    }

    deleteSupplier(id: string): Observable<any> {
        return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`, { headers: this.getHeader() });
    }

    // ---------- products ----------
    addProduct(formData: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/products/add`, formData, { headers: this.getHeader() });
    }

    updateProduct(formData: any): Observable<any> {
        return this.http.put(`${ApiService.BASE_URL}/products/update`, formData, { headers: this.getHeader() });
    }

    getAllProducts(): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/products/all`, { headers: this.getHeader() });
    }

    getProductById(id: string): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/products/${id}`, { headers: this.getHeader() });
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`, { headers: this.getHeader() });
    }

    reorderProducts(products: { id: string, position: number }[]) {
        const url = `${ApiService.BASE_URL}/products/reorder`;
        return this.http.put(url, products, { headers: this.authHeaders() });
    }

    // ---------- transactions ----------
    purchaseProduct(body: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/transactions/purchase`, body, { headers: this.getHeader() });
    }

    sellProduct(body: any): Observable<any> {
        return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, { headers: this.getHeader() });
    }

    // Overloads (so callers can do getAllTransactions() or getAllTransactions(0,50,'foo') or getAllTransactions('foo'))
    getAllTransactions(): Observable<any>;
    getAllTransactions(searchText: string): Observable<any>;
    getAllTransactions(page: number, size: number, searchText?: string): Observable<any>;
    getAllTransactions(pageOrSearch?: number | string, size?: number, searchText?: string): Observable<any> {
        const url = `${ApiService.BASE_URL}/transactions/all`;

        let params: Record<string, any>;
        if (typeof pageOrSearch === 'string') {
            params = { page: 0, size: 50, searchText: pageOrSearch };
        } else if (typeof pageOrSearch === 'number') {
            params = { page: pageOrSearch, size: size ?? 50, searchText: searchText ?? '' };
        } else {
            params = { page: 0, size: 50, searchText: '' };
        }

        return this.http.get(url, { params, headers: this.getHeader() });
    }

    getTransactionById(id: string): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, { headers: this.getHeader() });
    }

    updateTransactionStatus(id: string, status: string): Observable<any> {
        return this.http.put(
            `${ApiService.BASE_URL}/transactions/update/${id}`,
            JSON.stringify(status),
            { headers: this.getHeader().set('Content-Type', 'application/json') }
        );
    }

    getTransactionsByMonthAndYear(month: number, year: number): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
            headers: this.getHeader(),
            params: { month, year }
        });
    }

    // ---------- auth utils ----------
    logout(): void { this.clearAuth(); }
    isAuthenticated(): boolean { return !!this.getFromStorageAndDecrypt('token'); }
    isAdmin(): boolean { return this.getFromStorageAndDecrypt('role') === 'ADMIN'; }

    getDebugAuth(): Observable<any> {
        return this.http.get(`${ApiService.BASE_URL}/debug-auth`, { headers: this.getHeader(), responseType: 'text' as any });
    }
}
