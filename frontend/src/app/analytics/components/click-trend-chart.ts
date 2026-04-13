import { Component, input, computed, signal, inject, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart } from 'chart.js';
import { ClickDataPoint } from '../models/analytics.model';
import { TranslationService } from '../../core/translation/translation.service';
import { AppTranslations } from '../../shared/translations.types';

@Component({
  selector: 'app-click-trend-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="glass-panel p-6 h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-text-primary font-ui font-medium text-lg tracking-wide">{{ t().analyticsTrafficOverview }}</h2>

        <div class="flex items-center gap-2 p-1 rounded-full bg-[rgba(255,255,255,0.03)] border border-[var(--border)]">
          @for (range of ranges(); track range) {
            <button
              (click)="selectedRange.set(range)"
              class="px-4 py-1 rounded-full text-sm font-medium font-ui transition-all duration-300"
              [class]="selectedRange() === range ? 'bg-white/10 text-white shadow-shadow-glow' : 'text-text-muted hover:text-white/70'">
              {{ range }}
            </button>
          }
        </div>
      </div>
      
      <div class="flex-1 w-full relative -mx-2 h-64">
        <canvas baseChart
          [data]="chartData()"
          [options]="chartOptions"
          [type]="'line'">
        </canvas>
      </div>
    </div>
  `
})
export class ClickTrendChartComponent implements OnInit {
  data = input.required<ClickDataPoint[]>();
  private translationService = inject(TranslationService);
  t = computed(() => this.translationService.t() || {} as AppTranslations);

  ranges = computed(() => ['7D', '30D', '90D'] as const);
  selectedRange = signal<'7D' | '30D' | '90D'>('30D');

  filteredData = computed(() => {
    const range = this.selectedRange();
    let days = 30;
    if (range === '7D') days = 7;
    if (range === '90D') days = 90;
    
    // get last `days` points
    const all = this.data();
    return all.slice(Math.max(all.length - days, 0));
  });

  chartData = computed((): ChartConfiguration<'line'>['data'] => {
    const d = this.filteredData();
    return {
      labels: d.map(item => {
        if (!item.date) return '';
        if (item.date.includes('-')) {
          const parts = item.date.split('-');
          // Handle YYYY-MM-DD
          if (parts.length >= 3) {
            return `${parts[1]}/${parts[2]}`;
          }
        }
        return item.date;
      }),
      datasets: [
        {
          label: this.t().analyticsTotalClicks,
          data: d.map(item => item.clicks),
          borderColor: '#1b5e52',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#1b5e52',
          pointHoverBorderColor: '#ffffff',
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(27, 94, 82, 0.4)');
            gradient.addColorStop(1, 'rgba(27, 94, 82, 0.0)');
            return gradient;
          },
        },
        {
          label: this.t().analyticsUniqueVisitors,
          data: d.map(item => item.unique),
          borderColor: '#3d7d76',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#3d7d76',
          fill: false,
        }
      ]
    };
  });

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111a18',
        titleColor: '#F0F0F0',
        titleFont: { family: "'Outfit', sans-serif", size: 13, weight: 'bold' },
        bodyColor: '#A3A3A3',
        bodyFont: { family: "'DM Mono', monospace", size: 13 },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        usePointStyle: true,
        boxPadding: 6,
        callbacks: {
          title: (items) => `${this.t().analyticsTrafficOverview}: ${items[0].label}`,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawTicks: false },
        border: { display: false },
        ticks: { color: '#6B7280', font: { family: "'DM Mono', monospace", size: 11 }, maxTicksLimit: 8 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)', drawTicks: false },
        border: { display: false },
        beginAtZero: true,
        ticks: { 
          color: '#6B7280', 
          font: { family: "'DM Mono', monospace", size: 11 },
          callback: (value) => Number(value) >= 1000 ? (Number(value)/1000).toFixed(1) + 'K' : value
        }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    }
  };

  ngOnInit() {
    Chart.defaults.color = '#6B7280';
    Chart.defaults.font.family = "'Outfit', sans-serif";
  }
}