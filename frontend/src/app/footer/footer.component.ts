import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  @Input() t!: AppTranslations;

  @Output() languageToggled = new EventEmitter<void>();
  @Output() sectionScrolled = new EventEmitter<string>();
}
