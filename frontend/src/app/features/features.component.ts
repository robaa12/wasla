import { Component, Input } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-features',
  standalone: true,
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent {
  @Input() t!: AppTranslations;
}
