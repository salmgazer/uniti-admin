<template>
  <Layout pageTitle="Goal Categories">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">Goal Category Management</h2>
      <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Category
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="categoriesData?.data || []"
      :pagination="categoriesData ? { page: categoriesData.page, limit: categoriesData.limit, total: categoriesData.total, totalPages: categoriesData.totalPages, hasNext: categoriesData.hasNext, hasPrev: categoriesData.hasPrev } : undefined"
      :is-loading="isLoading"
      :error="error"
      :show-search="true"
      :show-export="true"
      :search-value="searchQuery"
      :is-exporting="isExporting"
      @page-change="handlePageChange"
      @search="handleSearch"
      @export="handleExport"
    >
      <template #cell-icon="{ item }">
        <div class="flex-shrink-0 h-10 w-10">
          <img v-if="item.iconUrl" :src="item.iconUrl" class="h-10 w-10 rounded-full" alt="" />
          <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {{ item.name.charAt(0).toUpperCase() }}
          </div>
        </div>
      </template>
      
      <template #cell-name="{ item }">
        <span class="text-sm font-medium text-gray-900">{{ item.name }}</span>
      </template>
      
      <template #cell-description="{ item }">
        <span class="text-sm text-gray-500">{{ item.description || '-' }}</span>
      </template>
      
      <template #cell-order="{ item }">
        <span class="text-sm text-gray-500">{{ item.order }}</span>
      </template>
      
      <template #cell-actions="{ item }">
        <div class="flex items-center space-x-1">
          <router-link :to="`/goal-categories/${item.id}`" 
                       class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </router-link>
          <button @click="editCategory(item)" 
                  :disabled="formSubmitting"
                  class="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button @click="confirmDelete(item)" 
                  :disabled="formSubmitting"
                  class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Delete">
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
          {{ showEditModal ? 'Edit Goal Category' : 'Create Goal Category' }}
        </h3>
        
        <form @submit.prevent="showEditModal ? updateCategory() : createCategory()">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                id="name" 
                v-model="formData.name" 
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
              <label for="iconUrl" class="block text-sm font-medium text-gray-700">Icon URL</label>
              <input 
                id="iconUrl" 
                v-model="formData.iconUrl" 
                type="text" 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="order" class="block text-sm font-medium text-gray-700">Display Order</label>
              <input 
                id="order" 
                v-model.number="formData.order" 
                type="number" 
                min="0" 
                class="input mt-1"
              />
            </div>
            
            <div v-if="formData.iconUrl" class="mt-2">
              <p class="text-sm font-medium text-gray-700">Icon Preview</p>
              <div class="mt-1 h-16 w-16 border rounded">
                <img :src="formData.iconUrl" class="h-full w-full object-cover" alt="Icon preview" />
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
          Are you sure you want to delete the category "{{ categoryToDelete?.name }}"? This action cannot be undone.
        </p>
        <p class="text-sm text-red-500 mb-4">
          Note: Categories with associated goals cannot be deleted.
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
            @click="deleteCategory" 
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
import { defineComponent, ref, reactive, computed } from 'vue';
import swrv from 'swrv';
import { api, PaginatedResponse } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable, { Column } from '@/components/DataTable.vue';

interface GoalCategory {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default defineComponent({
  name: 'GoalCategories',
  components: {
    Layout,
    DataTable
  },
  setup() {
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchQuery = ref('');
    const isExporting = ref(false);

    const columns: Column[] = [
      { key: 'icon', label: 'Icon' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'order', label: 'Order' },
      { key: 'actions', label: 'Actions' }
    ];

    const categoriesUrl = computed(() => {
      const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: pageSize.value.toString()
      });
      if (searchQuery.value) {
        params.append('search', searchQuery.value);
      }
      return `/goal-categories?${params.toString()}`;
    });

    const { data: categoriesData, error, isValidating: isLoading, mutate } = swrv<PaginatedResponse<GoalCategory>>(
      categoriesUrl,
      (url) => api.get(url).then(res => res.data)
    );

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const handleSearch = (query: string) => {
      searchQuery.value = query;
      currentPage.value = 1;
    };

    const handleExport = async (format: 'csv' | 'excel') => {
      try {
        isExporting.value = true;
        const params = new URLSearchParams({ format });
        if (searchQuery.value) {
          params.append('search', searchQuery.value);
        }
        const response = await api.get(`/goal-categories/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'goal-categories.xlsx' : 'goal-categories.csv';
        
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
    
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const formSubmitting = ref(false);
    const categoryToDelete = ref<GoalCategory | null>(null);
    
    const formData = reactive({
      id: '',
      name: '',
      description: '',
      iconUrl: '',
      order: 0
    });
    
    const resetForm = () => {
      formData.id = '';
      formData.name = '';
      formData.description = '';
      formData.iconUrl = '';
      formData.order = 0;
    };
    
    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      resetForm();
    };
    
    const editCategory = (category: GoalCategory) => {
      formData.id = category.id;
      formData.name = category.name;
      formData.description = category.description || '';
      formData.iconUrl = category.iconUrl || '';
      formData.order = category.order;
      showEditModal.value = true;
    };
    
    const createCategory = async () => {
      try {
        formSubmitting.value = true;
        await api.post('/goal-categories', {
          name: formData.name,
          description: formData.description || null,
          iconUrl: formData.iconUrl || null,
          order: formData.order
        });
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to create category:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const updateCategory = async () => {
      try {
        formSubmitting.value = true;
        await api.patch(`/goal-categories/${formData.id}`, {
          name: formData.name,
          description: formData.description || null,
          iconUrl: formData.iconUrl || null,
          order: formData.order
        });
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to update category:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDelete = (category: GoalCategory) => {
      categoryToDelete.value = category;
      showDeleteModal.value = true;
    };
    
    const deleteCategory = async () => {
      if (!categoryToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(`/goal-categories/${categoryToDelete.value.id}`);
        
        await mutate();
        showDeleteModal.value = false;
        categoryToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete category:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    return {
      columns,
      categoriesData,
      error,
      isLoading,
      searchQuery,
      isExporting,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      categoryToDelete,
      handlePageChange,
      handleSearch,
      handleExport,
      closeModal,
      editCategory,
      createCategory,
      updateCategory,
      confirmDelete,
      deleteCategory
    };
  }
});
</script>