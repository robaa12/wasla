import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private tokenInfo = signal<string | null>(localStorage.getItem("token"));

  public isAuthenticated = computed(() => !!this.tokenInfo());

  async login(email: string, password: string) {
    const response = await fetch(`${environment.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();

    // Update both the application state (Signal) and browser memory (LocalStorage)
    this.tokenInfo.set(data.token);
    localStorage.setItem("token", data.token);
  }

  async register(email: string, password: string) {
    const response = await fetch(`${environment.apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Registration failed");

    const data = await response.json();
    this.tokenInfo.set(data.token);
    localStorage.setItem("token", data.token);
  }

  logout() {
    this.tokenInfo.set(null);
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return this.tokenInfo();
  }
}
