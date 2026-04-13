import { Component, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { AppTranslations } from './shared/translations.types';
import { TranslationService } from './core/translation/translation.service';
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
      navDashboard: 'Dashboard',
      navSignOut: 'Sign Out',

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
      trustText: 'No sign-up required  •  Free forever  •  99.99% uptime',
      platformFeatures: 'Platform Features',
      simpleProcess: 'Simple Process',

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

      dashTitle: 'My Links',
      dashSubtitle: 'All your shortened URLs in one place.',
      dashShortenBtn: 'Shorten New Link',
      dashSearchPlaceholder: 'Search by URL or short link...',
      dashSortNewest: 'Newest First',
      dashSortOldest: 'Oldest First',
      dashEmptyTitle: 'No links yet',
      dashEmptyDesc: 'Shorten your first URL and it will appear here.',
      dashEmptyBtn: 'Shorten a Link',
      dashNoResultsTitle: 'No results found',
      dashNoResultsDesc: 'No links match',
      dashClearSearch: 'Clear Search',
      dashStats: 'Stats',
      dashCopy: 'Copy',
      dashCopied: 'Copied!',
      dashPrev: 'Prev',
      dashNext: 'Next',
      dashResultsFound: 'result(s) found',
      dashShowingOf: 'Showing',
      dashLinksTotal: 'link(s) total',
      dashErrorNoLinks: 'You have no shortened links yet. Start by creating one!',
      dashErrorLoad: 'Failed to load your links. Please try again.',

      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to access your dashboard.',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join Wasla to manage your shortened links.',
      loginEmail: 'Email address',
      loginPassword: 'Password',
      loginEmailPlaceholder: 'you@example.com',
      loginPasswordPlaceholder: '••••••••',
      loginProcessing: 'Processing...',
      loginSignInBtn: 'Sign In',
      loginCreateAccountBtn: 'Create Account',
      loginHaveAccount: 'Already have an account?',
      loginNoAccount: "Don't have an account?",
      loginCreateOne: 'Create one',
      loginSignInToggle: 'Sign In',
      loginEmailRequired: 'Email is required.',
      loginEmailInvalid: 'Please enter a valid email.',
      loginPasswordRequired: 'Password is required.',
      loginPasswordMinLength: 'Password must be at least 6 characters.',
      loginFormErrors: 'Please fix the form errors.',
      loginRegisterFailed: 'Registration failed. Try again.',
      loginInvalidCredentials: 'Invalid credentials.',

      analyticsTitle: 'Link Analytics',
      analyticsSubtitle: 'Performance metrics for',
      analyticsGlobalSubtitle: 'Global Network Overview',
      analyticsTrafficOverview: 'Traffic Overview',
      analyticsTotalClicks: 'Total Clicks',
      analyticsUniqueVisitors: 'Unique Visitors',
      analyticsTrafficSources: 'Traffic Sources',
      analyticsTopLinks: 'Top Performing Links',
      analyticsTopLinksHeader: 'Top Performing Links',
      analyticsColShortUrl: 'Short URL',
      analyticsColDestination: 'Destination',
      analyticsColClicks: 'Clicks',
      analyticsColUnique: 'Unique',
      analyticsColCtr: 'CTR',
      analyticsColStatus: 'Status',
      analyticsStatusActive: 'Active',
      analyticsStatusExpired: 'Expired',
      analyticsShowingLinks: 'Showing links',

      sidebarDashboard: 'Dashboard',
      sidebarAnalytics: 'Analytics (Pro)',
      sidebarMyLinks: 'My Links',
      sidebarCustomDomains: 'Custom Domains',
      sidebarSettings: 'Settings',
    },
    ar: {
      langToggle: 'English',
      login: 'تسجيل الدخول',
      signup: 'ابدأ مجاناً',
      navFeatures: 'المميزات',
      navHowItWorks: 'كيف يعمل',
      navAnalytics: 'التحليلات',
      navDashboard: 'لوحة التحكم',
      navSignOut: 'تسجيل الخروج',

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
      trustText: 'لا يحتاج تسجيل  •  مجاني للأبد  •  99.99% وقت التشغيل',
      platformFeatures: 'ميزات المنصة',
      simpleProcess: 'عملية بسيطة',

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

      dashTitle: 'روابطي',
      dashSubtitle: 'جميع روابطك المختصرة في مكان واحد.',
      dashShortenBtn: 'اختصار رابط جديد',
      dashSearchPlaceholder: 'ابحث بالرابط الطويل أو القصير...',
      dashSortNewest: 'الأحدث أولاً',
      dashSortOldest: 'الأقدم أولاً',
      dashEmptyTitle: 'لا توجد روابط بعد',
      dashEmptyDesc: 'اختصر رابطك الأول وسيظهر هنا.',
      dashEmptyBtn: 'اختصر رابطاً',
      dashNoResultsTitle: 'لم يتم العثور على نتائج',
      dashNoResultsDesc: 'لا توجد روابط مطابقة لـ',
      dashClearSearch: 'مسح البحث',
      dashStats: 'الإحصائيات',
      dashCopy: 'نسخ',
      dashCopied: 'تم النسخ!',
      dashPrev: 'السابق',
      dashNext: 'التالي',
      dashResultsFound: 'نتيجة',
      dashShowingOf: 'عرض',
      dashLinksTotal: 'رابط',
      dashErrorNoLinks: 'لا توجد روابط مختصرة بعد. ابدأ بإنشاء واحد!',
      dashErrorLoad: 'فشل في تحميل روابطك. حاول مرة أخرى.',

      loginTitle: 'مرحباً بعودتك',
      loginSubtitle: 'سجّل الدخول للوصول إلى لوحة التحكم.',
      registerTitle: 'إنشاء حساب',
      registerSubtitle: 'انضم إلى وصله لإدارة روابطك المختصرة.',
      loginEmail: 'البريد الإلكتروني',
      loginPassword: 'كلمة المرور',
      loginEmailPlaceholder: 'you@example.com',
      loginPasswordPlaceholder: '••••••••',
      loginProcessing: 'جارٍ المعالجة...',
      loginSignInBtn: 'تسجيل الدخول',
      loginCreateAccountBtn: 'إنشاء حساب',
      loginHaveAccount: 'لديك حساب بالفعل؟',
      loginNoAccount: 'ليس لديك حساب؟',
      loginCreateOne: 'أنشئ حساباً',
      loginSignInToggle: 'تسجيل الدخول',
      loginEmailRequired: 'البريد الإلكتروني مطلوب.',
      loginEmailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
      loginPasswordRequired: 'كلمة المرور مطلوبة.',
      loginPasswordMinLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.',
      loginFormErrors: 'يرجى تصحيح أخطاء النموذج.',
      loginRegisterFailed: 'فشل في التسجيل. حاول مرة أخرى.',
      loginInvalidCredentials: 'بيانات الدخول غير صحيحة.',

      analyticsTitle: 'تحليلات الروابط',
      analyticsSubtitle: 'مقاييس الأداء لـ',
      analyticsGlobalSubtitle: 'نظرة عامة على الشبكة العالمية',
      analyticsTrafficOverview: 'نظرة عامة على الحركة',
      analyticsTotalClicks: 'إجمالي النقرات',
      analyticsUniqueVisitors: 'الزوار الفريدون',
      analyticsTrafficSources: 'مصادر الحركة',
      analyticsTopLinks: 'أفضل الروابط أداءً',
      analyticsTopLinksHeader: 'أفضل الروابط أداءً',
      analyticsColShortUrl: 'الرابط القصير',
      analyticsColDestination: 'الوجهة',
      analyticsColClicks: 'النقرات',
      analyticsColUnique: 'فريد',
      analyticsColCtr: 'نسبة النقر',
      analyticsColStatus: 'الحالة',
      analyticsStatusActive: 'نشط',
      analyticsStatusExpired: 'منتهي',
      analyticsShowingLinks: 'عرض الروابط',

      sidebarDashboard: 'لوحة التحكم',
      sidebarAnalytics: 'التحليلات (برو)',
      sidebarMyLinks: 'روابطي',
      sidebarCustomDomains: 'النطاقات المخصصة',
      sidebarSettings: 'الإعدادات',
    },
  };

  constructor(private http: HttpClient, public router: Router, @Inject(PLATFORM_ID) private platformId: Object, private translationService: TranslationService) {
    this.syncDocumentLanguage('en');
    this.loadTranslations();

    if (isPlatformBrowser(this.platformId)) {
      // Set initial route so direct navigations (like typing localhost:4200/login) work instantly
      this.currentRoute.set(window.location.pathname);
      
      // Listen for all future link clicks
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const newRoute = event.urlAfterRedirects.split('?')[0];
          this.currentRoute.set(newRoute);
          if (newRoute === '/') {
            window.scrollTo(0, 0);
          }
        }
      });
    }
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
    this.translationService.setTranslations(this.translations[next]);
  }

  private loadTranslations() {
    const t = this.translations[this.currentLang()];
    this.translationService.setTranslations(t);
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
