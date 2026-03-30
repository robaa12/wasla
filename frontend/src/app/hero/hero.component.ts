import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppTranslations } from '../shared/translations.types';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  @Input() t!: AppTranslations;
  @Input() longUrl = '';
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() shortenedData: { shortId: string; longUrl: string } | null = null;
  @Input() showCopiedToast = false;

  @Output() longUrlChange = new EventEmitter<string>();
  @Output() shorten = new EventEmitter<void>();
  @Output() copy = new EventEmitter<string>();
  @Output() sectionScrolled = new EventEmitter<string>();
}
