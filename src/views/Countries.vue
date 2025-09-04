<template>
  <Layout pageTitle="Countries">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">Country Management</h2>
      <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Country
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">Loading countries...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">{{ error }}</td>
          </tr>
          <tr v-else-if="!countries || countries.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No countries found</td>
          </tr>
          <tr v-for="country in countries" :key="country.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex-shrink-0 h-10 w-16">
                <img v-if="country.flagUrl" :src="country.flagUrl" class="h-10 w-16 object-cover rounded" alt="" />
                <div v-else class="h-10 w-16 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                  {{ country.code }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ country.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ country.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="editCountry(country)" class="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
              <button @click="confirmDelete(country)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Country' : 'Create Country' }}
        </h3>
        
        <form @submit.prevent="showEditModal ? updateCountry() : createCountry()">
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
              <div class="mt-1 h-16 w-24 border rounded">
                <img :src="formData.flagUrl" class="h-full w-full object-cover" alt="Flag preview" />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Languages</label>
              <div class="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                <label v-for="language in languages" :key="language.id" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="language.id" 
                    v-model="formData.languageIds" 
                    class="mr-2"
                  />
                  <span class="text-sm">{{ language.title }} ({{ language.code }})</span>
                </label>
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
import { api, Country } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'Countries',
  components: {
    Layout
  },
  setup() {
    const { data: countries, error, isValidating: isLoading, mutate } = swrv<Country[]>(
      '/countries',
      () => api.get('/countries').then(res => res.data)
    );
    
    const { data: languages } = swrv<any[]>(
      '/languages',
      () => api.get('/languages').then(res => res.data)
    );
    
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
      languageIds: [] as string[]
    });
    
    const resetForm = () => {
      formData.id = '';
      formData.code = '';
      formData.name = '';
      formData.flagUrl = '';
      formData.languageIds = [];
    };
    
    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      resetForm();
    };
    
    const editCountry = (country: Country) => {
      formData.id = country.id;
      formData.code = country.code;
      formData.name = country.name;
      formData.flagUrl = country.flagUrl || '';
      formData.languageIds = country.languages?.map(l => l.id) || [];
      showEditModal.value = true;
    };
    
    const createCountry = async () => {
      try {
        formSubmitting.value = true;
        const country = await api.post('/countries', {
          code: formData.code.toUpperCase(),
          name: formData.name,
          flagUrl: formData.flagUrl || null
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
          flagUrl: formData.flagUrl || null
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
    
    return {
      countries,
      languages,
      error,
      isLoading,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      countryToDelete,
      closeModal,
      editCountry,
      createCountry,
      updateCountry,
      confirmDelete,
      deleteCountry
    };
  }
});
</script>