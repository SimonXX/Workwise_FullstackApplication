import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe({
        next: (response) => {
          if (response.status === 200) {
            const token = response.body.token;
            const role = this.authService.getRoleFromToken(token);
            if (role === 'CANDIDATE') {
              this.router.navigateByUrl('/candidateArea');
            } else if (role === 'COMPANY') {
              this.router.navigateByUrl('/companyArea');
            } else {
              this.errorMessage = 'Unknown role';
            }
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Invalid email or password';
        }
      });
    }
  }
}
