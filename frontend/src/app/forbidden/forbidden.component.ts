import { Router } from '@angular/router';
import { Component } from '@angular/core';


@Component({
	selector: 'app-forbidden',
	templateUrl: './forbidden.component.html',
	styleUrls: ['./forbidden.component.css']
})


export class ForbiddenComponent {
	constructor(private router: Router) { }

	goToDashboard() {
		this.router.navigate(['/']);
	}
}
