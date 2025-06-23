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
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="md:flex">
          <div class="md:flex-shrink-0 h-64 md:w-1/3 bg-gray-200 flex items-center justify-center">
            <img v-if="app.imageUrl" :src="app.imageUrl" class="h-full w-full object-cover" alt="" />
            <div v-else class="text-6xl text-gray-400">
              {{ app.title.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="p-6 md:w-2/3">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ app.title }}</h2>
                <p class="text-sm text-gray-500">ID: {{ app.id }}</p>
              </div>
              <span v-if="app.countryCode" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ app.countryCode }}
              </span>
            </div>
            
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-500">Description</p>
              <p class="mt-1">{{ app.description || 'No description provided' }}</p>
            </div>
            
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-500">App ID</p>
              <p class="mt-1">{{ app.appId }}</p>
            </div>
            
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Created</p>
                <p class="mt-1">{{ formatDate(app.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Last Updated</p>
                <p class="mt-1">{{ formatDate(app.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Goal -->
      <div v-if="app.goal" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Related Goal</h3>
        
        <div class="border rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">{{ app.goal.title }}</h4>
              <p class="text-sm text-gray-500">{{ app.goal.description || 'No description' }}</p>
            </div>
            <div class="flex space-x-2">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': app.goal.category === 'education',
                  'bg-green-100 text-green-800': app.goal.category === 'financial',
                  'bg-purple-100 text-purple-800': app.goal.category === 'health',
                  'bg-yellow-100 text-yellow-800': app.goal.category === 'work'
                }"
              >
                {{ app.goal.category }}
              </span>
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': app.goal.status === 'active',
                  'bg-green-100 text-green-800': app.goal.status === 'completed',
                  'bg-red-100 text-red-800': app.goal.status === 'abandoned'
                }"
              >
                {{ app.goal.status }}
              </span>
            </div>
          </div>
          
          <div class="mt-2">
            <div class="flex justify-between text-sm">
              <span>Progress</span>
              <span>{{ app.goal.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                class="bg-primary-600 h-2.5 rounded-full" 
                :style="{ width: `${app.goal.progress}%` }"
              ></div>
            </div>
          </div>
          
          <div class="mt-4 text-right">
            <router-link :to="`/goals/${app.goal.id}`" class="text-sm text-primary-600 hover:text-primary-900">
              View Goal Details
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Country Information -->
      <div v-if="app.country" class="bg-white rounded-lg shadow p-6">
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
        
        <div class="mt-4 text-right">
          <router-link :to="`/apps?country=${app.countryCode}`" class="text-sm text-primary-600 hover:text-primary-900">
            View All Apps for {{ app.country.name }}
          </router-link>
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
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    return {
      app,
      error,
      isLoading,
      formatDate
    };
  }
});
</script>