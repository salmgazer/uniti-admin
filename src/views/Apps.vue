<template>
  <Layout pageTitle="Apps">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">App Management</h2>
      <div class="flex items-center space-x-3">
        <div class="relative">
          <select v-model="countryFilter" class="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">All Countries</option>
            <option v-for="country in uniqueCountries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search apps..." 
            class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add App
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div v-if="isLoading" class="col-span-full flex justify-center items-center h-64">
        <p class="text-gray-500">Loading apps...</p>
      </div>
      
      <div v-else-if="error" class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div v-else-if="apps.length === 0" class="col-span-full flex justify-center items-center h-64">
        <p class="text-gray-500">No apps found</p>
      </div>
      
      <div v-for="app in apps" :key="app.id" class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div class="relative">
          <div class="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
            <img v-if="app.imageUrl" :src="app.imageUrl" class="h-16 w-16 object-cover rounded-lg" alt="" />
            <div v-else class="h-16 w-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-semibold text-xl">
              {{ app.title.charAt(0).toUpperCase() }}
            </div>
          </div>
          <span v-if="app.countryCode" class="absolute top-2 right-2 px-1.5 py-0.5 text-xs font-medium rounded bg-white/80 text-gray-700">
            {{ app.countryCode }}
          </span>
        </div>
        
        <div class="p-3">
          <h3 class="font-semibold text-gray-900 text-sm truncate" :title="app.title">{{ app.title }}</h3>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ app.description || 'No description' }}</p>
          
          <div v-if="app.goalCategory" class="mt-2">
            <span 
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-blue-100 text-blue-700': app.goalCategory.name === 'education',
                'bg-green-100 text-green-700': app.goalCategory.name === 'financial',
                'bg-purple-100 text-purple-700': app.goalCategory.name === 'health',
                'bg-yellow-100 text-yellow-700': app.goalCategory.name === 'work'
              }"
            >
              {{ app.goalCategory.name }}
            </span>
          </div>
          
          <div class="mt-3 flex items-center justify-between">
            <div class="flex space-x-1">
              <button @click="editApp(app)" class="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Edit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDelete(app)" class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <router-link :to="`/apps/${app.id}`" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="View Details">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ showEditModal ? 'Edit App' : 'Create New App' }}
            </h3>
            <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form @submit.prevent="showEditModal ? updateApp() : createApp()" class="space-y-5">
          
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title <span class="text-red-500">*</span></label>
                <input 
                  id="title" 
                  v-model="formData.title" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter app title"
                />
              </div>
              
              <div>
                <label for="appId" class="block text-sm font-medium text-gray-700 mb-2">App ID <span class="text-red-500">*</span></label>
                <input 
                  id="appId" 
                  v-model="formData.appId" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="com.example.app"
                />
              </div>
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                rows="3" 
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Brief description of the app"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input 
                  id="imageUrl" 
                  v-model="formData.imageUrl" 
                  type="url" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.png"
                />
              </div>
              
              <div>
                <label for="countryCode" class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select id="countryCode" v-model="formData.countryCode" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">No country</option>
                  <option v-for="country in countries" :key="country.code" :value="country.code">
                    {{ country.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div>
              <label for="goalCategoryId" class="block text-sm font-medium text-gray-700 mb-2">Goal Category <span class="text-red-500">*</span></label>
              <select id="goalCategoryId" v-model="formData.goalCategoryId" @change="onCategoryChange" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required>
                <option value="" disabled>Select a category</option>
                <option v-for="category in goalCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div v-if="filteredGoalSubCategories.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Goal Sub Categories</label>
              <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div class="space-y-2">
                  <label v-for="subCategory in filteredGoalSubCategories" :key="subCategory.id" class="flex items-center cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors">
                    <input 
                      type="checkbox" 
                      :value="subCategory.id" 
                      v-model="formData.goalSubCategoryIds" 
                      @change="updateAvailableGoals"
                      class="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700">{{ subCategory.name }}</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div v-if="availableGoals.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Goals</label>
              <div class="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                <label v-for="goal in availableGoals" :key="goal.id" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="goal.id" 
                    v-model="formData.goalIds" 
                    class="mr-2"
                  />
                  <span class="text-sm">{{ goal.title }}</span>
                </label>
              </div>
            </div>

            
            <!-- Audio Files Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Audio Files</label>
              <div class="space-y-3">
                <div v-for="(audio, index) in formData.audios" :key="index" class="flex space-x-2 items-end">
                  <div class="flex-1 min-w-[200px]">
                    <label class="block text-xs text-gray-500">Language</label>
                    <select v-model="audio.languageCode" class="input text-sm w-full">
                      <option value="">Select language</option>
                      <option 
                        v-for="lang in languages" 
                        :key="lang.code" 
                        :value="lang.code"
                        :disabled="isLanguageSelected(lang.code, index)"
                      >
                        {{ lang.title }}
                      </option>
                    </select>
                  </div>
                  <div class="flex-2">
                    <label class="block text-xs text-gray-500">Audio File</label>
                    <input 
                      type="file" 
                      accept="audio/mp3,audio/mpeg" 
                      @change="(e) => handleAudioFileChange(e, index)" 
                      class="input text-sm" 
                    />
                  </div>
                  <button type="button" @click="removeAudio(index)" class="btn bg-red-500 text-white text-sm px-2 py-1">
                    Remove
                  </button>
                </div>
                <button type="button" @click="addAudio" class="btn btn-secondary text-sm">
                  Add Audio File
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            @click="showEditModal ? updateApp() : createApp()"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            :disabled="formSubmitting"
          >
            <span v-if="formSubmitting" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ showEditModal ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ showEditModal ? 'Update App' : 'Create App' }}
            </span>
          </button>
      </div>
    </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete the app "{{ appToDelete?.title }}"? This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="showDeleteModal = false" 
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="deleteApp" 
            class="btn bg-red-600 text-white hover:bg-red-700"
            :disabled="formSubmitting"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, onMounted, watch } from 'vue';
