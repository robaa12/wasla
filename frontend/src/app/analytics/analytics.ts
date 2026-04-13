import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { KpiCardComponent } from './components/kpi-card';
import { ClickTrendChartComponent } from './components/click-trend-chart';

import { AnalyticsService } from './services/analytics.service';
import { KpiData, ClickDataPoint } from './models/analytics.model';
import { TranslationService } from '../core/translation/translation.service';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    KpiCardComponent,
    ClickTrendChartComponent
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(AnalyticsService);
  private translationService = inject(TranslationService);

  // Reactive computed that updates when language changes
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  readonly dateRange = signal('30D');

  // Data Signals
  kpis = signal<KpiData[]>([]);
  clickTrend = signal<ClickDataPoint[]>([]);

  isLoaded = signal(false);

  // Route ID
  linkId = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.linkId.set(id && id !== 'global' ? id : null);
      this.loadAnalytics();
    });
  }

  loadAnalytics() {
    this.isLoaded.set(false);

    const currentId = this.linkId();
    this.svc.getDashboardData(currentId || 'global', this.dateRange()).subscribe(data => {
      this.kpis.set(data.kpis);
      this.clickTrend.set(data.clickTrend);

      setTimeout(() => this.isLoaded.set(true), 100);
    });
  }

  setDateRange(range: string) {
    this.dateRange.set(range);
    this.loadAnalytics();
  }
}
