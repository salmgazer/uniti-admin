<template>
  <Layout pageTitle="Message Templates">
    <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 class="text-xl font-semibold">Message Templates</h2>
        <p class="text-gray-500 mt-1">Create and manage reusable message templates</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search templates..." 
            class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>
        <router-link to="/message-templates/create" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Template
        </router-link>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <table class="table-modern">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Languages</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="px-6 py-8 text-center">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
              <p class="mt-2 text-gray-500">Loading templates...</p>
            </td>
          </tr>
          <tr v-else-if="error">
            <td colspan="5" class="px-6 py-8 text-center">
              <div class="text-red-500 flex flex-col items-center">
                <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mt-2">{{ error }}</p>
              </div>
            </td>
          </tr>
          <tr v-else-if="templates.length === 0">
            <td colspan="5" class="px-6 py-8 text-center">
              <div class="text-gray-500 flex flex-col items-center">
                <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="mt-2">No templates found</p>
              </div>
            </td>
          </tr>
          <tr v-for="template in templates" :key="template.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td>
              <div class="font-medium text-gray-900">{{ template.title }}</div>
              <div class="text-sm text-gray-500">{{ truncate(template.content, 60) }}</div>
            </td>
            <td>
              <span class="badge badge-secondary">
                {{ template.category || 'General' }}
              </span>
            </td>
            <td class="text-sm text-gray-500">
              EN{{ template.translations ? ` +${Object.keys(template.translations).length}` : '' }}
            </td>
            <td>
              <span :class="template.isActive ? 'badge-success' : 'badge-warning'" class="badge">
                {{ template.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div class="flex items-center space-x-1">
                <router-link :to="`/message-templates/${template.id}/edit`" 
                             class="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </router-link>
                <button @click="sendTemplate(template)" 
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Send">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                <button @click="confirmDelete(template)" 
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

    <!-- Send Template Modal -->
    <div v-if="showSendModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Send Template Message</h3>
          
          <form @submit.prevent="sendTemplateMessage()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Select Users <span class="text-red-500">*</span></label>
                
                <!-- Selected Users -->
                <div v-if="selectedUsers.length > 0" class="mt-2 flex flex-wrap gap-2">
                  <span v-for="user in selectedUsers" :key="user.id" 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ user.name || user.phoneNumber }}
                    <button @click="removeUser(user.id)" class="ml-1 text-blue-600 hover:text-blue-800">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </span>
                </div>
                
                <!-- User Search Dropdown -->
                <div class="relative mt-2">
                  <input 
                    v-model="userSearch" 
                    @focus="showUserDropdown = true"
                    @blur="handleBlur"
                    type="text" 
                    placeholder="Search users..."
                    class="input w-full"
                  />
                  
                  <div v-if="showUserDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-sm text-gray-500">
                      No users found
                    </div>
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
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Placeholders (JSON)</label>
                <textarea v-model="sendData.placeholders" rows="3" class="input mt-1" 
                          placeholder='{"primary_goal": "Health"}'></textarea>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="showSendModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="formSubmitting || sendData.userIds.length === 0">
                Send to {{ sendData.userIds.length }} user{{ sendData.userIds.length !== 1 ? 's' : '' }}
              </button>
            </div>
          </form>
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
            Delete
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch, computed } from 'vue';
import { api, endpoints, MessageTemplate } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'MessageTemplates',
  components: { Layout },
  setup() {
    const searchQuery = ref('');
    const templates = ref<MessageTemplate[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const showSendModal = ref(false);
    const showDeleteModal = ref(false);
    const formSubmitting = ref(false);
    const templateToDelete = ref<MessageTemplate | null>(null);
    const templateToSend = ref<MessageTemplate | null>(null);
    
    const sendData = reactive({
      userIds: [] as string[],
      placeholders: ''
    });
    
    const users = ref<any[]>([]);
    const userSearch = ref('');
    const showUserDropdown = ref(false);
    
    const fetchTemplates = async (search?: string) => {
      try {
        isLoading.value = true;
        error.value = null;
        const params = search ? { search } : {};
        const response = await api.get(endpoints.messageTemplates, { params });
        templates.value = response.data;
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch templates';
      } finally {
        isLoading.value = false;
      }
    };
    
    // Debounced search
    let searchTimeout: NodeJS.Timeout;
    watch(searchQuery, (newQuery) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchTemplates(newQuery || undefined);
      }, 300);
    });
    
    onMounted(() => {
      fetchTemplates();
    });
    
    const confirmDelete = (template: MessageTemplate) => {
      templateToDelete.value = template;
      showDeleteModal.value = true;
    };
    
    const deleteTemplate = async () => {
      if (!templateToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(endpoints.messageTemplate(templateToDelete.value.id));
        await fetchTemplates(searchQuery.value || undefined);
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
        const params = search ? { search } : {};
        const response = await api.get(endpoints.users, { params });
        users.value = response.data;
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    
    const sendTemplate = (template: MessageTemplate) => {
      templateToSend.value = template;
      sendData.userIds = [];
      sendData.placeholders = '';
      fetchUsers();
      showSendModal.value = true;
    };
    
    const toggleUser = (userId: string) => {
      const index = sendData.userIds.indexOf(userId);
      if (index > -1) {
        sendData.userIds.splice(index, 1);
      } else {
        sendData.userIds.push(userId);
      }
      userSearch.value = '';
      showUserDropdown.value = false;
    };
    
    const removeUser = (userId: string) => {
      const index = sendData.userIds.indexOf(userId);
      if (index > -1) {
        sendData.userIds.splice(index, 1);
      }
    };
    
    const filteredUsers = computed(() => {
      if (!userSearch.value) return users.value;
      const query = userSearch.value.toLowerCase();
      return users.value.filter(user => 
        (user.name?.toLowerCase().includes(query)) ||
        user.phoneNumber.toLowerCase().includes(query)
      );
    });
    
    const selectedUsers = computed(() => {
      return users.value.filter(user => sendData.userIds.includes(user.id));
    });
    
    const sendTemplateMessage = async () => {
      if (!templateToSend.value) return;
      
      try {
        formSubmitting.value = true;
        const userIds = sendData.userIds;
        const placeholders = sendData.placeholders ? JSON.parse(sendData.placeholders) : {};
        
        await api.post(endpoints.sendTemplateMessage, {
          templateId: templateToSend.value.id,
          userIds,
          placeholders
        });
        
        showSendModal.value = false;
        templateToSend.value = null;
        alert('Messages sent successfully!');
      } catch (err) {
        console.error('Failed to send template message:', err);
        alert('Failed to send messages');
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const truncate = (text: string, length: number) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
    };
    
    const handleBlur = () => {
      setTimeout(() => showUserDropdown.value = false, 200);
    };
    
    return {
      templates,
      error,
      isLoading,
      searchQuery,
      showSendModal,
      showDeleteModal,
      sendData,
      formSubmitting,
      templateToDelete,
      users,
      userSearch,
      showUserDropdown,
      filteredUsers,
      selectedUsers,
      confirmDelete,
      deleteTemplate,
      sendTemplate,
      sendTemplateMessage,
      toggleUser,
      removeUser,
      truncate,
      handleBlur
    };
  }
});
</script>