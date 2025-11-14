/// <reference types="vite/client" />
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token and client key to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add client key for non-admin endpoints
    config.headers['x-client-key'] = 'uniti-client-secret-key';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/admin/login',
  
  // Admin Users
  adminUsers: '/admin',
  adminUser: (id: string) => `/admin/${id}`,
  
  // Users
  users: '/users',
  user: (id: string) => `/users/${id}`,
  
  // Apps
  apps: '/apps',
  app: (id: string) => `/apps/${id}`,
  appsByGoalCategory: (goalCategoryId: string) => `/apps/goal-category/${goalCategoryId}`,
  appsByCountry: (countryCode: string) => `/apps/country/${countryCode}`,
  
  // Countries
  countries: '/countries',
  country: (id: string) => `/countries/${id}`,
  
  // Stats
  stats: '/stats',
  
  // Message Templates
  messageTemplates: '/message-templates',
  messageTemplate: (id: string) => `/message-templates/${id}`,
  sendTemplateMessage: '/message-templates/send',
  
  // Analytics
  userAnalytics: (id: string) => `/users/${id}/analytics`,
  analyticsOverview: '/analytics/overview',
};

// Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalApps: number;
  usersByCountry: { country: string; count: number }[];
  categories: { category: string; count: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  name?: string;
  isVerified: boolean;
  profilePicture?: string;
  countryCode?: string;
  country?: Country;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AppAudio {
  id: string;
  languageCode: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  appId: string;
  countryCode?: string;
  country?: Country;
  goalCategory?: {
    id: string;
    name: string;
    description?: string;
  };
  goalSubCategories?: {
    id: string;
    name: string;
    description?: string;
  }[];
  goals?: {
    id: string;
    title: string;
    description?: string;
  }[];
  audios?: AppAudio[];
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  id: string;
  code: string;
  title: string;
}
export interface Country {
  id: string;
  code: string;
  name: string;
  flagUrl?: string;
  languages: Language[]
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export interface MessageTemplate {
  id: string;
  title: string;
  subject: string;
  content: string;
  category?: string;
  videoUrls?: Record<string, string>;
  audioUrls?: Record<string, string>;
  translations?: Record<string, string>;
  subjectTranslations?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAnalytics {
  totalUsageTime: number;
  totalSessions: number;
  activeApps: number;
  topApps: {
    packageName: string;
    appName?: string;
    totalTime: number;
    sessions: number;
  }[];
  dailyUsage: {
    date: string;
    totalTime: number;
    sessions: number;
  }[];
  goalCategoryUsage: {
    categoryId: string;
    categoryName: string;
    totalTime: number;
    sessions: number;
    appCount: number;
  }[];
  maxDailyUsage: number;
}

export interface AnalyticsOverview {
  totalUsageTime: number;
  totalSessions: number;
  activeUsers: number;
  avgSessionDuration: number;
  topApps: {
    packageName: string;
    appName?: string;
    totalTime: number;
    userCount: number;
  }[];
  goalCategoryUsage: {
    categoryId: string;
    categoryName: string;
    totalTime: number;
    userCount: number;
    appCount: number;
  }[];
}