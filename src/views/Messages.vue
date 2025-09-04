<template>
  <Layout pageTitle="Messages">
    <div class="space-y-6">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 class="text-xl font-semibold">Messages</h2>
          <p class="text-gray-500 mt-1">Manage system and coach messages</p>
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
              placeholder="Search messages..." 
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Message
          </button>
        </div>
      </div>

      <!-- Messages Table -->
      <div class="card p-0 overflow-hidden">
        <table class="table-modern">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Type</th>
              <th>Status</th>
              <th>Channels</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p class="mt-2 text-gray-500">Loading messages...</p>
              </td>
            </tr>
            <tr v-else-if="error">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="text-red-500 flex flex-col items-center">
                  <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="mt-2">{{ error }}</p>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredMessages.length === 0">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="text-gray-500 flex flex-col items-center">
                  <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p class="mt-2">No messages found</p>
                </div>
              </td>
            </tr>
            <tr v-for="message in filteredMessages" :key="message.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td>
                <div class="font-medium text-gray-900">{{ message.subject }}</div>
                <div class="text-sm text-gray-500">{{ truncate(message.text, 60) }}</div>
              </td>
              <td>
                <span class="badge badge-secondary">
                  {{ message.type || 'system' }}
                </span>
              </td>
              <td>
                <span :class="message.status === 'published' ? 'badge-success' : 'badge-warning'" class="badge">
                  {{ message.status }}
                </span>
              </td>
              <td class="text-sm text-gray-500">
                {{ message.channels?.join(', ') || 'app' }}
              </td>
              <td class="text-sm text-gray-500">
                {{ formatDate(message.createdAt) }}
              </td>
              <td>
                <div class="flex items-center space-x-1">
                  <router-link :to="`/messages/${message.id}`" 
                               class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <button @click="editMessage(message)" 
                          class="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button v-if="message.status === 'draft'" 
                          @click="publishMessage(message.id)" 
                          class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Publish">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showEditModal ? 'Edit Message' : 'Create Message' }}
            </h3>
            
            <form @submit.prevent="showEditModal ? updateMessage() : createMessage()">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Subject</label>
                  <input v-model="formData.subject" type="text" class="input mt-1" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <textarea v-model="formData.text" rows="4" class="input mt-1" required></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">From</label>
                  <input v-model="formData.from" type="text" class="input mt-1" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select v-model="formData.type" class="input mt-1" required>
                    <option value="system">System</option>
                    <option value="coach">Coach</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Countries</label>
                  <div class="mt-1 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                    <label v-for="country in countries" :key="country.code" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :value="country.code" 
                        v-model="formData.countryCodes"
                        class="mr-2"
                      >
                      {{ country.name }}
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Channels</label>
                  <div class="mt-1 space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox" value="app" v-model="formData.channels" class="mr-2" disabled checked>
                      App (Always included)
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" value="WhatsApp" v-model="formData.channels" class="mr-2">
                      WhatsApp
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select v-model="formData.status" class="input mt-1" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="closeModal" class="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="formSubmitting">
                  {{ showEditModal ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'Messages',
  components: { Layout },
  setup() {
    const messages = ref<any[]>([]);
    const countries = ref<any[]>([]);
    const searchQuery = ref('');
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const formSubmitting = ref(false);
    const formData = ref<any>({
      subject: '',
      text: '',
      from: '',
      type: 'system',
      channels: ['app'],
      countryCodes: [],
      status: 'draft'
    });

    const filteredMessages = computed(() => {
      if (!messages.value) return [];
      if (!searchQuery.value) return messages.value;
      
      const query = searchQuery.value.toLowerCase();
      return messages.value.filter(message => 
        message.subject.toLowerCase().includes(query) || 
        message.text.toLowerCase().includes(query) ||
        (message.type?.toLowerCase().includes(query)) ||
        (message.status?.toLowerCase().includes(query))
      );
    });

    const loadMessages = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        const response = await api.get('/messages');
        messages.value = response.data;
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to load messages';
        console.error('Failed to load messages:', err);
      } finally {
        isLoading.value = false;
      }
    };
    
    const truncate = (text: string, length: number) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    const loadCountries = async () => {
      try {
        const response = await api.get('/countries');
        countries.value = response.data;
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };

    const createMessage = async () => {
      formSubmitting.value = true;
      try {
        await api.post('/messages', formData.value);
        await loadMessages();
        closeModal();
      } catch (error) {
        console.error('Failed to create message:', error);
      } finally {
        formSubmitting.value = false;
      }
    };

    const editMessage = (message: any) => {
      formData.value = { ...message };
      showEditModal.value = true;
    };

    const updateMessage = async () => {
      formSubmitting.value = true;
      try {
        await api.patch(`/messages/${formData.value.id}`, formData.value);
        await loadMessages();
        closeModal();
      } catch (error) {
        console.error('Failed to update message:', error);
      } finally {
        formSubmitting.value = false;
      }
    };

    const publishMessage = async (id: string) => {
      try {
        await api.post(`/messages/${id}/publish`);
        await loadMessages();
      } catch (error) {
        console.error('Failed to publish message:', error);
      }
    };

    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      formData.value = {
        id: undefined,
        subject: '',
        text: '',
        from: '',
        type: 'system',
        channels: ['app'],
        countryCodes: [],
        status: 'draft'
      };
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      loadMessages();
      loadCountries();
    });

    return {
      messages,
      countries,
      searchQuery,
      isLoading,
      error,
      filteredMessages,
      showCreateModal,
      showEditModal,
      formSubmitting,
      formData,
      createMessage,
      editMessage,
      updateMessage,
      publishMessage,
      closeModal,
      formatDate,
      truncate
    };
  }
});
</script>