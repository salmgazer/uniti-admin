<template>
  <Layout pageTitle="App Settings">
    <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">App Settings</h2>
        <p class="text-gray-500 mt-1">Manage audio guides for app screens</p>
      </div>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search screens..." 
          class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
        />
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <table class="table-modern">
        <thead>
          <tr>
            <th>Screen</th>
            <th>Audio Files</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="screen in filteredScreens" :key="screen.value" class="hover:bg-gray-50 transition-colors duration-150">
            <td>
              <div class="font-medium text-gray-900">{{ screen.label }}</div>
              <div class="text-sm text-gray-500">{{ screen.description }}</div>
            </td>
            <td>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">{{ getScreenAudioCount(screen.value) }} of {{ languages.length }} languages</span>
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" :style="{ width: getScreenProgress(screen.value) + '%' }"></div>
                </div>
              </div>
            </td>
            <td>
              <router-link :to="`/app-settings/${screen.value}`" 
                           class="inline-flex items-center px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Manage Audio
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

interface AudioFile {
  id: string;
  screenName: string;
  languageCode: string;
  audioUrl: string;
  duration?: number;
}

interface Language {
  code: string;
  title: string;
}

export default defineComponent({
  name: 'AppSettings',
  components: { Layout },
  setup() {
    const audios = ref<AudioFile[]>([]);
    const languages = ref<Language[]>([]);
    const searchQuery = ref('');
    
    const screens = [
      { value: 'WelcomeLanguageScreen', label: 'Welcome Language', description: 'Audio guide for language selection' },
      { value: 'WelcomeSigninScreen', label: 'Welcome Sign In', description: 'Audio guide for the sign in screen' },
      { value: 'RegistrationPhoneNumberScreen', label: 'Registration Phone', description: 'Audio guide for phone number entry' },
      { value: 'RegistrationVerificationCodeScreen', label: 'Registration Verification', description: 'Audio guide for code verification' },
      { value: 'RegistrationIdPreambleScreen', label: 'Registration Upload ID Preamble', description: 'Audio guide for ID upload preamble' },
      { value: 'RegistrationUploadIdScreen', label: 'Registration Upload ID', description: 'Audio guide for ID upload' },
      { value: 'RegistrationSelfiePreambleScreen', label: 'Registration Selfie Preamble', description: 'Audio guide for selfie capture preamble' },
      { value: 'RegistrationSelfieScreen', label: 'Registration Selfie', description: 'Audio guide for selfie capture' },
      { value: 'RegistrationGoalsScreen', label: 'Registration Goals', description: 'Audio guide for goals selection' },
      { value: 'RegistrationRecommendedAppsScreen', label: 'Registration Apps', description: 'Audio guide for app recommendations' },
      { value: 'RegistrationPinSetupScreen', label: 'Registration PIN Setup', description: 'Audio guide for PIN setup' },
      { value: 'HomeGoalsScreen', label: 'Home Goals', description: 'Audio guide for the goals screen' },
      { value: 'HomeMessagesScreen', label: 'Home Messages', description: 'Audio guide for the messages screen' },
      { value: 'HomeProfileScreen', label: 'Home Profile', description: 'Audio guide for the profile screen' },
      { value: 'HomeSupportScreen', label: 'Home Support', description: 'Audio guide for the support screen' },
      { value: 'PermissionsModal', label: 'Permissions Modal', description: 'Audio guide for the permissions modal'}
    ];

    const loadAudios = async () => {
      try {
        const response = await api.get('/app-screen-audio');
        audios.value = response.data;
      } catch (error) {
        console.error('Failed to load audios:', error);
      }
    };

    const loadLanguages = async () => {
      try {
        const response = await api.get('/languages');
        languages.value = response.data;
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };

    const getScreenAudioCount = (screenName: string) => {
      return audios.value.filter(a => a.screenName === screenName).length;
    };

    const getScreenProgress = (screenName: string) => {
      if (languages.value.length === 0) return 0;
      return (getScreenAudioCount(screenName) / languages.value.length) * 100;
    };

    onMounted(() => {
      loadAudios();
      loadLanguages();
    });

    const filteredScreens = computed(() => {
      if (!searchQuery.value) return screens;
      const query = searchQuery.value.toLowerCase();
      return screens.filter(screen => 
        screen.label.toLowerCase().includes(query) ||
        screen.description.toLowerCase().includes(query)
      );
    });

    return {
      audios,
      languages,
      screens,
      searchQuery,
      filteredScreens,
      getScreenAudioCount,
      getScreenProgress
    };
  }
});
</script>