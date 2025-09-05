<template>
  <Layout pageTitle="App Settings">
    <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">App Settings</h2>
        <p class="text-gray-500 mt-1">Manage audio guides for app screens</p>
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
          <tr v-for="screen in screens" :key="screen.value" class="hover:bg-gray-50 transition-colors duration-150">
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
import { defineComponent, ref, onMounted } from 'vue';
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
    
    const screens = [
      { value: 'HomeGoalsScreen', label: 'Home Goals', description: 'Audio guide for the goals screen' },
      { value: 'HomeMessagesScreen', label: 'Home Messages', description: 'Audio guide for the messages screen' },
      { value: 'HomeProfileScreen', label: 'Home Profile', description: 'Audio guide for the profile screen' },
      { value: 'HomeRecommendationsScreen', label: 'Home Recommendations', description: 'Audio guide for the recommendations screen' }
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

    return {
      audios,
      languages,
      screens,
      getScreenAudioCount,
      getScreenProgress
    };
  }
});
</script>