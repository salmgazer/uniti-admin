<template>
  <div class="min-h-screen flex">
    <!-- Left Side - App Info -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
        <div class="mb-8">
          <img src="/src/assets/logo.webp" alt="Uniti" class="w-16 h-16 rounded-2xl shadow-lg mb-6" />
          <h1 class="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
            Welcome to<br>
            <span class="text-primary-200">Uniti Admin</span>
          </h1>
          <p class="text-xl text-primary-100 mb-8 leading-relaxed">
            Manage your SuperApp platform with comprehensive admin tools and analytics.
          </p>
        </div>
        
        <div class="space-y-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">User Management</h3>
              <p class="text-primary-200">Manage users, permissions, and platform access</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">App Management</h3>
              <p class="text-primary-200">Control third-party apps and goal categories</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Analytics & Insights</h3>
              <p class="text-primary-200">Track platform performance and user engagement</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
    </div>
    
    <!-- Right Side - Login Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div class="max-w-md w-full">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8">
          <img src="/src/assets/logo.webp" alt="Uniti" class="w-16 h-16 rounded-2xl shadow-lg mx-auto mb-4" />
          <h2 class="text-3xl font-bold text-gray-900">
            Uniti Admin
          </h2>
        </div>
        
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p class="text-gray-600">
              Welcome back! Please enter your credentials.
            </p>
          </div>
          
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div class="space-y-5">
              <div>
                <label for="email-address" class="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    v-model="email"
                    class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    v-model="password"
                    class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 p-4 rounded-xl">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
          </form>
          
          <div class="mt-6 text-center text-sm text-gray-500">
            <p>© {{ new Date().getFullYear() }} Uniti. All rights reserved.</p>
            <p class="mt-1">v{{ version }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/services/auth';
import packageJson from '../../package.json';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const { login, isLoading, error } = useAuth();
    
    const email = ref('');
    const password = ref('');
    const version = packageJson.version;
    
    const handleLogin = async () => {
      const result = await login({
        email: email.value,
        password: password.value
      });
      
      if (result.success) {
        router.push('/');
      }
    };
    
    return {
      email,
      password,
      version,
      isLoading,
      error,
      handleLogin
    };
  }
});
</script>