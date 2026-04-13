import { Component, input, computed, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ChartSlice } from '../models/analytics.model';
import { LargeNumberPipe } from '../pipes/large-number.pipe';

@Component({
  selector: 'app-device-browser-chart',
  standalone: true,
  imports: [BaseChartDirective, LargeNumberPipe],
  template: `
    <div class="glass-panel p-6 h-full flex flex-col items-center">
      <h2 class="text-text-primary font-ui font-medium text-lg tracking-wide w-full text-left mb-6">{{ title() }}</h2>
      
      <div class="relative w-48 h-48 mb-8">
        <canvas baseChart
          [data]="chartData()"
          [options]="chartOptions"
          [type]="'doughnut'">
        </canvas>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-xl font-mono text-white opacity-80">{{ data()[0].value | largeNumber }}</span>
        </div>
      </div>
      
      <div class="w-full flex-1 flex flex-col justify-end gap-2 text-sm font-ui overflow-hidden">
         <div class="space-y-3 px-2 flex-grow overflow-y-auto w-full custom-scrollbar">
           @for (item of data(); track item.name) {
             <div class="flex justify-between items-center group w-full">
               <div class="flex items-center gap-2 overflow-hidden mr-2">
                 <span class="w-2 h-2 rounded-full flex-shrink-0" [style.background-color]="colors[$index % colors.length]"></span>
                 <span class="text-text-muted group-hover:text-text-primary transition-colors tracking-wide truncate" [title]="item.name">{{ item.name }}</span>
               </div>
               <span class="text-text-primary font-mono tabular-nums flex-shrink-0">{{ item.value | largeNumber }}</span>
             </div>
           }
         </div>
      </div>
    </div>
  `
})
export class DeviceBrowserChartComponent implements OnInit {
  title = input.required<string>();
  data = input.required<ChartSlice[]>();
  
  // Custom brand colors using Wasla teal, amber, and purple palette
  colors = ['#1b5e52', '#f5a623', '#8b5cf6', '#3d7d76', '#f7b738'];

  chartData = computed((): ChartConfiguration<'doughnut'>['data'] => {
    return {
      labels: this.data().map(d => d.name),
      datasets: [{
        data: this.data().map(d => d.value),
        backgroundColor: this.colors,
        borderWidth: 0,
        hoverOffset: 6
      }]
    };
  });

  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%', // creates thin doughnut ring
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0A0A0B',
        titleFont: { family: "'Outfit', sans-serif" },
        bodyFont: { family: "'DM Mono', monospace", size: 13 },
        bodyColor: '#1b5e52',
        padding: 10,
        cornerRadius: 6,
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `  ${ctx.raw}`
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500
    }
  };

  ngOnInit() {}
}