import { api, endpoints, App, Country, Language, AppAudio } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'Apps',
  components: {
    Layout
  },
  setup() {
    const searchQuery = ref('');
    const countryFilter = ref('');
    const apps = ref<App[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    
    const goalCategories = ref<any[]>([]);
    const countries = ref<Country[]>([]);
    const languages = ref<Language[]>([]);
    const allGoalSubCategories = ref<any[]>([]);
    const filteredGoalSubCategories = ref<any[]>([]);
    const goals = ref<any[]>([]);
    const availableGoals = ref<any[]>([]);
    
    const loadGoalCategories = async () => {
      try {
        const response = await api.get('/goal-categories');
        goalCategories.value = response.data;
      } catch (err) {
        console.error('Failed to load goal categories:', err);
      }
    };
    
    const loadGoalSubCategories = async () => {
      try {
        const response = await api.get('/goal-sub-categories');
        allGoalSubCategories.value = response.data;
      } catch (err) {
        console.error('Failed to load goal sub categories:', err);
      }
    };
    
    const loadGoals = async () => {
      try {
        const response = await api.get('/goals');
        goals.value = response.data;
      } catch (err) {
        console.error('Failed to load goals:', err);
      }
    };
    
    const loadCountries = async () => {
      try {
        const response = await api.get('/countries');
        countries.value = response.data;
      } catch (err) {
        console.error('Failed to load countries:', err);
      }
    };
    
    const loadLanguages = async () => {
      try {
        const response = await api.get('/languages');
        languages.value = response.data;
      } catch (err) {
        console.error('Failed to load languages:', err);
      }
    };
    
    onMounted(() => {
      loadGoalCategories();
      loadGoalSubCategories();
      loadGoals();
      loadCountries();
      loadLanguages();
    });
    
    const fetchApps = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        const params: any = {};
        if (searchQuery.value) params.search = searchQuery.value;
        if (countryFilter.value) params.country = countryFilter.value;
        
        const response = await api.get(endpoints.apps, { params });
        apps.value = response.data;
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch apps';
      } finally {
        isLoading.value = false;
      }
    };
    
    const uniqueCountries = computed(() => {
      if (!apps.value) return [];
      
      const countryCodes = apps.value
        .map(app => app.countryCode)
        .filter(Boolean) as string[];
      
      return [...new Set(countryCodes)];
    });
    
    // Debounced search
    let searchTimeout: NodeJS.Timeout;
    watch([searchQuery, countryFilter], () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchApps();
      }, 300);
    });
    
    onMounted(() => {
      fetchApps();
    });
    
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const formSubmitting = ref(false);
    const appToDelete = ref<App | null>(null);
    
    const formData = reactive({
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      appId: '',
      goalCategoryId: '',
      countryCode: '',
      goalSubCategoryIds: [] as string[],
      goalIds: [] as string[],
      audios: [] as { languageCode: string; file: File | null }[]
    });
    
    const resetForm = () => {
      formData.id = '';
      formData.title = '';
      formData.description = '';
      formData.imageUrl = '';
      formData.appId = '';
      formData.goalCategoryId = '';
      formData.countryCode = '';
      formData.goalSubCategoryIds = [];
      formData.goalIds = [];
      formData.audios = [];
      availableGoals.value = [];
    };
    
    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      resetForm();
    };
    
    const editApp = async (app: App) => {
      formData.id = app.id;
      formData.title = app.title;
      formData.description = app.description || '';
      formData.imageUrl = app.imageUrl || '';
      formData.appId = app.appId;
      formData.goalCategoryId = app.goalCategory?.id || '';
      formData.countryCode = app.countryCode || '';
      
      // Filter sub categories and set selections
      if (formData.goalCategoryId) {
        onCategoryChange();
      }
      formData.goalSubCategoryIds = app.goalSubCategories?.map((sc: any) => sc.id).filter(Boolean) || [];
      formData.goalIds = app.goals?.map((g: any) => g.id).filter(Boolean) || [];
      formData.audios = app.audios?.map((audio: AppAudio) => ({
        languageCode: audio.languageCode,
        file: null // Existing files can't be edited, only replaced
      })) || [];
      updateAvailableGoals();
      
      showEditModal.value = true;
    };
    
    const createApp = async () => {
      try {
        formSubmitting.value = true;
        const response = await api.post(endpoints.apps, {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          appId: formData.appId,
          goalCategoryId: formData.goalCategoryId,
          countryCode: formData.countryCode
        });
        
        // Upload audio files if any
        await uploadAudioFiles(response.data.id);
        
        if (formData.goalSubCategoryIds.length > 0) {
          await api.patch(`/apps/${response.data.id}/goal-sub-categories`, {
            goalSubCategoryIds: formData.goalSubCategoryIds
          });
        }
        
        if (formData.goalIds.length > 0) {
          await api.patch(`/apps/${response.data.id}/goals`, {
            goalIds: formData.goalIds
          });
        }
        
        await fetchApps();
        closeModal();
      } catch (err) {
        console.error('Failed to create app:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const updateApp = async () => {
      try {
        formSubmitting.value = true;
        await api.patch(endpoints.app(formData.id), {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          appId: formData.appId,
          goalCategoryId: formData.goalCategoryId,
          countryCode: formData.countryCode
        });
        
        // Upload audio files if any
        await uploadAudioFiles(formData.id);
        
        await api.patch(`/apps/${formData.id}/goal-sub-categories`, {
          goalSubCategoryIds: formData.goalSubCategoryIds
        });
        
        await api.patch(`/apps/${formData.id}/goals`, {
          goalIds: formData.goalIds
        });
        
        await fetchApps();
        closeModal();
      } catch (err) {
        console.error('Failed to update app:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDelete = (app: App) => {
      appToDelete.value = app;
      showDeleteModal.value = true;
    };
    
    const deleteApp = async () => {
      if (!appToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(endpoints.app(appToDelete.value.id));
        
        await fetchApps();
        showDeleteModal.value = false;
        appToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete app:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const onCategoryChange = () => {
      // Filter sub categories by selected category
      filteredGoalSubCategories.value = allGoalSubCategories.value.filter(
        sc => sc.goalCategoryId === formData.goalCategoryId
      );
      
      // Clear selected sub categories and goals
      formData.goalSubCategoryIds = [];
      formData.goalIds = [];
      availableGoals.value = [];
    };
    
    const updateAvailableGoals = () => {
      if (formData.goalSubCategoryIds.length === 0) {
        availableGoals.value = [];
        formData.goalIds = [];
        return;
      }
      
      availableGoals.value = goals.value.filter(goal => 
        formData.goalSubCategoryIds.includes(goal.goalSubCategoryId)
      );
      
      // Remove selected goals that are no longer available
      formData.goalIds = formData.goalIds.filter(goalId => 
        availableGoals.value.some(goal => goal.id === goalId)
      );
    };
    
    const addAudio = () => {
      formData.audios.push({ languageCode: '', file: null });
    };
    
    const handleAudioFileChange = (event: Event, index: number) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        formData.audios[index].file = target.files[0];
      }
    };
    
    const removeAudio = (index: number) => {
      formData.audios.splice(index, 1);
    };
    
    const isLanguageSelected = (languageCode: string, currentIndex: number) => {
      return formData.audios.some((audio, index) => 
        index !== currentIndex && audio.languageCode === languageCode
      );
    };
    
    const uploadAudioFiles = async (appId: string) => {
      const validAudios = formData.audios.filter(audio => audio.languageCode && audio.file);
      
      if (validAudios.length === 0) return;
      
      // Check for duplicate languages
      const languageCodes = validAudios.map(audio => audio.languageCode);
      const uniqueLanguages = new Set(languageCodes);
      if (uniqueLanguages.size !== languageCodes.length) {
        alert('Duplicate languages are not allowed');
        return;
      }
      
      const formDataUpload = new FormData();
      
      validAudios.forEach((audio) => {
        formDataUpload.append('audioFiles', audio.file!);
        formDataUpload.append('languageCodes', audio.languageCode);
      });
      
      await api.post(`/apps/${appId}/audio`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };
    
    const truncate = (text: string, length: number) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
    };
    
    return {
      apps,
      error,
      isLoading,
      searchQuery,
      countryFilter,
      uniqueCountries,
      goalCategories,
      filteredGoalSubCategories,
      goals,
      countries,
      languages,
      availableGoals,
      onCategoryChange,
      updateAvailableGoals,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      appToDelete,
      closeModal,
      editApp,
      createApp,
      updateApp,
      confirmDelete,
      deleteApp,
      addAudio,
      removeAudio,
      handleAudioFileChange,
      isLanguageSelected,
      truncate
    };
  }
});
</script>