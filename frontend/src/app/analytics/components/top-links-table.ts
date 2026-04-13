import { Component, inject, input, computed, signal } from '@angular/core';
import { LargeNumberPipe } from '../pipes/large-number.pipe';
import { LinkData } from '../models/analytics.model';
import { TranslationService } from '../../core/translation/translation.service';
import { AppTranslations } from '../../shared/translations.types';

@Component({
  selector: 'app-top-links-table',
  standalone: true,
  imports: [LargeNumberPipe],
  template: `
    <div class="glass-panel w-full overflow-hidden flex flex-col">
      <div class="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-card)]">
        <h2 class="text-text-primary font-ui font-medium text-lg tracking-wide">{{ t().analyticsTopLinksHeader }}</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse isolate">
          <thead>
            <tr class="text-text-muted text-xs uppercase tracking-wider font-medium border-b border-[var(--border)]">
              <th class="px-6 py-4 font-ui cursor-pointer hover:text-[var(--accent)] transition-colors" (click)="setSort('shortUrl')">{{ t().analyticsColShortUrl }}</th>
              <th class="px-6 py-4 font-ui hidden md:table-cell cursor-pointer hover:text-[var(--accent)] transition-colors" (click)="setSort('originalUrl')">{{ t().analyticsColDestination }}</th>
              <th class="px-6 py-4 font-ui cursor-pointer hover:text-[var(--accent)] transition-colors text-right" (click)="setSort('clicks')">{{ t().analyticsColClicks }}</th>
              <th class="px-6 py-4 font-ui hidden sm:table-cell cursor-pointer hover:text-[var(--accent)] transition-colors text-right" (click)="setSort('unique')">{{ t().analyticsColUnique }}</th>
              <th class="px-6 py-4 font-ui cursor-pointer hover:text-[var(--accent)] transition-colors text-right" (click)="setSort('ctr')">{{ t().analyticsColCtr }}</th>
              <th class="px-6 py-4 font-ui hidden lg:table-cell text-center">{{ t().analyticsColStatus }}</th>
            </tr>
          </thead>
          <tbody class="text-sm font-ui divide-y divide-[var(--border)]">
            @for (link of sortedLinks(); track link.shortUrl) {
              <tr class="hover:bg-[rgba(255,255,255,0.02)] transition-colors group cursor-default">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <span class="text-[var(--text-primary)] font-mono">{{ link.shortUrl }}</span>
                    <button class="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)] hover:text-white p-1" [title]="t().dashCopy">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                  <span class="text-[var(--text-muted)] text-[11px] mt-1 block md:hidden truncate w-48">{{ link.originalUrl }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell text-[var(--text-muted)] truncate max-w-xs">
                  {{ link.originalUrl }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-3">
                    <span class="text-[var(--text-primary)] font-mono tabular-nums">{{ link.clicks | largeNumber }}</span>
                    <!-- tiny inline sparkline -->
                    <div class="w-10 h-4 opacity-50 group-hover:opacity-100 stroke-[var(--accent)]">
                      <svg viewBox="0 0 60 24" class="w-full h-full" preserveAspectRatio="none">
                         <polyline [attr.points]="getSparklinePoints(link.sparkline)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-right font-mono tabular-nums text-[var(--text-muted)]">
                  {{ link.unique | largeNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-mono text-[var(--text-primary)]">
                  {{ link.ctr }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-center">
                  @if (link.status === 'active') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      {{ t().analyticsStatusActive }}
                    </span>
                  } @else {
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">
                      {{ t().analyticsStatusExpired }}
                    </span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
         <span class="text-xs text-[var(--text-muted)]">{{ t().analyticsShowingLinks }} {{ sortedLinks().length }}</span>
      </div>
    </div>
  `
})
export class TopLinksTableComponent {
  private translationService = inject(TranslationService);
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  links = input.required<LinkData[]>();
  sortColumn = signal<keyof LinkData>('clicks');
  sortAsc = signal(false);

  sortedLinks = computed(() => {
    const list = [...this.links()];
    const col = this.sortColumn();
    const asc = this.sortAsc() ? 1 : -1;
    
    return list.sort((a,b) => {
      const vA = a[col];
      const vB = b[col];
      if (typeof vA === 'number' && typeof vB === 'number') {
        return (vA - vB) * asc;
      }
      return String(vA).localeCompare(String(vB)) * asc;
    });
  });

  setSort(col: keyof LinkData) {
    if (this.sortColumn() === col) {
      this.sortAsc.set(!this.sortAsc());
    } else {
      this.sortColumn.set(col);
      this.sortAsc.set(false);
    }
  }

  getSparklinePoints(data: number[]): string {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 60;
      const y = 24 - (((d - min) / range) * 24);
      return `${x},${y}`;
    }).join(' ');
  }
}