import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-signin',
    styleUrls: ['./signin.page.scss'],
    templateUrl: './signin.page.html'
})

export class SigninPage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private router: Router, private service: DeviceService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'username': new FormControl('', [Validators.required]),
        'password': new FormControl('', [Validators.required])
    });
    public errors: any = {
        'username': '',
        'password': ''
    };
    public loading: boolean;
    private subscriptions: any = {};

    public async submit() {
        this.loading = true;

        this.form.disable();

        const response = await this.service.signin({
            'username': this.form.value.username,
            'password': this.form.value.password
        });

        this.form.enable();

        this.loading = false;

        if (response.ok) {
            this.router.navigate(['/setup'], {
                'replaceUrl': true
            });
            this.toast.success('Sign in was successful!');
        } else {
            this.toast.error(response.error.message);
        };
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}