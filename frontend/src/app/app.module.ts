import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
    declarations: [
        AppComponent,
        AddEditProductComponent,
        ForbiddenComponent,

    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,       // For Reactive Forms
        FormsModule,               // Optional if still mixing ngModel
        HttpClientModule           // For API calls
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
