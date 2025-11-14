// Global type extensions
declare module '@/services/api' {
  interface DashboardStats {
    recentUsers?: any[];
    totalCountries?: number;
    totalMessages?: number;
    totalMessageTemplates?: number;
    totalLanguages?: number;
    activeAdminUsers?: number;
    totalAdminUsers?: number;
  }

  interface Country {
    preferredDisplayLanguage?: any;
    preferredVoiceLanguage?: any;
  }
}

export {};