<template>
  <Layout :pageTitle="`${category?.name || 'Category'} - Goals`">
    <div class="mb-6">
      <router-link to="/goal-categories" class="text-primary-600 hover:text-primary-900 mb-4 inline-block">
        ← Back to Categories
      </router-link>
      <h2 class="text-xl font-semibold">{{ category?.name }} - Goals</h2>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button 
          @click="activeTab = 'subcategories'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'subcategories' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Sub Categories ({{ subCategories.length }})
        </button>
        <button 
          @click="activeTab = 'goals'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'goals' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Goals ({{ goals.length }})
        </button>

      </nav>
    </div>

    <!-- Sub Categories Tab -->
    <div v-if="activeTab === 'subcategories'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Sub Categories</h3>
        <button @click="showCreateSubCategoryModal = true" class="btn btn-primary">
          Add Sub Category
        </button>
      </div>
      
      <div v-if="subCategories.length === 0" class="text-center py-8 text-gray-500">
        No sub categories found for this category
      </div>
      
      <div v-else class="grid gap-4">
        <div v-for="subCategory in subCategories" :key="subCategory.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">{{ subCategory.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ subCategory.description }}</p>
              <p class="text-xs text-gray-400 mt-1">{{goals.filter(g => g.goalSubCategoryId === subCategory.id).length || 0 }} goals</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editSubCategory(subCategory)" class="text-primary-600 hover:text-primary-900 text-sm">Edit</button>
              <button @click="deleteSubCategory(subCategory.id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Tab -->
    <div v-if="activeTab === 'goals'" class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Goals</h3>
        <button @click="showCreateGoalModal = true" class="btn btn-primary">
          Add Goal
        </button>
      </div>
      
      <div v-if="goals.length === 0" class="text-center py-8 text-gray-500">
        No goals found for this category
      </div>
      
      <div v-else class="grid gap-4">
        <div v-for="goal in goals" :key="goal.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">{{ goal.title }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ goal.goalSubCategory?.name || 'No sub category' }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editGoal(goal)" class="text-primary-600 hover:text-primary-900 text-sm">Edit</button>
              <button @click="deleteGoal(goal.id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
            </div>
          </div>
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
              {{ showEditGoalModal ? 'Update' : 'Create' }}
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
              {{ showEditSubCategoryModal ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
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
    const formSubmitting = ref(false);
    
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
    
    const deleteSubCategory = async (subCategoryId: string) => {
      if (!confirm('Are you sure you want to delete this sub category?')) return;
      
      try {
        await api.delete(`/goal-sub-categories/${subCategoryId}`);
        await loadSubCategories();
      } catch (err) {
        console.error('Failed to delete sub category:', err);
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
    
    const deleteGoal = async (goalId: string) => {
      if (!confirm('Are you sure you want to delete this goal?')) return;
      
      try {
        await api.delete(`/goals/${goalId}`);
        await loadGoals();
      } catch (err) {
        console.error('Failed to delete goal:', err);
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
      subCategoryFormData,
      goalFormData,
      formSubmitting,
      closeSubCategoryModal,
      closeGoalModal,
      createSubCategory,
      editSubCategory,
      updateSubCategory,
      deleteSubCategory,
      createGoal,
      editGoal,
      updateGoal,
      deleteGoal
    };
  }
});
</script>