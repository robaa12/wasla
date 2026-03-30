import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Auth } from '../core/auth/auth';
import { environment } from '../../environments/environment';

interface ShortUrl {
  id: string;
  longUrl: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private router = inject(Router);

  urls = signal<ShortUrl[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  copiedId = signal<string | null>(null);

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUrls();
  }

  loadUrls() {
    this.isLoading.set(true);
    this.http.get<ShortUrl[]>(`${environment.apiUrl}/user/urls`).subscribe({
      next: (data) => {
        this.urls.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load your links. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  getShortUrl(id: string): string {
    return `${environment.mainUrl}/${id}`;
  }

  copyToClipboard(id: string) {
    const url = this.getShortUrl(id);
    navigator.clipboard.writeText(url).then(() => {
      this.copiedId.set(id);
      setTimeout(() => this.copiedId.set(null), 2000);
    });
  }
}
