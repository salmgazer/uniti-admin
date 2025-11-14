<template>
  <Layout pageTitle="Countries">
    <DataTable
      title="Country Management"
      :data="countries?.data || []"
      :loading="isLoading"
      :error="error"
      :pagination="countries"
      :columns="columns"
      :show-search="true"
      :show-export="true"
      :search-value="searchQuery"
      :is-exporting="isExporting"
      @search="handleSearch"
      @page-change="handlePageChange"
      @export="handleExport"
    >
      <template #actions>
        <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Country
        </button>
      </template>
      
      <template #cell-flag="{ item }">
        <div class="flex-shrink-0 h-10 w-16">
          <img v-if="item.flagUrl" :src="item.flagUrl" class="h-10 w-16 object-cover rounded" alt="" />
          <div v-else class="h-10 w-16 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            {{ item.code }}
          </div>
        </div>
      </template>
      
      <template #cell-displayLang="{ item }">
        {{ item.preferredDisplayLanguage?.title || '-' }}
      </template>
      
      <template #cell-voiceLang="{ item }">
        {{ item.preferredVoiceLanguage?.title || '-' }}
      </template>
      
      <template #cell-actions="{ item }">
        <button 
          @click="editCountry(item)" 
          class="text-primary-600 hover:text-primary-900 mr-3"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          @click="confirmDelete(item)" 
          class="text-red-600 hover:text-red-900"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </template>
    </DataTable>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Country' : 'Create Country' }}
        </h3>
        
        <form @submit.prevent="showEditModal ? updateCountry() : createCountry()">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label for="code" class="block text-sm font-medium text-gray-700">Country Code (ISO 3166-1 alpha-2)</label>
                <input 
                  id="code" 
                  v-model="formData.code" 
                  type="text" 
                  required 
                  maxlength="2"
                  :disabled="showEditModal"
                  class="input mt-1 uppercase"
                />
                <p class="text-xs text-gray-500 mt-1">Two-letter country code (e.g., US, GB, GH)</p>
              </div>
              
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Country Name</label>
                <input 
                  id="name" 
                  v-model="formData.name" 
                  type="text" 
                  required 
                  class="input mt-1"
                />
              </div>
              
              <div>
                <label for="flagUrl" class="block text-sm font-medium text-gray-700">Flag URL</label>
                <input 
                  id="flagUrl" 
                  v-model="formData.flagUrl" 
                  type="text" 
                  class="input mt-1"
                />
              </div>
              
              <div v-if="formData.flagUrl" class="mt-2">
                <p class="text-sm font-medium text-gray-700">Flag Preview</p>
                <div class="mt-1 h-32 w-48 border rounded">
                  <img :src="formData.flagUrl" class="h-full w-full object-cover rounded" alt="Flag preview" />
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Supported Languages</label>
                <div v-if="selectedLanguages.length" class="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p class="text-sm font-medium text-green-800 mb-1">Currently supported:</p>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="lang in selectedLanguages" :key="lang.id" class="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {{ lang.title }} ({{ lang.code }})
                      <button @click="removeLanguage(lang.id)" class="ml-1 text-green-600 hover:text-green-800">×</button>
                    </span>
                  </div>
                </div>
                <input 
                  v-model="languageSearch" 
                  type="text" 
                  placeholder="Search languages..."
                  class="input mb-2"
                  @input="searchLanguages"
                />
                <div class="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                  <label v-for="language in languageResults" :key="language.id" class="flex items-center">
                    <input 
                      type="checkbox" 
                      :value="language.id" 
                      v-model="formData.languageIds" 
                      class="mr-2"
                      @change="updateSelectedLanguages"
                    />
                    <span class="text-sm">{{ language.title }} ({{ language.code }})</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label for="displayLanguageSearch" class="block text-sm font-medium text-gray-700">Preferred Display Language</label>
                <div v-if="selectedDisplayLanguage" class="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  Selected: {{ selectedDisplayLanguage.title }} ({{ selectedDisplayLanguage.code }})
                  <button @click="clearDisplayLanguage" class="ml-2 text-red-600 hover:text-red-800">×</button>
                </div>
                <input 
                  id="displayLanguageSearch"
                  v-model="displayLanguageSearch" 
                  type="text" 
                  placeholder="Search languages..."
                  class="input mt-1"
                  @input="searchDisplayLanguages"
                />
                <div v-if="displayLanguageResults.length" class="mt-1 max-h-32 overflow-y-auto border rounded">
                  <div 
                    v-for="language in displayLanguageResults" 
                    :key="language.id" 
                    @click="selectDisplayLanguage(language)"
                    class="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {{ language.title }} ({{ language.code }})
                  </div>
                </div>
              </div>
              
              <div>
                <label for="voiceLanguageSearch" class="block text-sm font-medium text-gray-700">Preferred Voice Language</label>
                <div v-if="selectedVoiceLanguage" class="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  Selected: {{ selectedVoiceLanguage.title }} ({{ selectedVoiceLanguage.code }})
                  <button @click="clearVoiceLanguage" class="ml-2 text-red-600 hover:text-red-800">×</button>
                </div>
                <input 
                  id="voiceLanguageSearch"
                  v-model="voiceLanguageSearch" 
                  type="text" 
                  placeholder="Search languages..."
                  class="input mt-1"
                  @input="searchVoiceLanguages"
                />
                <div v-if="voiceLanguageResults.length" class="mt-1 max-h-32 overflow-y-auto border rounded">
                  <div 
                    v-for="language in voiceLanguageResults" 
                    :key="language.id" 
                    @click="selectVoiceLanguage(language)"
                    class="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {{ language.title }} ({{ language.code }})
                  </div>
                </div>
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
              <svg v-if="formSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ formSubmitting ? (showEditModal ? 'Updating...' : 'Creating...') : (showEditModal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete the country "{{ countryToDelete?.name }}" ({{ countryToDelete?.code }})? This action cannot be undone.
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
            @click="deleteCountry" 
            class="btn bg-red-600 text-white hover:bg-red-700"
            :disabled="formSubmitting"
          >
            <svg v-if="formSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ formSubmitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import swrv from 'swrv';
