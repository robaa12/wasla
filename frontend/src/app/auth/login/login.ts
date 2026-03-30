import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  isRegisterMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    // Auto-start in register mode when the URL is /register
    if (this.router.url.startsWith('/register')) {
      this.isRegisterMode.set(true);
    }
  }

  toggleMode() {
    const next = !this.isRegisterMode();
    this.isRegisterMode.set(next);
    this.errorMessage.set('');
    // Keep the URL in sync with the mode
    this.router.navigate([next ? '/register' : '/login']);
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill out all fields.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      if (this.isRegisterMode()) {
        await this.auth.register(this.email, this.password);
      } else {
        await this.auth.login(this.email, this.password);
      }
      
      // On success, navigate to the landing page (which will soon become the dashboard!)
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage.set(this.isRegisterMode() ? 'Registration failed. Try again.' : 'Invalid credentials.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
