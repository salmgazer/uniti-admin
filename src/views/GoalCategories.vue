<template>
  <Layout pageTitle="Goal Categories">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">Goal Category Management</h2>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Add Category
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Loading categories...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-red-500">{{ error }}</td>
          </tr>
          <tr v-else-if="!categories || categories.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No categories found</td>
          </tr>
          <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex-shrink-0 h-10 w-10">
                <img v-if="category.iconUrl" :src="category.iconUrl" class="h-10 w-10 rounded-full" alt="" />
                <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {{ category.name.charAt(0).toUpperCase() }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.order }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <router-link :to="`/goal-categories/${category.id}`" class="text-blue-600 hover:text-blue-900 mr-3">View</router-link>
              <button @click="editCategory(category)" class="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
              <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
              {{ showEditModal ? 'Update' : 'Create' }}
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
            Delete
          </button>
        </div>
      </div>
    </div>


  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import swrv from 'swrv';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

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
    Layout
  },
  setup() {
    const { data: categories, error, isValidating: isLoading, mutate } = swrv<GoalCategory[]>(
      '/goal-categories',
      () => api.get('/goal-categories').then(res => res.data)
    );
    
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
      categories,
      error,
      isLoading,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      categoryToDelete,
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