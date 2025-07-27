<template>
  <Layout pageTitle="Languages">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Languages</h2>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Add Language
      </button>
    </div>

    <div v-if="languages.length === 0" class="text-center py-8 text-gray-500">
      No languages found
    </div>

    <div v-else class="grid gap-4">
      <div v-for="language in languages" :key="language.id" class="border rounded-lg p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium">{{ language.title }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ language.code }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="editLanguage(language)" class="text-primary-600 hover:text-primary-900 text-sm">Edit</button>
            <button @click="deleteLanguage(language.id)" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
          </div>
        </div>
      </div>
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