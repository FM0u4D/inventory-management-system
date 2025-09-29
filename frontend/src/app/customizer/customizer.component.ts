import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomizerService, ThemeMode, NavPosition, VNavStyle } from '../service/customizer.service';


@Component({
	selector: 'app-customizer',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './customizer.component.html',
	styleUrls: ['./customizer.component.css']
})
export class CustomizerComponent implements OnInit {
	@Input() open = false;
	@Output() openChange = new EventEmitter<boolean>();
	@Output() close = new EventEmitter<void>();

	// 👇 declare, but don't read from this.ui yet
	themeMode!: ThemeMode;
	fluid = false;
	navPosition!: NavPosition;
	vnavStyle!: VNavStyle;

	constructor(public ui: CustomizerService) { }

	ngOnInit(): void {
		const p = this.ui.prefs;
		this.themeMode = p.themeMode;
		this.fluid = p.fluid;
		this.navPosition = p.navPosition;
		this.vnavStyle = p.vnavStyle;
	}

	// If you previously had: prefs$ = this.ui.prefs$;
	// replace it with a getter to avoid early access:
	get prefs$() { return this.ui.prefs$; }

	togglePanel() { this.open = !this.open; this.openChange.emit(this.open); }
	closePanel() { this.open = false; this.openChange.emit(false); this.close.emit(); }

	applyThemeMode() { this.ui.setThemeMode(this.themeMode); }
	applyFluid() { this.ui.setFluid(!!this.fluid); }
	applyNavPosition() { this.ui.setNavPosition(this.navPosition); }
	applyVnavStyle() { this.ui.setVnavStyle(this.vnavStyle); }
}
