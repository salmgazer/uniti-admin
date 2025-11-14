<template>
  <Layout :pageTitle="`${category?.name || 'Category'} - Goals`">
    <div class="mb-6">
      <router-link to="/goal-categories" class="text-primary-600 hover:text-primary-900 mb-4 inline-block">
        ← Back to Categories
      </router-link>
      <h2 class="text-xl font-semibold">{{ category?.name }} - Goals</h2>
    </div>

    <!-- Enhanced Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-0">
          <button 
            @click="activeTab = 'subcategories'"
            :class="[
              'flex-1 py-4 px-6 text-center font-semibold text-sm transition-all duration-200 relative',
              activeTab === 'subcategories' 
                ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-500' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
              </svg>
              <span>Sub Categories</span>
              <span class="ml-1 px-2 py-1 text-xs rounded-full" :class="activeTab === 'subcategories' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'">{{ subCategories.length }}</span>
            </div>
          </button>
          <button 
            @click="activeTab = 'goals'"
            :class="[
              'flex-1 py-4 px-6 text-center font-semibold text-sm transition-all duration-200 relative',
              activeTab === 'goals' 
                ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-500' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Goals</span>
              <span class="ml-1 px-2 py-1 text-xs rounded-full" :class="activeTab === 'goals' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'">{{ goals.length }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Sub Categories Tab Content -->
      <div v-if="activeTab === 'subcategories'" class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Sub Categories</h3>
          <button @click="showCreateSubCategoryModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Sub Category
          </button>
        </div>
        
        <div v-if="subCategories.length === 0" class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7" />
          </svg>
          <p class="text-lg font-medium">No sub categories found</p>
          <p class="text-sm">Get started by creating your first sub category</p>
        </div>
        
        <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals Count</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="subCategory in subCategories" :key="subCategory.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ subCategory.name }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500">{{ subCategory.description || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ goals.filter(g => g.goalSubCategoryId === subCategory.id).length || 0 }} goals
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="editSubCategory(subCategory)" :disabled="formSubmitting" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Edit">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="confirmDeleteSubCategory(subCategory)" :disabled="formSubmitting" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Delete">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Goals Tab Content -->
      <div v-if="activeTab === 'goals'" class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Goals</h3>
          <button @click="showCreateGoalModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Goal
          </button>
        </div>
        
        <div v-if="goals.length === 0" class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium">No goals found</p>
          <p class="text-sm">Get started by creating your first goal</p>
        </div>
        
        <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Text</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="goal in goals" :key="goal.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ goal.title }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500">{{ goal.displayText || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="goal.goalSubCategory" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ goal.goalSubCategory.name }}
                  </span>
                  <span v-else class="text-sm text-gray-400">No sub category</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="editGoal(goal)" :disabled="formSubmitting" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Edit">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="confirmDeleteGoal(goal)" :disabled="formSubmitting" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Delete">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    


    <!-- Create/Edit Goal Modal -->
    <div v-if="showCreateGoalModal || showEditGoalModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditGoalModal ? 'Edit Goal' : 'Create Goal' }}
        </h3>
        
        <form @submit.prevent="showEditGoalModal ? updateGoal() : createGoal()">
          <div class="space-y-4">
            <div>
              <label for="goalTitle" class="block text-sm font-medium text-gray-700">Title</label>
              <input 
                id="goalTitle" 
                v-model="goalFormData.title" 
                type="text" 
                required 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="goalDisplayText" class="block text-sm font-medium text-gray-700">Display Text</label>
              <textarea 
                id="goalDisplayText" 
                v-model="goalFormData.displayText" 
                rows="3" 
                class="input mt-1"
                placeholder="Optional display text for this goal"
              ></textarea>
            </div>
            
            <div>
              <label for="goalSubCategoryId" class="block text-sm font-medium text-gray-700">Sub Category</label>
              <select id="goalSubCategoryId" v-model="goalFormData.goalSubCategoryId" class="input mt-1">
                <option value="">No sub category</option>
                <option v-for="subCategory in subCategories" :key="subCategory.id" :value="subCategory.id">
                  {{ subCategory.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeGoalModal" 
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
              {{ formSubmitting ? (showEditGoalModal ? 'Updating...' : 'Creating...') : (showEditGoalModal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>



    <!-- Create/Edit Sub Category Modal -->
    <div v-if="showCreateSubCategoryModal || showEditSubCategoryModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditSubCategoryModal ? 'Edit Sub Category' : 'Create Sub Category' }}
        </h3>
        
        <form @submit.prevent="showEditSubCategoryModal ? updateSubCategory() : createSubCategory()">
          <div class="space-y-4">
            <div>
              <label for="subCategoryName" class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                id="subCategoryName" 
                v-model="subCategoryFormData.name" 
                type="text" 
                required 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="subCategoryDescription" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="subCategoryDescription" 
                v-model="subCategoryFormData.description" 
                rows="3" 
                class="input mt-1"
              ></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeSubCategoryModal" 
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
              {{ formSubmitting ? (showEditSubCategoryModal ? 'Updating...' : 'Creating...') : (showEditSubCategoryModal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Sub Category Confirmation Modal -->
    <div v-if="showDeleteSubCategoryModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete the sub-category "{{ subCategoryToDelete?.name }}"? This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="showDeleteSubCategoryModal = false" 
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="deleteSubCategory" 
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

    <!-- Delete Goal Confirmation Modal -->
    <div v-if="showDeleteGoalModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete the goal "{{ goalToDelete?.title }}"? This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="showDeleteGoalModal = false" 
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="deleteGoal" 
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
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'GoalCategoryDetail',
  components: {
    Layout
  },
  setup() {
    const route = useRoute();
    const categoryId = route.params.id as string;
    
    const category = ref<any>(null);
    const subCategories = ref<any[]>([]);
    const goals = ref<any[]>([]);
    const activeTab = ref('subcategories');
    
    const showCreateSubCategoryModal = ref(false);
    const showEditSubCategoryModal = ref(false);
    const showCreateGoalModal = ref(false);
    const showEditGoalModal = ref(false);
    const showDeleteSubCategoryModal = ref(false);
    const showDeleteGoalModal = ref(false);
    const formSubmitting = ref(false);
    const subCategoryToDelete = ref<any>(null);
    const goalToDelete = ref<any>(null);
    
    const subCategoryFormData = reactive({
      id: '',
      name: '',
      description: ''
    });
    
    const goalFormData = reactive({
      id: '',
      title: '',
      displayText: '',
      goalSubCategoryId: ''
    });
    
    const loadCategory = async () => {
      try {
        const response = await api.get(`/goal-categories/${categoryId}`);
        category.value = response.data;
      } catch (err) {
        console.error('Failed to load category:', err);
      }
    };
    
    const loadSubCategories = async () => {
      try {
        const response = await api.get(`/goal-sub-categories/category/${categoryId}`);
        subCategories.value = response.data;
      } catch (err) {
        console.error('Failed to load sub categories:', err);
      }
    };
    
    const loadGoals = async () => {
      try {
        const response = await api.get(`/goals/category/${categoryId}`);
        goals.value = response.data;
      } catch (err) {
        console.error('Failed to load goals:', err);
      }
    };
    

    
    const closeSubCategoryModal = () => {
      showCreateSubCategoryModal.value = false;
      showEditSubCategoryModal.value = false;
      subCategoryFormData.id = '';
      subCategoryFormData.name = '';
      subCategoryFormData.description = '';
    };
    
    const closeGoalModal = () => {
      showCreateGoalModal.value = false;
      showEditGoalModal.value = false;
      goalFormData.id = '';
      goalFormData.title = '';
      goalFormData.displayText = '';
      goalFormData.goalSubCategoryId = '';
    };
    
    const createSubCategory = async () => {
      try {
        formSubmitting.value = true;
        await api.post('/goal-sub-categories', {
          name: subCategoryFormData.name,
          description: subCategoryFormData.description,
          goalCategoryId: categoryId
        });
        
        await loadSubCategories();
        closeSubCategoryModal();
      } catch (err) {
        console.error('Failed to create sub category:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const editSubCategory = (subCategory: any) => {
      subCategoryFormData.id = subCategory.id;
      subCategoryFormData.name = subCategory.name;
      subCategoryFormData.description = subCategory.description || '';
      showEditSubCategoryModal.value = true;
    };
    
    const updateSubCategory = async () => {
      try {
        formSubmitting.value = true;
        await api.patch(`/goal-sub-categories/${subCategoryFormData.id}`, {
          name: subCategoryFormData.name,
          description: subCategoryFormData.description
        });
        
        await loadSubCategories();
        closeSubCategoryModal();
      } catch (err) {
        console.error('Failed to update sub category:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDeleteSubCategory = (subCategory: any) => {
      subCategoryToDelete.value = subCategory;
      showDeleteSubCategoryModal.value = true;
    };
    
    const deleteSubCategory = async () => {
      if (!subCategoryToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(`/goal-sub-categories/${subCategoryToDelete.value.id}`);
        await loadSubCategories();
        showDeleteSubCategoryModal.value = false;
        subCategoryToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete sub category:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const createGoal = async () => {
      try {
        formSubmitting.value = true;
        await api.post('/goals', {
          title: goalFormData.title,
          displayText: goalFormData.displayText || null,
          goalCategoryId: categoryId,
          goalSubCategoryId: goalFormData.goalSubCategoryId || null
        });
        
        await loadGoals();
        closeGoalModal();
      } catch (err) {
        console.error('Failed to create goal:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const editGoal = (goal: any) => {
      goalFormData.id = goal.id;
      goalFormData.title = goal.title;
      goalFormData.displayText = goal.displayText || '';
      goalFormData.goalSubCategoryId = goal.goalSubCategoryId || '';
      showEditGoalModal.value = true;
    };
    
    const updateGoal = async () => {
      try {
        formSubmitting.value = true;
        await api.patch(`/goals/${goalFormData.id}`, {
          title: goalFormData.title,
          displayText: goalFormData.displayText || null,
          goalSubCategoryId: goalFormData.goalSubCategoryId || null
        });
        
        await loadGoals();
        closeGoalModal();
      } catch (err) {
        console.error('Failed to update goal:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDeleteGoal = (goal: any) => {
      goalToDelete.value = goal;
      showDeleteGoalModal.value = true;
    };
    
    const deleteGoal = async () => {
      if (!goalToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(`/goals/${goalToDelete.value.id}`);
        await loadGoals();
        showDeleteGoalModal.value = false;
        goalToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete goal:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    

    
    onMounted(() => {
      loadCategory();
      loadSubCategories();
      loadGoals();
    });
    
    return {
      category,
      subCategories,
      goals,
      activeTab,
      showCreateSubCategoryModal,
      showEditSubCategoryModal,
      showCreateGoalModal,
      showEditGoalModal,
      showDeleteSubCategoryModal,
      showDeleteGoalModal,
      subCategoryFormData,
      goalFormData,
      formSubmitting,
      subCategoryToDelete,
      goalToDelete,
      closeSubCategoryModal,
      closeGoalModal,
      createSubCategory,
      editSubCategory,
      updateSubCategory,
      confirmDeleteSubCategory,
      deleteSubCategory,
      createGoal,
      editGoal,
      updateGoal,
      confirmDeleteGoal,
      deleteGoal
    };
  }
});
</script>