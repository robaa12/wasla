import { Component, Input } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
})
export class HowItWorksComponent {
  @Input() t!: AppTranslations;
}
