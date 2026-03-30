import { Component, Input } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent {
  @Input() t!: AppTranslations;
}