import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../core/auth/auth';
import { TranslationService } from '../core/translation/translation.service';
import { AppTranslations } from '../shared/translations.types';
import { environment } from '../../environments/environment';

interface ShortUrl {
  id: string;
  longUrl: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  // Reactive computed that updates when language changes
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  urls = signal<ShortUrl[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  copiedId = signal<string | null>(null);

  // Expose Math to template for calculations
  readonly Math = Math;

  // Search
  searchQuery = signal('');

  // Filter
  sortBy = signal<'newest' | 'oldest'>('newest');

  // Pagination
  currentPage = signal(1);
  readonly pageSize = 4;

  filteredAndSearchedUrls = computed(() => {
    let result = this.urls();
    const query = this.searchQuery().toLowerCase();

    // Search filter
    if (query) {
      result = result.filter(url =>
        url.longUrl.toLowerCase().includes(query) ||
        this.getShortUrl(url.id).toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortBy() === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredAndSearchedUrls().length / this.pageSize));

  paginatedUrls = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredAndSearchedUrls().slice(start, end);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  resetPage() {
    this.currentPage.set(1);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.resetPage();
  }

  ngOnInit() {
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
        if (this.urls().length === 0) {
          this.errorMessage.set(this.t().dashErrorNoLinks);
        } else {
          this.errorMessage.set(this.t().dashErrorLoad);
        }
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