import { api, Country, PaginatedResponse } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable from '@/components/DataTable.vue';

export default defineComponent({
  name: 'Countries',
  components: {
    Layout,
    DataTable
  },
  setup() {
    const currentPage = ref(1);
    const searchQuery = ref('');
    const isExporting = ref(false);
    
    const { data: countries, error, isValidating: isLoading, mutate } = swrv<PaginatedResponse<Country>>(
      () => `/countries?page=${currentPage.value}&limit=10&search=${searchQuery.value}`,
      (url) => api.get(url).then(res => res.data)
    );
    
    const columns = [
      { key: 'flag', label: 'Flag' },
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'displayLang', label: 'Display Language' },
      { key: 'voiceLang', label: 'Voice Language' },
      { key: 'actions', label: 'Actions' }
    ];
    
    const displayLanguageSearch = ref('');
    const voiceLanguageSearch = ref('');
    const languageSearch = ref('');
    const displayLanguageResults = ref<any[]>([]);
    const voiceLanguageResults = ref<any[]>([]);
    const languageResults = ref<any[]>([]);
    const selectedDisplayLanguage = ref<any>(null);
    const selectedVoiceLanguage = ref<any>(null);
    const selectedLanguages = ref<any[]>([]);
    
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const formSubmitting = ref(false);
    const countryToDelete = ref<Country | null>(null);
    
    const formData = reactive({
      id: '',
      code: '',
      name: '',
      flagUrl: '',
      preferredDisplayLanguageId: '',
      preferredVoiceLanguageId: '',
      languageIds: [] as string[]
    });
    
    const resetForm = () => {
      formData.id = '';
      formData.code = '';
      formData.name = '';
      formData.flagUrl = '';
      formData.preferredDisplayLanguageId = '';
      formData.preferredVoiceLanguageId = '';
      formData.languageIds = [];
      displayLanguageSearch.value = '';
      voiceLanguageSearch.value = '';
      languageSearch.value = '';
      displayLanguageResults.value = [];
      voiceLanguageResults.value = [];
      languageResults.value = [];
      selectedDisplayLanguage.value = null;
      selectedVoiceLanguage.value = null;
      selectedLanguages.value = [];
    };
    
    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      resetForm();
    };
    
    const searchDisplayLanguages = async () => {
      if (displayLanguageSearch.value.length < 2) {
        displayLanguageResults.value = [];
        return;
      }
      try {
        const response = await api.get(`/languages?search=${displayLanguageSearch.value}&limit=10`);
        displayLanguageResults.value = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to search display languages:', error);
      }
    };
    
    const searchVoiceLanguages = async () => {
      if (voiceLanguageSearch.value.length < 2) {
        voiceLanguageResults.value = [];
        return;
      }
      try {
        const response = await api.get(`/languages?search=${voiceLanguageSearch.value}&limit=10`);
        voiceLanguageResults.value = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to search voice languages:', error);
      }
    };
    
    const searchLanguages = async () => {
      if (languageSearch.value.length < 2) {
        languageResults.value = [];
        return;
      }
      try {
        const response = await api.get(`/languages?search=${languageSearch.value}&limit=20`);
        languageResults.value = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to search languages:', error);
      }
    };
    
    const selectDisplayLanguage = (language: any) => {
      selectedDisplayLanguage.value = language;
      formData.preferredDisplayLanguageId = language.id;
      displayLanguageSearch.value = '';
      displayLanguageResults.value = [];
    };
    
    const selectVoiceLanguage = (language: any) => {
      selectedVoiceLanguage.value = language;
      formData.preferredVoiceLanguageId = language.id;
      voiceLanguageSearch.value = '';
      voiceLanguageResults.value = [];
    };
    
    const clearDisplayLanguage = () => {
      selectedDisplayLanguage.value = null;
      formData.preferredDisplayLanguageId = '';
    };
    
    const clearVoiceLanguage = () => {
      selectedVoiceLanguage.value = null;
      formData.preferredVoiceLanguageId = '';
    };
    
    const editCountry = (country: Country) => {
      formData.id = country.id;
      formData.code = country.code;
      formData.name = country.name;
      formData.flagUrl = country.flagUrl || '';
      formData.preferredDisplayLanguageId = country.preferredDisplayLanguage?.id || '';
      formData.preferredVoiceLanguageId = country.preferredVoiceLanguage?.id || '';
      formData.languageIds = country.languages?.map(l => l.id) || [];
      selectedDisplayLanguage.value = country.preferredDisplayLanguage || null;
      selectedVoiceLanguage.value = country.preferredVoiceLanguage || null;
      selectedLanguages.value = country.languages || [];
      showEditModal.value = true;
    };
    
    const removeLanguage = (languageId: string) => {
      formData.languageIds = formData.languageIds.filter(id => id !== languageId);
      selectedLanguages.value = selectedLanguages.value.filter(lang => lang.id !== languageId);
    };
    
    const updateSelectedLanguages = async () => {
      if (formData.languageIds.length === 0) {
        selectedLanguages.value = [];
        return;
      }
      
      const newLanguages = [];
      for (const id of formData.languageIds) {
        const existing = selectedLanguages.value.find(lang => lang.id === id);
        if (existing) {
          newLanguages.push(existing);
        } else {
          try {
            const response = await api.get(`/languages/${id}`);
            newLanguages.push(response.data);
          } catch (error) {
            console.error('Failed to fetch language details:', error);
          }
        }
      }
      selectedLanguages.value = newLanguages;
    };
    
    const createCountry = async () => {
      try {
        formSubmitting.value = true;
        const country = await api.post('/countries', {
          code: formData.code.toUpperCase(),
          name: formData.name,
          flagUrl: formData.flagUrl || null,
          preferredDisplayLanguageId: formData.preferredDisplayLanguageId || null,
          preferredVoiceLanguageId: formData.preferredVoiceLanguageId || null
        });
        
        if (formData.languageIds.length > 0) {
          await api.patch(`/countries/${country.data.id}/languages`, {
            languageIds: formData.languageIds
          });
        }
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to create country:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const updateCountry = async () => {
      try {
        formSubmitting.value = true;
        await api.patch(`/countries/${formData.id}`, {
          name: formData.name,
          flagUrl: formData.flagUrl || null,
          preferredDisplayLanguageId: formData.preferredDisplayLanguageId || null,
          preferredVoiceLanguageId: formData.preferredVoiceLanguageId || null
        });
        
        await api.patch(`/countries/${formData.id}/languages`, {
          languageIds: formData.languageIds
        });
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to update country:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDelete = (country: Country) => {
      countryToDelete.value = country;
      showDeleteModal.value = true;
    };
    
    const deleteCountry = async () => {
      if (!countryToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(`/countries/${countryToDelete.value.id}`);
        
        await mutate();
        showDeleteModal.value = false;
        countryToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete country:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const handleSearch = (query: string) => {
      searchQuery.value = query;
      currentPage.value = 1;
      mutate();
    };
    
    const handlePageChange = (page: number) => {
      currentPage.value = page;
      mutate();
    };
    
    const handleExport = async (format: 'csv' | 'excel') => {
      try {
        isExporting.value = true;
        const params = new URLSearchParams({ format });
        if (searchQuery.value) params.append('search', searchQuery.value);
        
        const response = await api.get(`/countries/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'countries.xlsx' : 'countries.csv';
        
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        isExporting.value = false;
      }
    };
    
    return {
      countries,
      error,
      isLoading,
      columns,
      searchQuery,
      isExporting,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      countryToDelete,
      displayLanguageSearch,
      voiceLanguageSearch,
      languageSearch,
      displayLanguageResults,
      voiceLanguageResults,
      languageResults,
      selectedDisplayLanguage,
      selectedVoiceLanguage,
      selectedLanguages,
      removeLanguage,
      closeModal,
      editCountry,
      createCountry,
      updateCountry,
      confirmDelete,
      deleteCountry,
      searchDisplayLanguages,
      searchVoiceLanguages,
      searchLanguages,
      selectDisplayLanguage,
      selectVoiceLanguage,
      clearDisplayLanguage,
      clearVoiceLanguage,
      updateSelectedLanguages,
      handleSearch,
      handlePageChange,
      handleExport
    };
  }
});
</script>