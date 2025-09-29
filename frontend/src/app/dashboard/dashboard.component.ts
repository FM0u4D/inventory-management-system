import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';


@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, NgxChartsModule],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

	totalUsers = 0;
	totalProducts = 0;
	totalSuppliers = 0;

	usersOnlineRightNow = 0;
	sessionsByBrowser = [{ name: 'This Browser', value: 1 }];
	pvsSeries: any[] = [];
	mostActive: any[] = [];
	usersByCountry: Array<{ name: string; value: number }> = [];
	usersByCountryLoaded = false;
	usersAtTime: any[] = [];

	// Use Color objects (name/selectable/group/domain)
	readonly schemeCool: Color = { name: 'coolCustom', selectable: true, group: ScaleType.Ordinal, domain: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'] };
	readonly schemeBars: Color = { name: 'barsCustom', selectable: true, group: ScaleType.Ordinal, domain: ['#3b82f6'] };
	readonly schemeMulti: Color = { name: 'multiCustom', selectable: true, group: ScaleType.Ordinal, domain: ['#3b82f6', '#10b981'] };

	// Tuple, not number[]
	viewTall: [number, number] = [1200, 320];

	constructor(private api: ApiService) { }

	ngOnInit(): void {
		this.loadCounts();               // totals + usersByCountry
		this.loadTransactionsForStats(); // the rest of the charts
	}

	private loadCounts() {
		// Users
		this.api.getAllUsers().subscribe({
			next: (res: any) => {
				const users = (res?.users || []);
				this.totalUsers = users.length;

				// Build Users By Country from users payload (no extra API needed)
				this.usersByCountryLoaded = false;
				try {
					this.usersByCountry = this.buildUsersByCountry(users);
				} finally {
					this.usersByCountryLoaded = true; // ensure panel renders even on empty
				}
			},
			error: () => {
				// Still mark loaded so the empty-state can render
				this.usersByCountry = [];
				this.usersByCountryLoaded = true;
			}
		});

		// Products
		this.api.getAllProducts().subscribe({
			next: (res: any) => this.totalProducts = (res?.products || []).length
		});

		// Suppliers
		this.api.getAllSuppliers().subscribe({
			next: (res: any) => this.totalSuppliers = (res?.suppliers || []).length
		});
	}

	private buildUsersByCountry(users: any[]): Array<{ name: string; value: number }> {
		// Tries multiple common keys for country; falls back to "Unknown"
		const pickCountry = (u: any): string => {
			return (
				u?.country ??
				u?.address?.country ??
				u?.location?.country ??
				u?.profile?.country ??
				'Unknown'
			);
		};

		const map = new Map<string, number>();
		for (const u of users) {
			const c = String(pickCountry(u) || 'Unknown').trim() || 'Unknown';
			map.set(c, (map.get(c) || 0) + 1);
		}

		return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
	}

	private loadTransactionsForStats() {
		this.api.getAllTransactions(0, 5000, '').subscribe({
			next: (res: any) => {
				const txs = res?.transactions || [];
				const now = Date.now();

				// users online (proxy: distinct users in last 10 min)
				try {
					const tenMinAgo = now - 10 * 60 * 1000;
					const recentTxs = txs.filter((t: any) => new Date(t.createdAt).getTime() >= tenMinAgo);
					const distinctUsers = new Set(recentTxs.map((t: any) => t.user?.id).filter((x: any) => !!x));
					this.usersOnlineRightNow = distinctUsers.size || 1;
				} catch { this.usersOnlineRightNow = 1; }

				// most active (by type)
				const typeMap = new Map<string, number>();
				for (const t of txs) {
					const key = t.transactionType || 'UNKNOWN';
					typeMap.set(key, (typeMap.get(key) || 0) + 1);
				}
				this.mostActive = Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }));

				// pvs per second (last minute)
				const oneMinAgo = now - 60 * 1000;
				const lastMinute = txs
					.filter((t: any) => new Date(t.createdAt).getTime() >= oneMinAgo)
					.map((t: any) => Math.floor(new Date(t.createdAt).getTime() / 1000));
				const perSecond = new Map<number, number>();
				for (const s of lastMinute) perSecond.set(s, (perSecond.get(s) || 0) + 1);
				const sortedSeconds = Array.from(perSecond.keys()).sort((a, b) => a - b);
				this.pvsSeries = sortedSeconds.map(sec => ({
					name: new Date(sec * 1000).toLocaleTimeString(),
					value: perSecond.get(sec)!
				}));

				// users at time (per minute last hour)
				const oneHourAgo = now - 60 * 60 * 1000;
				const lastHour = txs
					.filter((t: any) => new Date(t.createdAt).getTime() >= oneHourAgo)
					.map((t: any) => {
						const d = new Date(t.createdAt);
						d.setSeconds(0, 0);
						return d.getTime();
					});
				const perMinute = new Map<number, number>();
				for (const m of lastHour) perMinute.set(m, (perMinute.get(m) || 0) + 1);
				const sortedMinutes = Array.from(perMinute.keys()).sort((a, b) => a - b);
				this.usersAtTime = sortedMinutes.map(ms => ({
					name: new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
					value: perMinute.get(ms)!
				}));
			}
		});
	}

	/** Safe boolean for the template (no risk of undefined) */
	get hasUsersByCountry(): boolean {
		return (this.usersByCountry?.length ?? 0) > 0;
	}
}
