import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

export type ThemeMode = 'auto' | 'light' | 'dark';
export type NavPosition = 'combo' | 'vertical' | 'top';
export type VNavStyle = 'default' | 'darker' | 'vibrant';

export interface UiPrefs {
    themeMode: ThemeMode;
    fluid: boolean;
    navPosition: NavPosition;
    vnavStyle: VNavStyle;
}

const STORAGE_KEY = 'ui-prefs-v1';

@Injectable({ providedIn: 'root' })
export class CustomizerService {
    private mql = window.matchMedia?.('(prefers-color-scheme: dark)');

    private _prefs = new BehaviorSubject<UiPrefs>(this.load());
    readonly prefs$ = this._prefs.asObservable().pipe(distinctUntilChanged());

    constructor() {
        // react to OS theme if in auto
        this.mql?.addEventListener?.('change', () => {
            if (this._prefs.value.themeMode === 'auto') this.apply(this._prefs.value);
        });

        // initial apply
        this.apply(this._prefs.value);
    }

    get prefs(): UiPrefs { return this._prefs.value; }

    setThemeMode(themeMode: ThemeMode) {
        const next = { ...this._prefs.value, themeMode };
        this.commit(next);
    }
    setFluid(fluid: boolean) {
        const next = { ...this._prefs.value, fluid };
        this.commit(next);
    }
    setNavPosition(navPosition: NavPosition) {
        const next = { ...this._prefs.value, navPosition };
        this.commit(next);
    }
    setVnavStyle(vnavStyle: VNavStyle) {
        const next = { ...this._prefs.value, vnavStyle };
        this.commit(next);
    }

    // ---- internals
    private commit(p: UiPrefs) {
        this._prefs.next(p);
        this.apply(p);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    }

    private load(): UiPrefs {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw) as UiPrefs;
        } catch { }
        return { themeMode: 'auto', fluid: false, navPosition: 'combo', vnavStyle: 'default' };
    }

    private apply(p: UiPrefs) {
        const body = document.body;

        // theme
        const osDark = this.mql?.matches ?? false;
        const dark = p.themeMode === 'dark' || (p.themeMode === 'auto' && osDark);
        body.classList.toggle('theme-dark', dark);

        // fluid container
        body.classList.toggle('layout-fluid', p.fluid);

        // nav position
        body.classList.remove('nav-pos-combo', 'nav-pos-vertical', 'nav-pos-top');
        body.classList.add(`nav-pos-${p.navPosition}`);

        // vertical nav skin
        body.classList.remove('vnav-default', 'vnav-darker', 'vnav-vibrant');
        body.classList.add(`vnav-${p.vnavStyle}`);
    }
}
