import { Component, input, computed, effect, signal, OnInit, OnDestroy } from '@angular/core';
import { LargeNumberPipe } from '../pipes/large-number.pipe';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [LargeNumberPipe],
  template: `
    <div class="kpi-card glass-panel hover-glow animate-fade-in relative overflow-hidden group h-full">
      <div class="p-6 flex flex-col justify-between h-full relative z-10">
        <div class="flex justify-between items-start mb-6">
          <span class="text-text-muted font-ui text-sm font-medium tracking-wide uppercase">{{ label() }}</span>
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono" 
               [class.bg-green-500_10]="deltaDirection() === 'up'"
               [class.text-green-500]="deltaDirection() === 'up'"
               [class.bg-red-500_10]="deltaDirection() === 'down'"
               [class.text-red-500]="deltaDirection() === 'down'"
               [class]="deltaDirection() === 'neutral' ? 'bg-gray-500/10 text-gray-400' : ''">
            <span>{{ deltaDirection() === 'up' ? '▲' : deltaDirection() === 'down' ? '▼' : '—' }}</span>
            <span>{{ delta() }}%</span>
          </div>
        </div>
        
        <div class="flex items-end justify-between">
          <div class="text-4xl font-mono text-text-primary tabular-nums tracking-tight">
            {{ prefix() }}{{ displayValue() | largeNumber }}{{ suffix() }}
          </div>
          
          <div class="w-24 h-10 relative opacity-60 group-hover:opacity-100 transition-opacity duration-500">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" class="w-full h-full overflow-visible">
              <polyline [attr.points]="pointsPath()" 
                        fill="none" 
                        stroke="var(--accent)" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="drop-shadow-glow" />
            </svg>
          </div>
        </div>
      </div>
      <!-- Subtle gradient background -->
      <div class="absolute -inset-24 bg-[var(--accent)] opacity-[0.02] blur-3xl group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"></div>
    </div>
  `,
  styles: [`
    .bg-green-500_10 { background-color: rgba(34, 197, 94, 0.1); }
    .text-green-500 { color: #22C55E; }
    .bg-red-500_10 { background-color: rgba(239, 68, 68, 0.1); }
    .text-red-500 { color: #EF4444; }
    .drop-shadow-glow { filter: drop-shadow(0 0 4px var(--accent-dim)); }
  `]
})
export class KpiCardComponent implements OnInit, OnDestroy {
  label = input.required<string>();
  value = input.required<number>();
  delta = input.required<number>();
  deltaDirection = input.required<'up' | 'down' | 'neutral'>();
  sparkline = input.required<number[]>();
  prefix = input<string | undefined>('');
  suffix = input<string | undefined>('');

  displayValue = signal<number>(0);
  private timer: any;

  pointsPath = computed(() => {
    const data = this.sparkline();
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // map to 0-100 x and 0-40 y
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 40 - (((d - min) / range) * 40);
      return `${x},${y}`;
    }).join(' ');
  });

  ngOnInit() {
    // Count up animation
    const target = this.value();
    const duration = 1500; 
    const fps = 60;
    const frames = Math.round(duration / (1000 / fps));
    const increment = target / frames;
    
    let current = 0;
    this.timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.displayValue.set(target);
        clearInterval(this.timer);
      } else {
        this.displayValue.set(Math.floor(current));
      }
    }, 1000 / fps);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
