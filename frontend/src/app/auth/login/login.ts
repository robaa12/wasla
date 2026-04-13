import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth/auth';
import { TranslationService } from '../../core/translation/translation.service';
import { AppTranslations } from '../../shared/translations.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Reactive computed that updates when language changes
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isRegisterMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    if (this.router.url.startsWith('/register')) {
      this.isRegisterMode.set(true);
    }
  }

  toggleMode() {
    const next = !this.isRegisterMode();
    this.isRegisterMode.set(next);
    this.errorMessage.set('');
    this.authForm.reset();
    this.router.navigate([next ? '/register' : '/login']);
  }

  get emailControl() { return this.authForm.get('email'); }
  get passwordControl() { return this.authForm.get('password'); }

  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) return this.t().loginEmailRequired;
    if (this.emailControl?.hasError('email')) return this.t().loginEmailInvalid;
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) return this.t().loginPasswordRequired;
    if (this.passwordControl?.hasError('minlength')) return this.t().loginPasswordMinLength;
    return '';
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      this.errorMessage.set(this.t().loginFormErrors);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.authForm.value;

    try {
      if (this.isRegisterMode()) {
        await this.auth.register(email!, password!);
      } else {
        await this.auth.login(email!, password!);
      }

      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage.set(this.isRegisterMode() ? this.t().loginRegisterFailed : this.t().loginInvalidCredentials);
    } finally {
      this.isLoading.set(false);
    }
  }
}
