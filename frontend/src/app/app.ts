import { Component, signal, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { AppTranslations } from './shared/translations.types';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { StatsComponent } from './stats/stats.component';
import { FeaturesComponent } from './features/features.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { CtaComponent } from './cta/cta.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    StatsComponent,
    FeaturesComponent,
    HowItWorksComponent,
    CtaComponent,
    FooterComponent,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  currentLang = signal<'en' | 'ar'>('en');
  longUrl = '';
  shortenedData = signal<{ shortId: string; longUrl: string } | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');
  showCopiedToast = signal(false);
  scrolled = signal(false);
  
  // Track the active route reactively!
  currentRoute = signal('/');

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 30);
  }

  private readonly translations: Record<'en' | 'ar', AppTranslations> = {
    en: {
      langToggle: 'العربية',
      login: 'Login',
      signup: 'Get Started Free',
      navFeatures: 'Features',
      navHowItWorks: 'How It Works',
      navAnalytics: 'Analytics',

      badge: 'Wasla v1.0 — Now Live',
      headingLine1: 'Shorten Your Links.',
      headingLine2: 'Expand Your Reach.',
      subheading:
        'Enterprise-grade URL shortener built to handle millions of clicks. Blazing-fast redirects, real-time analytics, and global CDN — all in one place.',
      placeholder: 'Paste your long URL here...',
      cta: 'Shorten Link',
      loading: 'Shortening...',
      errorSubmit: 'Failed to shorten URL. Please try again.',
      successTitle: 'Your link is ready!',
      copy: 'Copy',
      copyDone: 'Copied!',

      statsLabel1: 'Links Shortened',
      statsValue1: '12M+',
      statsLabel2: 'Avg. Redirect Speed',
      statsValue2: '<10ms',
      statsLabel3: 'Uptime',
      statsValue3: '99.99%',
      statsLabel4: 'Countries Served',
      statsValue4: '150+',

      featuresTitle: 'Everything you need to grow',
      featuresSubtitle:
        'Wasla is more than just a link shortener. It is a complete link management platform.',
      feature1Title: 'Lightning Fast Redirects',
      feature1Desc:
        'Sub-10ms redirects globally via Redis caching and edge optimization. Your users never wait.',
      feature2Title: 'Deep Analytics',
      feature2Desc:
        'Track clicks, geolocations, devices, referrers, and time-series data in real time.',
      feature3Title: 'Enterprise Scalability',
      feature3Desc:
        'Built on database sharding and Nginx load balancing to handle millions of concurrent requests.',
      feature4Title: 'Custom Links',
      feature4Desc:
        'Brand your links with custom slugs for memorable, trustworthy sharing.',
      feature5Title: 'Arabic & RTL Support',
      feature5Desc:
        'Full bilingual support with seamless right-to-left layout for Arabic-speaking users.',
      feature6Title: 'Open & Extensible',
      feature6Desc:
        'Wasla is built on open standards. Integrate with your existing tools via a simple REST API.',

      howTitle: 'Get a short link in seconds',
      howSubtitle: 'Three simple steps to elevate your links.',
      step1Title: 'Paste Your URL',
      step1Desc: 'Drop any long URL into the input field and hit "Shorten Link".',
      step2Title: 'Get Your Short Link',
      step2Desc: 'Wasla generates a unique, collision-free short ID instantly.',
      step3Title: 'Share & Track',
      step3Desc: 'Share it anywhere. Watch the analytics flow in real time.',

      ctaTitle: 'Ready to shorten faster?',
      ctaSubtitle: 'Start shortening links for free. No account required.',
      ctaButton: 'Shorten Your First Link',

      footer: '© 2026 Wasla URL Shortener. All rights reserved.',
      footerTagline: 'Built for speed. Designed for scale.',
    },
    ar: {
      langToggle: 'English',
      login: 'تسجيل الدخول',
      signup: 'ابدأ مجاناً',
      navFeatures: 'المميزات',
      navHowItWorks: 'كيف يعمل',
      navAnalytics: 'التحليلات',

      badge: 'وصله الإصدار 1.0 — متاح الآن',
      headingLine1: 'قصّر روابطك.',
      headingLine2: 'وسّع وصولك.',
      subheading:
        'مختصر روابط بمستوى المؤسسات، مصمم للتعامل مع ملايين النقرات. إعادة توجيه فائقة السرعة، وتحليلات فورية، وشبكة توزيع عالمية — في مكان واحد.',
      placeholder: 'الصق رابطك الطويل هنا...',
      cta: 'اختصر الرابط',
      loading: 'جارٍ الاختصار...',
      errorSubmit: 'فشل في اختصار الرابط. حاول مرة أخرى.',
      successTitle: 'رابطك جاهز!',
      copy: 'نسخ',
      copyDone: 'تم النسخ!',

      statsLabel1: 'رابط مختصر',
      statsValue1: '+12M',
      statsLabel2: 'متوسط سرعة التوجيه',
      statsValue2: '<10ms',
      statsLabel3: 'وقت التشغيل',
      statsValue3: '99.99%',
      statsLabel4: 'دولة تخدمها',
      statsValue4: '+150',

      featuresTitle: 'كل ما تحتاجه للنمو',
      featuresSubtitle:
        'وصله أكثر من مجرد مختصر روابط. إنها منصة متكاملة لإدارة الروابط.',
      feature1Title: 'إعادة توجيه فائقة السرعة',
      feature1Desc:
        'إعادة توجيه في أقل من 10 ميلي ثانية عالمياً عبر التخزين المؤقت Redis وتحسين الحافة.',
      feature2Title: 'تحليلات عميقة',
      feature2Desc:
        'تتبع النقرات والمواقع الجغرافية والأجهزة والمصادر وبيانات السلاسل الزمنية في الوقت الفعلي.',
      feature3Title: 'قابلية توسع على مستوى المؤسسات',
      feature3Desc:
        'مبني على تقسيم قواعد البيانات وموازنة حمل Nginx لمعالجة الملايين من الطلبات المتزامنة.',
      feature4Title: 'روابط مخصصة',
      feature4Desc: 'أضف هوية علامتك التجارية إلى روابطك بمعرفات مخصصة لا تُنسى.',
      feature5Title: 'دعم العربية واتجاه RTL',
      feature5Desc: 'دعم ثنائي اللغة الكامل مع تخطيط RTL سلس للمستخدمين الناطقين بالعربية.',
      feature6Title: 'مفتوح وقابل للتوسع',
      feature6Desc: 'وصله مبني على معايير مفتوحة. تكامل مع أدواتك عبر واجهة برمجية REST بسيطة.',

      howTitle: 'احصل على رابط مختصر في ثوانٍ',
      howSubtitle: 'ثلاث خطوات بسيطة للارتقاء بروابطك.',
      step1Title: 'الصق رابطك',
      step1Desc: 'ضع أي رابط طويل في حقل الإدخال واضغط "اختصر الرابط".',
      step2Title: 'احصل على رابطك القصير',
      step2Desc: 'تُنشئ وصله معرفًا قصيرًا فريدًا وخاليًا من التعارضات فوراً.',
      step3Title: 'شارك وتتبع',
      step3Desc: 'شاركه في أي مكان. شاهد التحليلات تتدفق في الوقت الفعلي.',

      ctaTitle: 'هل أنت مستعد للاختصار بشكل أسرع؟',
      ctaSubtitle: 'ابدأ في اختصار الروابط مجاناً. لا حساب مطلوب.',
      ctaButton: 'اختصر رابطك الأول',

      footer: '© 2026 وصله لاختصار الروابط. جميع الحقوق محفوظة.',
      footerTagline: 'مبني للسرعة. مصمم للتوسع.',
    },
  };

  constructor(private http: HttpClient, public router: Router) {
    this.syncDocumentLanguage('en');
    
    // Set initial route so direct navigations (like typing localhost:4200/login) work instantly
    this.currentRoute.set(window.location.pathname);
    
    // Listen for all future link clicks
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.urlAfterRedirects.split('?')[0]);
      }
    });
  }

  get isArabic(): boolean {
    return this.currentLang() === 'ar';
  }

  get t(): AppTranslations {
    return this.translations[this.currentLang()];
  }

  toggleLanguage() {
    const next = this.currentLang() === 'en' ? 'ar' : 'en';
    this.currentLang.set(next);
    this.syncDocumentLanguage(next);
  }

  private syncDocumentLanguage(lang: 'en' | 'ar') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  shortenUrl() {
    const trimmedUrl = this.longUrl.trim();
    if (!trimmedUrl) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.shortenedData.set(null);

    this.http
      .post<{ shortId: string; longUrl: string }>('http://localhost:3000/api/shorten', {
        longUrl: trimmedUrl,
      })
      .subscribe({
        next: (res) => {
          this.shortenedData.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set(this.t.errorSubmit);
          this.isLoading.set(false);
        },
      });
  }

  copyToClipboard(shortId: string) {
    const url = `http://localhost:3000/${shortId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.showCopiedToast.set(true);
      setTimeout(() => this.showCopiedToast.set(false), 2500);
    });
  }
}
