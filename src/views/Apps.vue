<template>
  <Layout pageTitle="Apps">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">App Management</h2>
      <div class="flex space-x-2">
        <select v-model="countryFilter" class="input">
          <option value="">All Countries</option>
          <option v-for="country in uniqueCountries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search apps..." 
          class="input"
        />
        <button @click="showCreateModal = true" class="btn btn-primary">
          Add App
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="isLoading" class="col-span-full flex justify-center items-center h-64">
        <p class="text-gray-500">Loading apps...</p>
      </div>
      
      <div v-else-if="error" class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div v-else-if="filteredApps.length === 0" class="col-span-full flex justify-center items-center h-64">
        <p class="text-gray-500">No apps found</p>
      </div>
      
      <div v-for="app in filteredApps" :key="app.id" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="h-40 bg-gray-200 flex items-center justify-center">
          <img v-if="app.imageUrl" :src="app.imageUrl" class="h-full w-full object-cover" alt="" />
          <div v-else class="text-4xl text-gray-400">
            {{ app.title.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">{{ app.title }}</h3>
            <span v-if="app.countryCode" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              {{ app.countryCode }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500">{{ truncate(app.description || '', 100) }}</p>
          <p class="mt-2 text-xs text-gray-500">App ID: {{ app.appId }}</p>
          
          <div v-if="app.goalCategory" class="mt-2">
            <p class="text-xs text-gray-500">Related Category:</p>
            <div class="flex items-center mt-1">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2"
                :class="{
                  'bg-blue-100 text-blue-800': app.goalCategory.name === 'education',
                  'bg-green-100 text-green-800': app.goalCategory.name === 'financial',
                  'bg-purple-100 text-purple-800': app.goalCategory.name === 'health',
                  'bg-yellow-100 text-yellow-800': app.goalCategory.name === 'work'
                }"
              >
                {{ app.goalCategory.name }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 flex justify-between">
            <div>
              <button @click="editApp(app)" class="text-sm text-primary-600 hover:text-primary-900 mr-3">
                Edit
              </button>
              <button @click="confirmDelete(app)" class="text-sm text-red-600 hover:text-red-900">
                Delete
              </button>
            </div>
            <router-link :to="`/apps/${app.id}`" class="text-sm text-primary-600 hover:text-primary-900">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit App' : 'Create App' }}
          </h3>
          
          <form @submit.prevent="showEditModal ? updateApp() : createApp()">
            <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input 
                id="title" 
                v-model="formData.title" 
                type="text" 
                required 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="appId" class="block text-sm font-medium text-gray-700">App ID</label>
              <input 
                id="appId" 
                v-model="formData.appId" 
                type="text" 
                required 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                rows="3" 
                class="input mt-1"
              ></textarea>
            </div>
            
            <div>
              <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
              <input 
                id="imageUrl" 
                v-model="formData.imageUrl" 
                type="text" 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="goalCategoryId" class="block text-sm font-medium text-gray-700">Goal Category</label>
              <select id="goalCategoryId" v-model="formData.goalCategoryId" @change="onCategoryChange" class="input mt-1" required>
                <option value="" disabled>Select a category</option>
                <option v-for="category in goalCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Goal Sub Categories</label>
              <div class="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                <label v-for="subCategory in filteredGoalSubCategories" :key="subCategory.id" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="subCategory.id" 
                    v-model="formData.goalSubCategoryIds" 
                    @change="updateAvailableGoals"
                    class="mr-2"
                  />
                  <span class="text-sm">{{ subCategory.name }}</span>
                </label>
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
            
            <div>
              <label for="countryCode" class="block text-sm font-medium text-gray-700">Country</label>
              <select id="countryCode" v-model="formData.countryCode" class="input mt-1">
                <option value="">No country</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
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
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="formSubmitting"
              >
                {{ showEditModal ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
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
import { defineComponent, ref, computed, reactive, onMounted } from 'vue';
import swrv from 'swrv';
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
    
    const { data: apps, error, isValidating: isLoading, mutate } = swrv<App[]>(
      endpoints.apps,
      () => api.get(endpoints.apps).then(res => res.data)
    );
    
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
    
    const uniqueCountries = computed(() => {
      if (!apps.value) return [];
      
      const countryCodes = apps.value
        .map(app => app.countryCode)
        .filter(Boolean) as string[];
      
      return [...new Set(countryCodes)];
    });
    
    const filteredApps = computed(() => {
      if (!apps.value) return [];
      
      return apps.value.filter(app => {
        // Apply country filter
        if (countryFilter.value && app.countryCode !== countryFilter.value) {
          return false;
        }
        
        // Apply search query
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          return app.title.toLowerCase().includes(query) || 
                 app.appId.toLowerCase().includes(query) ||
                 (app.description?.toLowerCase().includes(query) || false);
        }
        
        return true;
      });
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
        
        await mutate();
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
        
        await mutate();
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
        
        await mutate();
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
      
      validAudios.forEach((audio, index) => {
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
      filteredApps,
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