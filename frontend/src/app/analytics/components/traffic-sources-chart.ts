import { Component, input, effect, signal, inject, computed } from '@angular/core';
import { SourceData } from '../models/analytics.model';
import { LargeNumberPipe } from '../pipes/large-number.pipe';
import { TranslationService } from '../../core/translation/translation.service';
import { AppTranslations } from '../../shared/translations.types';

@Component({
  selector: 'app-traffic-sources-chart',
  standalone: true,
  imports: [LargeNumberPipe],
  template: `
    <div class="glass-panel p-6 h-full flex flex-col justify-between group overflow-hidden relative pb-10">
      <h2 class="text-text-primary font-ui font-medium text-lg tracking-wide mb-6">{{ t().analyticsTrafficSources }}</h2>
      
      <div class="flex-1 flex flex-col gap-4 relative z-10 w-full" #container>
        @for (source of sources(); track source.name) {
          <div class="w-full flex flex-col gap-1.5 animate-fade-up" [style.animationDelay]="($index * 0.1) + 's'">
            <div class="flex justify-between items-center text-sm">
              <span class="text-text-primary font-ui">{{ source.name }}</span>
              <div class="flex items-center gap-2">
                <span class="text-text-primary font-mono">{{ source.visits | largeNumber }}</span>
                <span class="text-text-muted font-mono text-xs w-8 text-right">{{ source.percentage }}%</span>
              </div>
            </div>
            <div class="w-full h-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-full overflow-hidden">
              <div class="h-full bg-[var(--accent)] rounded-full transition-all duration-1000 ease-out fill-bar"
                   [style.width]="isRendered() ? source.percentage + '%' : '0%'"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .fill-bar {
      box-shadow: 0 0 10px var(--accent-dim);
    }
  `]
})
export class TrafficSourcesChartComponent {
  sources = input.required<SourceData[]>();
  isRendered = signal<boolean>(false);
  private translationService = inject(TranslationService);
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  constructor() {
    effect(() => {
      if (this.sources()) {
        setTimeout(() => {
          this.isRendered.set(true);
        }, 100);
      }
    });
  }
}
