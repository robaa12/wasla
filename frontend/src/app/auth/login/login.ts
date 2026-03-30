import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  isRegisterMode = signal(false); // Toggle between Login and Register
  isLoading = signal(false);
  errorMessage = signal('');

  toggleMode() {
    this.isRegisterMode.set(!this.isRegisterMode());
    this.errorMessage.set('');
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
