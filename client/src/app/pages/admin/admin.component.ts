import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required],
        });
    }

    onLogin() {
        // const email = this.loginForm.get('email').value;
        // const password = this.loginForm.get('password').value;
        // this.auth.login(email, password).then(
        //     () => {
        //         this.loading = false;
        //         if (this.state.part === 3) {
        //             this.router.navigate(['/part-three/all-stuff']);
        //         } else if (this.state.part === 4) {
        //             this.router.navigate(['/part-four/all-stuff']);
        //         }
        //     }
        // ).catch(
        //     (error) => {
        //         this.loading = false;
        //         this.errorMessage = error.message;
        //     }
        // );
    }
}
