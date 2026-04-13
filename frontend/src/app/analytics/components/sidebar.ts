import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { TranslationService } from '../../core/translation/translation.service';
import { AppTranslations } from '../../shared/translations.types';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <nav class="w-16 fixed left-0 top-0 bottom-0 bg-[var(--bg-base)] border-r border-[var(--border)] flex flex-col items-center py-6 z-50 overflow-y-auto overflow-x-hidden">
      <!-- Logo -->
      <a href="/" class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#f5a623] flex items-center justify-center text-[var(--bg-base)] mb-8 shrink-0 shadow-[0_0_15px_var(--accent-dim)] group relative">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </a>

      <!-- Primary Nav -->
      <div class="flex-1 flex flex-col gap-4 w-full px-3">
        @for (item of menuItems; track item.id) {
          <a [href]="item.path"
             class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative mx-auto
                    \${item.active ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'text-text-muted hover:bg-[var(--bg-card)] hover:text-text-primary'}">

            <svg [innerHTML]="item.svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>

            <!-- CSS Tooltip -->
            <div class="absolute left-14 bg-[var(--bg-card)] text-text-primary text-xs font-ui px-2.5 py-1.5 rounded shadow-lg border border-[var(--border)] opacity-0 -translate-x-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50">
              {{ item.label }}
            </div>
          </a>
        }
      </div>

      <!-- User/Bottom -->
      <div class="mt-auto px-3 flex flex-col items-center gap-4 relative w-full pt-4">
        <button class="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-text-muted hover:text-text-primary transition-colors group relative mx-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <!-- CSS Tooltip -->
          <div class="absolute left-14 bg-[var(--bg-card)] text-text-primary text-xs font-ui px-2.5 py-1.5 rounded shadow-lg border border-[var(--border)] opacity-0 -translate-x-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50">{{ t().sidebarSettings }}</div>
        </button>

        <div class="relative group cursor-pointer hover:ring-2 hover:ring-[var(--accent-dim)] rounded-full transition-all">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-[var(--bg-base)] select-none">
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] border-2 border-[var(--bg-base)] rounded-full flex items-center justify-center">
            <svg class="w-2 h-2 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class SidebarComponent implements OnInit {
  private translationService = inject(TranslationService);
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  menuItems: any[] = [];

  ngOnInit() {
    this.updateMenuItems();
  }

  private updateMenuItems() {
    const t = this.t();
    this.menuItems = [
      { id: 'home', label: t.sidebarDashboard, path: '/dashboard', active: false, svg: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' },
      { id: 'analytics', label: t.sidebarAnalytics, path: '#', active: true, svg: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>' },
      { id: 'links', label: t.sidebarMyLinks, path: '/dashboard', active: false, svg: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' },
      { id: 'domains', label: t.sidebarCustomDomains, path: '#', active: false, svg: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' },
    ];
  }
}