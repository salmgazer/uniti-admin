<template>
  <Layout :pageTitle="screenLabel">
    <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <div class="flex items-center space-x-3 mb-2">
          <router-link to="/app-settings" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">{{ screenLabel }}</h2>
        </div>
        <p class="text-gray-500">Manage audio guides for this screen</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="language in languages" :key="language.code" class="card">
        <div class="px-4 py-2">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-gray-900 text-sm">{{ language.title }}</h3>
            <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{{ language.code }}</span>
          </div>
          
          <div v-if="getAudio(language.code)">
            <!-- Audio Player -->
            <div class="bg-gray-50 rounded-lg p-2 mb-2">
              <div class="flex items-center space-x-2">
                <button @click="toggleAudio(language.code)" 
                        class="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <svg v-if="!isPlaying(language.code)" class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                <div class="flex-1">
                  <div class="flex items-center justify-between text-xs text-gray-500 mb-0.5">
                    <span>{{ formatTime(getCurrentTime(language.code)) }}</span>
                    <span>{{ formatTime(getDuration(language.code)) }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer" @click="(e) => seekAudio(e, language.code)">
                    <div class="bg-green-600 h-1.5 rounded-full transition-all duration-100" :style="{ width: getProgress(language.code) + '%' }"></div>
                  </div>
                </div>
                
                <button @click="removeAudio(getAudio(language.code)!.id)" 
                        class="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-red-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button @click="triggerFileInput(language.code)"
                    class="w-full py-1.5 px-3 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">
              Replace
            </button>
          </div>
          
          <div v-else class="text-center">
            <div class="py-3">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-gray-500 text-xs mb-2">No audio</p>
            </div>
            <button @click="triggerFileInput(language.code)"
                    class="w-full py-2 px-3 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Upload
            </button>
          </div>
          
          <input type="file" 
                 accept="audio/mp3,audio/mpeg" 
                 @change="(e) => uploadAudio(e, language.code)"
                 class="hidden" 
                 :id="`fileInput-${language.code}`" />
        </div>
      </div>
    </div>

    <!-- Upload Progress Modal -->
    <div v-if="uploading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-700">Uploading audio...</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
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
  name: 'AppScreenDetail',
  components: { Layout },
  setup() {
    const route = useRoute();
    const audios = ref<AudioFile[]>([]);
    const languages = ref<Language[]>([]);
    const uploading = ref(false);
    const audioElements = ref<Record<string, HTMLAudioElement>>({});
    const audioStates = ref<Record<string, { isPlaying: boolean; currentTime: number; duration: number }>>({});
    
    const screenName = computed(() => route.params.screenName as string);
    
    const screenLabels: Record<string, string> = {
      'WelcomeLanguageScreen': 'Welcome Language Audio',
      'WelcomeSigninScreen': 'Welcome Sign In Audio',
      'RegistrationPhoneNumberScreen': 'Registration Phone Audio',
      'RegistrationVerificationCodeScreen': 'Registration Verification Audio',
      'RegistrationUploadIdScreen': 'Registration Upload ID Audio',
      'RegistrationSelfieScreen': 'Registration Selfie Audio',
      'RegistrationGoalsScreen': 'Registration Goals Audio',
      'RegistrationRecommendedAppsScreen': 'Registration Apps Audio',
      'RegistrationPinSetupScreen': 'Registration PIN Setup Audio',
      'HomeGoalsScreen': 'Home Goals Audio',
      'HomeMessagesScreen': 'Home Messages Audio',
      'HomeProfileScreen': 'Home Profile Audio',
      'HomeSupportScreen': 'Home Support Audio'
    };
    
    const screenLabel = computed(() => screenLabels[screenName.value] || screenName.value);

    const loadAudios = async () => {
      try {
        const response = await api.get(`/app-screen-audio/screen/${screenName.value}`);
        audios.value = response.data;
        console.log('Loaded audios:', audios.value);
      } catch (error) {
        console.error('Failed to load audios:', error);
      }
    };

    const loadLanguages = async () => {
      try {
        const response = await api.get('/languages');
        languages.value = response.data.data;
        console.log('Loaded languages:', languages.value);
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };

    const getAudio = (languageCode: string) => {
      const audio = audios.value.find(a => a.languageCode === languageCode);
      console.log(`Looking for audio with languageCode: ${languageCode}, found:`, audio);
      return audio;
    };

    const triggerFileInput = (languageCode: string) => {
      const input = document.getElementById(`fileInput-${languageCode}`) as HTMLInputElement;
      input?.click();
    };

    const uploadAudio = async (event: Event, languageCode: string) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      try {
        uploading.value = true;
        const formData = new FormData();
        formData.append('audioFile', file);
        formData.append('screenName', screenName.value);
        formData.append('languageCode', languageCode);

        await api.post('/app-screen-audio/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        await loadAudios();
        target.value = '';
      } catch (error) {
        console.error('Failed to upload audio:', error);
      } finally {
        uploading.value = false;
      }
    };

    const initAudio = (languageCode: string, audioUrl: string) => {
      if (!audioElements.value[languageCode]) {
        const audio = new Audio(audioUrl);
        
        // Initialize state immediately
        audioStates.value[languageCode] = {
          isPlaying: false,
          currentTime: 0,
          duration: 0
        };
        
        audio.addEventListener('loadedmetadata', () => {
          audioStates.value[languageCode].duration = audio.duration;
        });
        audio.addEventListener('timeupdate', () => {
          audioStates.value[languageCode].currentTime = audio.currentTime;
        });
        audio.addEventListener('ended', () => {
          audioStates.value[languageCode].isPlaying = false;
        });
        audioElements.value[languageCode] = audio;
      }
    };

    const toggleAudio = (languageCode: string) => {
      const audio = getAudio(languageCode);
      if (!audio) return;
      
      initAudio(languageCode, audio.audioUrl);
      const audioElement = audioElements.value[languageCode];
      
      if (audioStates.value[languageCode]?.isPlaying) {
        audioElement.pause();
        audioStates.value[languageCode].isPlaying = false;
      } else {
        audioElement.play();
        audioStates.value[languageCode].isPlaying = true;
      }
    };

    const seekAudio = (event: MouseEvent, languageCode: string) => {
      const audio = getAudio(languageCode);
      if (!audio) return;
      
      initAudio(languageCode, audio.audioUrl);
      const audioElement = audioElements.value[languageCode];
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      const newTime = percent * audioElement.duration;
      
      audioElement.currentTime = newTime;
      audioStates.value[languageCode].currentTime = newTime;
    };

    const isPlaying = (languageCode: string) => {
      return audioStates.value[languageCode]?.isPlaying || false;
    };

    const getCurrentTime = (languageCode: string) => {
      return audioStates.value[languageCode]?.currentTime || 0;
    };

    const getDuration = (languageCode: string) => {
      return audioStates.value[languageCode]?.duration || 0;
    };

    const getProgress = (languageCode: string) => {
      const current = getCurrentTime(languageCode);
      const duration = getDuration(languageCode);
      return duration > 0 ? (current / duration) * 100 : 0;
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const removeAudio = async (audioId: string) => {
      if (!confirm('Are you sure you want to remove this audio?')) return;

      try {
        await api.delete(`/app-screen-audio/${audioId}`);
        await loadAudios();
      } catch (error) {
        console.error('Failed to remove audio:', error);
      }
    };

    onMounted(() => {
      loadAudios();
      loadLanguages();
    });

    return {
      audios,
      languages,
      uploading,
      screenName,
      screenLabel,
      getAudio,
      triggerFileInput,
      uploadAudio,
      toggleAudio,
      seekAudio,
      isPlaying,
      getCurrentTime,
      getDuration,
      getProgress,
      formatTime,
      removeAudio
    };
  }
});
</script>