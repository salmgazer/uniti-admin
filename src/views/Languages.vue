<template>
  <Layout pageTitle="Languages">
    <DataTable
      title="Languages"
      :data="languages?.data || []"
      :loading="isLoading"
      :error="error"
      :pagination="languages"
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
          Add Language
        </button>
      </template>
      
      <template #cell-actions="{ item }">
        <div class="flex items-center space-x-1">
          <button 
            @click="editLanguage(item)" 
            class="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors" 
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            @click="confirmDelete(item)" 
            class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Language' : 'Create Language' }}
        </h3>
        
        <form @submit.prevent="showEditModal ? updateLanguage() : createLanguage()">
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
              <label for="code" class="block text-sm font-medium text-gray-700">Code</label>
              <input 
                id="code" 
                v-model="formData.code" 
                type="text" 
                required 
                class="input mt-1"
                placeholder="e.g. en, es, fr"
              />
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
          Are you sure you want to delete the language "{{ languageToDelete?.title }}"? This action cannot be undone.
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
            @click="deleteLanguage" 
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
import { api, PaginatedResponse } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable from '@/components/DataTable.vue';

export default defineComponent({
  name: 'Languages',
  components: {
    Layout,
    DataTable
  },
  setup() {
    const currentPage = ref(1);
    const searchQuery = ref('');
    const isExporting = ref(false);
    
    const { data: languages, error, isValidating: isLoading, mutate } = swrv<PaginatedResponse<any>>(
      () => `/languages?page=${currentPage.value}&limit=10&search=${searchQuery.value}`,
      (url) => api.get(url).then(res => res.data)
    );
    
    const columns = [
      { key: 'title', label: 'Title' },
      { key: 'code', label: 'Code' },
      { key: 'actions', label: 'Actions' }
    ];
    
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const formSubmitting = ref(false);
    const languageToDelete = ref<any | null>(null);
    
    const formData = reactive({
      id: '',
      title: '',
      code: ''
    });
    

    
    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      formData.id = '';
      formData.title = '';
      formData.code = '';
    };
    
    const createLanguage = async () => {
      try {
        formSubmitting.value = true;
        await api.post('/languages', {
          title: formData.title,
          code: formData.code
        });
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to create language:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const editLanguage = (language: any) => {
      formData.id = language.id;
      formData.title = language.title;
      formData.code = language.code;
      showEditModal.value = true;
    };
    
    const updateLanguage = async () => {
      try {
        formSubmitting.value = true;
        await api.patch(`/languages/${formData.id}`, {
          title: formData.title,
          code: formData.code
        });
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to update language:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDelete = (language: any) => {
      languageToDelete.value = language;
      showDeleteModal.value = true;
    };
    
    const deleteLanguage = async () => {
      if (!languageToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(`/languages/${languageToDelete.value.id}`);
        
        await mutate();
        showDeleteModal.value = false;
        languageToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete language:', err);
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
        
        const response = await api.get(`/languages/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'languages.xlsx' : 'languages.csv';
        
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
      languages,
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
      languageToDelete,
      closeModal,
      createLanguage,
      editLanguage,
      updateLanguage,
      confirmDelete,
      deleteLanguage,
      handleSearch,
      handlePageChange,
      handleExport
    };
  }
});
</script>