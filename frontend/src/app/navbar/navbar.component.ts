import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() t!: AppTranslations;
  @Input() scrolled = false;

  @Output() languageToggled = new EventEmitter<void>();
  @Output() sectionScrolled = new EventEmitter<string>();
  @Output() shortenerScrolled = new EventEmitter<void>();
}
