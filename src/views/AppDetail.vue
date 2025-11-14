<template>
  <Layout :pageTitle="app ? `App: ${app.title}` : 'App Details'">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Loading app data...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    
    <div v-else-if="app" class="space-y-6">
      <!-- App Details -->
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="md:flex">
          <div class="md:flex-shrink-0 h-48 md:w-1/4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <img v-if="app.imageUrl" :src="app.imageUrl" class="h-32 w-32 object-cover rounded-lg" alt="" />
            <div v-else class="h-32 w-32 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-4xl">
              {{ app.title.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="p-5 md:w-3/4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ app.title }}</h2>
                <p class="text-xs text-gray-500">{{ app.appId }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span v-if="app.countryCode" class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {{ app.countryCode }}
                </span>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {{ totalUsers || 0 }} users
                </span>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-3">{{ app.description || 'No description provided' }}</p>
            
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p class="font-medium text-gray-500">Created</p>
                <p class="text-gray-700">{{ formatDate(app.createdAt) }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-500">Updated</p>
                <p class="text-gray-700">{{ formatDate(app.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Goal Category -->
      <div v-if="app.goalCategory" class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Goal Category</h3>
        <div class="bg-white border border-gray-200 rounded-lg p-3">
          <h4 class="font-medium text-sm">{{ app.goalCategory.name }}</h4>
          <p class="text-xs text-gray-500 mt-1">{{ app.goalCategory.description || 'No description' }}</p>
        </div>
      </div>
      
      <!-- Goal Sub Categories -->
      <div v-if="app.goalSubCategories?.length" class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Goal Sub Categories</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div v-for="subCategory in app.goalSubCategories" :key="subCategory.id" class="bg-white border border-gray-200 rounded-lg p-3">
            <h4 class="font-medium text-sm">{{ subCategory.name }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ subCategory.description || 'No description' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Goals -->
      <div v-if="app.goals?.length" class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Supported Goals</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div v-for="goal in app.goals" :key="goal.id" class="bg-white border border-gray-200 rounded-lg p-3">
            <h4 class="font-medium text-sm">{{ goal.title }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ goal.description || 'No description' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Audio Files -->
      <div v-if="app.audios?.length" class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Audio Files</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="audio in app.audios" :key="audio.id" class="bg-white border border-gray-200 rounded-lg p-3">
            <div class="flex justify-between items-center mb-2">
              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {{ audio.languageCode.toUpperCase() }}
              </span>
              <span class="text-xs text-gray-400">{{ formatDate(audio.createdAt) }}</span>
            </div>
            <audio controls class="w-full h-8 mb-2">
              <source :src="audio.fileUrl" type="audio/mpeg">
            </audio>
            <a :href="audio.fileUrl" target="_blank" class="text-xs text-primary-600 hover:text-primary-700 truncate block">
              Download
            </a>
          </div>
        </div>
      </div>
      
      <!-- Country Information -->
      <div v-if="app.country" class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Country Information</h3>
        
        <div class="flex items-center">
          <div v-if="app.country.flagUrl" class="flex-shrink-0 h-12 w-16">
            <img :src="app.country.flagUrl" class="h-full w-full object-cover rounded" alt="" />
          </div>
          <div class="ml-4">
            <h4 class="font-medium">{{ app.country.name }}</h4>
            <p class="text-sm text-gray-500">Code: {{ app.country.code }}</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import swrv from 'swrv';
import { api, endpoints, App } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'AppDetail',
  components: {
    Layout
  },
  setup() {
    const route = useRoute();
    const appId = computed(() => route.params.id as string);
    
    const { data: app, error, isValidating: isLoading } = swrv<App>(
      () => appId.value ? endpoints.app(appId.value) : null,
      (key) => api.get(key).then(res => res.data)
    );
    
    const { data: totalUsers } = swrv<number>(
      () => appId.value ? `/apps/${appId.value}/users/count` : null,
      (key) => api.get(key).then(res => res.data.count)
    );
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    return {
      app,
      error,
      isLoading,
      totalUsers,
      formatDate
    };
  }
});
</script>