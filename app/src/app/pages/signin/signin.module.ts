/* --- PAGES --- */
import { SigninPage } from './signin.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SigninRoutingModule } from './signin-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        SigninRoutingModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        SigninPage
    ]
})

export class SigninModule { }