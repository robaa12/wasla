import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-cta',
  standalone: true,
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css',
})
export class CtaComponent {
  @Input() t!: AppTranslations;

  @Output() sectionScrolled = new EventEmitter<string>();
}
