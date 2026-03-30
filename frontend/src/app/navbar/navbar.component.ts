import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { AppTranslations } from '../shared/translations.types';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../core/auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  public auth = inject(Auth);
  private router = inject(Router);

  @Input() t!: AppTranslations;
  @Input() scrolled = false;

  @Output() languageToggled = new EventEmitter<void>();
  @Output() sectionScrolled = new EventEmitter<string>();
  @Output() shortenerScrolled = new EventEmitter<void>();

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
