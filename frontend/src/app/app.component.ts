import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ApiService } from './service/api.service';
import { CustomizerComponent } from './customizer/customizer.component';
import { SharedModule } from './shared/shared.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, CustomizerComponent, SharedModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
	
    pageTitle: string | null = null;
    customizerOpen = false;
    collapsed = false;
    expanded = { main: true, app: true, user: true };

    // ViewChildren for MAIN, APP, USER
    @ViewChild('menuLabelMain') menuLabelMain!: ElementRef;
    @ViewChild('glowLineMain') glowLineMain!: ElementRef;

    @ViewChild('menuLabelApp') menuLabelApp!: ElementRef;
    @ViewChild('glowLineApp') glowLineApp!: ElementRef;

    @ViewChild('menuLabelUser') menuLabelUser!: ElementRef;
    @ViewChild('glowLineUser') glowLineUser!: ElementRef;

    @ViewChild('sidebar') sidebarRef!: ElementRef;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) { }


    ngOnInit(): void {
        // Token check and redirection logic
        const token = this.apiService.getFromStorageAndDecrypt('token');
        const currentUrl = this.router.url;

        if (!token && !currentUrl.includes('/login') && !currentUrl.includes('/register')) {
            this.router.navigate(['/login']);
            this.cdr.detectChanges(); // ensure re-rendering after redirect
        }

        // Load sidebar collapsed state from LocalStorage
        const storedSidebar = localStorage.getItem('sidebar-collapsed');
        this.collapsed = storedSidebar === 'true';

        // Dynamic page title based on route's data.title
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let active = this.route.root;
                    while (active.firstChild) {
                        active = active.firstChild;
                    }
                    return active.snapshot.data['title'] || null;
                })
            )
            .subscribe(title => {
                this.pageTitle = title;
                this.cdr.detectChanges(); // ensure UI updates when title changes
            });
    }


    ngAfterViewInit(): void {
        if (this.menuLabelMain && this.glowLineMain) {
            this.setGlowLineWidth(this.menuLabelMain, this.glowLineMain);
        } else {
            console.warn('menuLabelMain/glowLineMain is undefined at ngAfterViewInit');
        }
        if (this.menuLabelApp && this.glowLineApp) {
            this.setGlowLineWidth(this.menuLabelApp, this.glowLineApp);
        } else {
            console.warn('menuLabelApp/glowLineApp is undefined at ngAfterViewInit');
        }
        if (this.menuLabelUser && this.glowLineUser) {
            this.setGlowLineWidth(this.menuLabelUser, this.glowLineUser);
        } else {
            console.warn('menuLabelApp/glowLineApp is undefined at ngAfterViewInit');
        }
    }

    private setGlowLineWidth(labelRef: ElementRef, lineRef: ElementRef): void {
        if (!labelRef?.nativeElement || !lineRef?.nativeElement) return;

        const labelWidth = labelRef.nativeElement.offsetWidth;
        const totalOffset = labelWidth + 12; // include margin

        this.renderer.setStyle(lineRef.nativeElement, 'width', `calc(100% - ${totalOffset}px)`);
    }

    isAuth(): boolean {
        return this.apiService.isAuthenticated();
    }

    isAuthRoute(): boolean {
        return this.router.url.includes('/login') || this.router.url.includes('/register');
    }

    isAdminRole(): boolean {
        return this.apiService.isAdmin();
    }

    isAdmin(): boolean {
        return this.apiService.isAdmin();
    }

    isAdminOrManager(): boolean {
        const role = this.apiService.getFromStorageAndDecrypt('role');
        return role === 'ADMIN' || role === 'MANAGER';
    }

    toggleSidebar(): void {
        this.collapsed = !this.collapsed;
        localStorage.setItem('sidebar-collapsed', this.collapsed.toString());
    }

    toggleGroup(group: 'main' | 'app' | 'user') {
        this.expanded[group] = !this.expanded[group];
    }

    logOut(): void {
        this.apiService.logout();
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
    }

    openCustomizer() {
        this.customizerOpen = true;
    }

    closeCustomizer() {
        this.customizerOpen = false;
    }

    title(title: any) {
		return this.pageTitle;
	}
}
