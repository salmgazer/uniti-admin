<template>
  <Layout pageTitle="Languages">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Languages</h2>
      <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Language
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="languages.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No languages found</td>
          </tr>
          <tr v-for="language in languages" :key="language.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ language.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ language.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-1">
                <button @click="editLanguage(language)" 
                        class="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="deleteLanguage(language.id)" 
                        class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
              {{ showEditModal ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'Languages',
  components: {
    Layout
  },
  setup() {
    const languages = ref<any[]>([]);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const formSubmitting = ref(false);
    
    const formData = reactive({
      id: '',
      title: '',
      code: ''
    });
    
    const loadLanguages = async () => {
      try {
        const response = await api.get('/languages');
        languages.value = response.data;
      } catch (err) {
        console.error('Failed to load languages:', err);
      }
    };
    

    
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
        
        await loadLanguages();
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
        
        await loadLanguages();
        closeModal();
      } catch (err) {
        console.error('Failed to update language:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const deleteLanguage = async (languageId: string) => {
      if (!confirm('Are you sure you want to delete this language?')) return;
      
      try {
        await api.delete(`/languages/${languageId}`);
        await loadLanguages();
      } catch (err) {
        console.error('Failed to delete language:', err);
      }
    };
    
    onMounted(() => {
      loadLanguages();
    });
    
    return {
      languages,
      showCreateModal,
      showEditModal,
      formData,
      formSubmitting,
      closeModal,
      createLanguage,
      editLanguage,
      updateLanguage,
      deleteLanguage
    };
  }
});
</script>