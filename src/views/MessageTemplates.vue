<template>
  <Layout pageTitle="Message Templates">
    <div class="mb-8">
      <div>
        <h2 class="text-xl font-semibold">Message Templates</h2>
        <p class="text-gray-500 mt-1">Create and manage reusable message templates</p>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="templatesData?.data || []"
      :pagination="templatesData ? { page: templatesData.page, limit: templatesData.limit, total: templatesData.total, totalPages: templatesData.totalPages, hasNext: templatesData.hasNext, hasPrev: templatesData.hasPrev } : undefined"
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
      <template #actions>
        <router-link to="/message-templates/create" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Template
        </router-link>
      </template>
      <template #cell-title="{ item }">
        <div>
          <div class="font-medium text-gray-900">{{ item.title }}</div>
          <div class="text-sm text-gray-500">{{ truncate(item.content, 60) }}</div>
        </div>
      </template>
      
      <template #cell-category="{ item }">
        <span class="badge badge-secondary">
          {{ item.category || 'General' }}
        </span>
      </template>
      
      <template #cell-languages="{ item }">
        <span class="text-sm text-gray-500">
          EN{{ item.translations ? ` +${Object.keys(item.translations).length}` : '' }}
        </span>
      </template>
      
      <template #cell-status="{ item }">
        <span :class="item.isActive ? 'badge-success' : 'badge-warning'" class="badge">
          {{ item.isActive ? 'Active' : 'Inactive' }}
        </span>
      </template>
      
      <template #cell-actions="{ item }">
        <div class="flex items-center space-x-1">
          <button @click="viewDetails(item)" 
                  class="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="View Details">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <router-link :to="`/message-templates/${item.id}/edit`" 
                       class="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </router-link>
          <button @click="sendTemplate(item)" 
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Send">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
          <button @click="confirmDelete(item)" 
                  class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Send Template Modal -->
    <div v-if="showSendModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Send Template Message</h3>
          
          <form @submit.prevent="sendTemplateMessage()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Select Users <span class="text-red-500">*</span></label>
                
                <!-- Selected Users -->
                <div v-if="selectedUsers.length > 0" class="mt-2 p-3 bg-gray-50 rounded-lg border max-h-48 overflow-y-auto">
                  <div class="text-sm font-medium text-gray-700 mb-2">Selected Users ({{ selectedUsers.length }})</div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="user in selectedUsers" :key="user.id" 
                          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <div class="flex flex-col items-start">
                        <span class="font-medium">{{ user.name || 'Unnamed User' }}</span>
                        <span class="text-xs text-blue-600">{{ user.phoneNumber }}</span>
                      </div>
                      <button @click="removeUser(user.id)" class="ml-2 text-blue-600 hover:text-blue-800">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>
                
                <!-- User Search Dropdown -->
                <div class="relative mt-2">
                  <input 
                    v-model="userSearch" 
                    @input="handleUserSearch"
                    @focus="showUserDropdown = true"
                    @blur="handleBlur"
                    type="text" 
                    placeholder="Search users by name or phone..."
                    class="input w-full"
                  />
                  
                  <div v-if="showUserDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div v-if="usersLoading" class="px-3 py-2 text-sm text-gray-500 flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                    <div v-else-if="filteredUsers.length === 0" class="px-3 py-2 text-sm text-gray-500">
                      {{ userSearch ? 'No users found' : 'Type to search users' }}
                    </div>
                    <div v-else>
                      <div v-for="user in filteredUsers" :key="user.id" 
                           @click="toggleUser(user.id)"
                           class="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                        <div>
                          <div class="font-medium text-sm">{{ user.name || 'Unnamed User' }}</div>
                          <div class="text-xs text-gray-500">{{ user.phoneNumber }}</div>
                        </div>
                        <div v-if="sendData.userIds.includes(user.id)" class="text-blue-600">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">Placeholders</label>
                  <button type="button" @click="addPlaceholder" class="text-sm text-primary-600 hover:text-primary-800">
                    + Add Placeholder
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="(placeholder, index) in sendData.placeholders" :key="index" class="flex items-center space-x-2">
                    <input 
                      v-model="placeholder.key" 
                      type="text" 
                      placeholder="Key (e.g., primary_goal)"
                      class="input flex-1"
                    />
                    <input 
                      v-model="placeholder.value" 
                      type="text" 
                      placeholder="Value (e.g., Health)"
                      class="input flex-1"
                    />
                    <button 
                      type="button" 
                      @click="removePlaceholder(index)" 
                      :disabled="sendData.placeholders.length === 1"
                      class="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="showSendModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="formSubmitting || sendData.userIds.length === 0">
                <svg v-if="formSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ formSubmitting ? 'Sending...' : `Send to ${sendData.userIds.length} user${sendData.userIds.length !== 1 ? 's' : ''}` }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Template Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">Template Details</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="templateToView" class="space-y-6">
            <!-- Template ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Template ID</label>
              <div class="flex items-center space-x-2">
                <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-mono flex-1">{{ templateToView.id }}</p>
                <button @click="copyToClipboard(templateToView.id)" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Copy ID">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{{ templateToView.title }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{{ templateToView.category || 'General' }}</p>
              </div>
            </div>
            
            <!-- Subject -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{{ templateToView.subject }}</p>
            </div>
            
            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{{ templateToView.content }}</div>
            </div>
            
            <!-- Placeholders -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Available Placeholders</label>
              <div v-if="extractPlaceholders(templateToView).length > 0" class="flex flex-wrap gap-2">
                <span v-for="placeholder in extractPlaceholders(templateToView)" :key="placeholder" 
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {{ placeholder }}
                </span>
              </div>
              <p v-else class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">No placeholders found in this template</p>
            </div>
            
            <!-- Translations -->
            <div v-if="templateToView.translations && Object.keys(templateToView.translations).length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Translations</label>
              <div class="space-y-3">
                <div v-for="(translation, lang) in templateToView.translations" :key="lang" class="border rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">{{ lang.toUpperCase() }}</span>
                  </div>
                  <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ translation }}</div>
                </div>
              </div>
            </div>
            
            <!-- Subject Translations -->
            <div v-if="templateToView.subjectTranslations && Object.keys(templateToView.subjectTranslations).length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject Translations</label>
              <div class="space-y-2">
                <div v-for="(translation, lang) in templateToView.subjectTranslations" :key="lang" class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-700 w-12">{{ lang.toUpperCase() }}:</span>
                  <span class="text-sm text-gray-900">{{ translation }}</span>
                </div>
              </div>
            </div>
            
            <!-- Media URLs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Video URLs -->
              <div v-if="templateToView.videoUrls && Object.keys(templateToView.videoUrls).length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">Video URLs</label>
                <div class="space-y-2">
                  <div v-for="(url, lang) in templateToView.videoUrls" :key="lang" class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-700 w-12">{{ lang.toUpperCase() }}:</span>
                    <a :href="url" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 truncate">{{ url }}</a>
                  </div>
                </div>
              </div>
              
              <!-- Audio URLs -->
              <div v-if="templateToView.audioUrls && Object.keys(templateToView.audioUrls).length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">Audio URLs</label>
                <div class="space-y-2">
                  <div v-for="(url, lang) in templateToView.audioUrls" :key="lang" class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-700 w-12">{{ lang.toUpperCase() }}:</span>
                    <a :href="url" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 truncate">{{ url }}</a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status and Metadata -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span :class="templateToView.isActive ? 'badge-success' : 'badge-warning'" class="badge">
                  {{ templateToView.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                <p class="text-sm text-gray-900">{{ new Date(templateToView.createdAt).toLocaleString() }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Updated At</label>
                <p class="text-sm text-gray-900">{{ new Date(templateToView.updatedAt).toLocaleString() }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showDetailsModal = false" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete "{{ templateToDelete?.title }}"?
        </p>
        
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="deleteTemplate" class="btn bg-red-600 text-white hover:bg-red-700" :disabled="formSubmitting">
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
import { api, endpoints, MessageTemplate, PaginatedResponse } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable, { Column } from '@/components/DataTable.vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
  name: 'MessageTemplates',
  components: { Layout, DataTable },
  setup() {
    const { success, error: showError } = useToast();
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchQuery = ref('');
    const isExporting = ref(false);
    const showSendModal = ref(false);
    const showDeleteModal = ref(false);
    const showDetailsModal = ref(false);
    const templateToView = ref<MessageTemplate | null>(null);
    const formSubmitting = ref(false);
    const templateToDelete = ref<MessageTemplate | null>(null);
    const templateToSend = ref<MessageTemplate | null>(null);
    
    const sendData = reactive({
      userIds: [] as string[],
      placeholders: [{ key: '', value: '' }] as { key: string; value: string }[]
    });
    
    const users = ref<any[]>([]);
    const selectedUserObjects = ref<any[]>([]);
    const userSearch = ref('');
    const showUserDropdown = ref(false);
    const usersLoading = ref(false);
    const searchTimeout = ref<NodeJS.Timeout | null>(null);
    
    const columns: Column[] = [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'languages', label: 'Languages' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ];

    const templatesUrl = computed(() => {
      const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: pageSize.value.toString()
      });
      if (searchQuery.value) {
        params.append('search', searchQuery.value);
      }
      return `${endpoints.messageTemplates}?${params.toString()}`;
    });

    const { data: templatesData, error, isValidating: isLoading, mutate } = swrv<PaginatedResponse<MessageTemplate>>(
      templatesUrl,
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
        const response = await api.get(`${endpoints.messageTemplates}/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'message-templates.xlsx' : 'message-templates.csv';
        
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
    
    const confirmDelete = (template: MessageTemplate) => {
      templateToDelete.value = template;
      showDeleteModal.value = true;
    };
    
    const deleteTemplate = async () => {
      if (!templateToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(endpoints.messageTemplate(templateToDelete.value.id));
        await mutate();
        showDeleteModal.value = false;
        templateToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete template:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const fetchUsers = async (search?: string) => {
      try {
        usersLoading.value = true;
        const params = new URLSearchParams({
          page: '1',
          limit: '50'
        });
        if (search) {
          params.append('search', search);
        }
        const response = await api.get(`${endpoints.users}?${params.toString()}`);
        users.value = response.data.data || response.data;
      } catch (err) {
        console.error('Failed to fetch users:', err);
        users.value = [];
      } finally {
        usersLoading.value = false;
      }
    };
    
    const viewDetails = (template: MessageTemplate) => {
      templateToView.value = template;
      showDetailsModal.value = true;
    };
    
    const sendTemplate = (template: MessageTemplate) => {
      templateToSend.value = template;
      sendData.userIds = [];
      sendData.placeholders = [{ key: '', value: '' }];
      selectedUserObjects.value = [];
      userSearch.value = '';
      users.value = [];
      showSendModal.value = true;
    };
    
    const toggleUser = (userId: string) => {
      const index = sendData.userIds.indexOf(userId);
      if (index > -1) {
        sendData.userIds.splice(index, 1);
        const objIndex = selectedUserObjects.value.findIndex(u => u.id === userId);
        if (objIndex > -1) {
          selectedUserObjects.value.splice(objIndex, 1);
        }
      } else {
        sendData.userIds.push(userId);
        const user = users.value.find(u => u.id === userId);
        if (user) {
          selectedUserObjects.value.push(user);
        }
      }
      userSearch.value = '';
      showUserDropdown.value = false;
    };
    
    const removeUser = (userId: string) => {
      const index = sendData.userIds.indexOf(userId);
      if (index > -1) {
        sendData.userIds.splice(index, 1);
      }
      const objIndex = selectedUserObjects.value.findIndex(u => u.id === userId);
      if (objIndex > -1) {
        selectedUserObjects.value.splice(objIndex, 1);
      }
    };
    
    const filteredUsers = computed(() => {
      return users.value;
    });
    
    const selectedUsers = computed(() => {
      return selectedUserObjects.value;
    });
    
    const addPlaceholder = () => {
      sendData.placeholders.push({ key: '', value: '' });
    };
    
    const removePlaceholder = (index: number) => {
      if (sendData.placeholders.length > 1) {
        sendData.placeholders.splice(index, 1);
      }
    };
    
    const sendTemplateMessage = async () => {
      if (!templateToSend.value) return;
      
      try {
        formSubmitting.value = true;
        const userIds = sendData.userIds;
        const placeholders = sendData.placeholders.reduce((acc, item) => {
          if (item.key && item.value) {
            acc[item.key] = item.value;
          }
          return acc;
        }, {} as Record<string, string>);
        
        await api.post(endpoints.sendTemplateMessage, {
          templateId: templateToSend.value.id,
          userIds,
          placeholders
        });
        
        showSendModal.value = false;
        templateToSend.value = null;
        success('Messages sent successfully!', `Template message sent to ${userIds.length} user${userIds.length !== 1 ? 's' : ''}`);
      } catch (err) {
        console.error('Failed to send template message:', err);
        showError('Failed to send messages', 'Please try again later');
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const truncate = (text: string, length: number) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
    };
    
    const handleUserSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      searchTimeout.value = setTimeout(() => {
        fetchUsers(userSearch.value);
      }, 300);
    };
    
    const handleBlur = () => {
      setTimeout(() => showUserDropdown.value = false, 200);
    };
    
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        success('Copied!', 'Template ID copied to clipboard');
      } catch (err) {
        console.error('Failed to copy:', err);
        showError('Copy failed', 'Unable to copy to clipboard');
      }
    };
    
    const extractPlaceholders = (template: MessageTemplate) => {
      const placeholders = new Set<string>();
      
      const extractFromText = (text: string) => {
        const regex = /\{\s*([^}]+)\s*\}/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          placeholders.add(match[1].trim());
        }
      };
      
      // Extract from subject
      if (template.subject) {
        extractFromText(template.subject);
      }
      
      // Extract from content
      if (template.content) {
        extractFromText(template.content);
      }
      
      // Extract from translations
      if (template.translations) {
        Object.values(template.translations).forEach(translation => {
          if (typeof translation === 'string') {
            extractFromText(translation);
          }
        });
      }
      
      // Extract from subject translations
      if (template.subjectTranslations) {
        Object.values(template.subjectTranslations).forEach(translation => {
          if (typeof translation === 'string') {
            extractFromText(translation);
          }
        });
      }
      
      return Array.from(placeholders).sort();
    };
    
    return {
      columns,
      templatesData,
      error,
      isLoading,
      searchQuery,
      isExporting,
      showSendModal,
      showDeleteModal,
      showDetailsModal,
      templateToView,
      sendData,
      formSubmitting,
      templateToDelete,
      users,
      userSearch,
      showUserDropdown,
      usersLoading,
      filteredUsers,
      selectedUsers,
      addPlaceholder,
      removePlaceholder,
      handleUserSearch,
      handlePageChange,
      handleSearch,
      handleExport,
      viewDetails,
      confirmDelete,
      deleteTemplate,
      sendTemplate,
      sendTemplateMessage,
      toggleUser,
      removeUser,
      truncate,
      handleBlur,
      extractPlaceholders,
      copyToClipboard
    };
  }
});
</script>