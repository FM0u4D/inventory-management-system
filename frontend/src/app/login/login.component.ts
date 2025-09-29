import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { firstValueFrom } from 'rxjs';


@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule, CommonModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	constructor(
		private apiService: ApiService,
		private router: Router
	) { }

	formData: any = {
		email: '',
		password: ''
	};

	message: string | null = null;
	loading: boolean = false;

	async handleSubmit() {
		if (!this.formData.email || !this.formData.password) {
			this.showMessage("All fields are required");
			return;
		}

		this.loading = true;
		console.log("LOGIN REQUEST:", this.formData);

		try {
			const response: any = await firstValueFrom(
				this.apiService.loginUser(this.formData)
			);
			console.log("LOGIN RESPONSE:", response);

			if (!response.token || !response.role) {
				this.showMessage("Invalid response from server.");
				return;
			}

			this.apiService.encryptAndSaveToStorage('token', response.token);
			this.apiService.encryptAndSaveToStorage('role', response.role);
			this.apiService.authStatuschanged.emit();

			if (response.role === 'ADMIN') {
				this.router.navigate(['/dashboard']);
			} else {
				this.router.navigate(['/profile']);
			}

		} catch (error: any) {
			console.error("LOGIN ERROR:", error);
			this.showMessage(
				error?.error?.message || error?.message || 'Unable to login. Please try again.'
			);
		} finally {
			this.loading = false;
		}
	}


	showMessage(message: string) {
		this.message = message;
		setTimeout(() => {
			this.message = null;
		}, 4000);
	}
}
