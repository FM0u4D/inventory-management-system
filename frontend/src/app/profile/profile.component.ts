import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';


@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    constructor(private apiService: ApiService) { }
    user: any = null
    message: string = "";

    ngOnInit(): void {
        this.fetchUserInfo();
    }

    fetchUserInfo(): void {
        this.apiService.getLoggedInUserInfo().subscribe({
            next: (res) => {
                this.user = res;
            },
            error: (error) => {
                this.showMessage(
                    error?.error?.message ||
                    error?.message ||
                    'Unable to Get Profile Info' + error
                );
            }
        })
    }

    //SHOW ERROR
    showMessage(message: string) {
        this.message = message;
        setTimeout(() => {
            this.message = '';
        }, 4000);
    }
}
