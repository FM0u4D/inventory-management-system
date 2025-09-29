import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = 'http://localhost:5050/api/products';  // Change if needed
    private imageUploadUrl = 'http://localhost:5050/api/images/upload';

    constructor(private http: HttpClient) { }

    // Upload image file and return filename from backend
    uploadImage(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('image', file);

        return this.http.post(this.imageUploadUrl, formData, {
            responseType: 'text'
        });
    }

    // Example method to add a product (modify as per your real backend)
    addProduct(productData: any): Observable<any> {
        return this.http.post(this.baseUrl, productData);
    }

    // More methods for list, delete, update as needed yet to be implemented !
}
