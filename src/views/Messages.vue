<template>
  <Layout pageTitle="Messages">
    <div class="space-y-6">
      <!-- Header -->
      <div class="mb-8">
        <div>
          <h2 class="text-xl font-semibold">Messages</h2>
          <p class="text-gray-500 mt-1">Manage system and coach messages</p>
        </div>
      </div>

      <DataTable
        :columns="columns"
        :data="messagesData?.data || []"
        :pagination="messagesData ? { page: messagesData.page, limit: messagesData.limit, total: messagesData.total, totalPages: messagesData.totalPages, hasNext: messagesData.hasNext, hasPrev: messagesData.hasPrev } : undefined"
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
        <template #cell-subject="{ item }">
          <div>
            <div class="font-medium text-gray-900">{{ item.subject }}</div>
            <div class="text-sm text-gray-500">{{ truncate(item.text, 60) }}</div>
          </div>
        </template>
        
        <template #cell-status="{ item }">
          <span :class="item.status === 'published' ? 'badge-success' : 'badge-warning'" class="badge">
            {{ item.status }}
          </span>
        </template>
        
        <template #cell-media="{ item }">
          <div class="flex items-center space-x-2">
            <span v-if="item.videoUrl" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
              Video
            </span>
            <span v-if="item.audioUrl" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.896-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0014 12a3.987 3.987 0 00-.172-1.172 1 1 0 010-1.415z" clip-rule="evenodd"/>
              </svg>
              Audio
            </span>
            <span v-if="!item.videoUrl && !item.audioUrl" class="text-xs text-gray-400">None</span>
          </div>
        </template>
        
        <template #cell-date="{ item }">
          <span class="text-sm text-gray-500">{{ formatDate(item.createdAt) }}</span>
        </template>
        
        <template #cell-actions="{ item }">
          <div class="flex items-center space-x-1">
            <router-link :to="`/messages/${item.id}`" 
                         class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </router-link>

            <button v-if="item.status === 'draft'" 
                    @click="publishMessage(item.id)" 
                    class="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Publish">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </template>
      </DataTable>

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
                  <label class="block text-sm font-medium text-gray-700">Video URL</label>
                  <input v-model="formData.videoUrl" type="url" class="input mt-1" placeholder="https://www.youtube.com/watch?v=...">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Audio URL</label>
                  <input v-model="formData.audioUrl" type="url" class="input mt-1" placeholder="Audio file URL">
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
import { defineComponent, ref, computed } from 'vue';
import swrv from 'swrv';
import { api, PaginatedResponse } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable, { Column } from '@/components/DataTable.vue';

export default defineComponent({
  name: 'Messages',
  components: { Layout, DataTable },
  setup() {
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchQuery = ref('');
    const isExporting = ref(false);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const formSubmitting = ref(false);
    const formData = ref<any>({
      subject: '',
      text: '',
      from: '',
      videoUrl: '',
      audioUrl: '',
      status: 'draft'
    });

    const columns: Column[] = [
      { key: 'subject', label: 'Subject' },
      { key: 'status', label: 'Status' },
      { key: 'media', label: 'Media' },
      { key: 'date', label: 'Date' },
      { key: 'actions', label: 'Actions' }
    ];

    const messagesUrl = computed(() => {
      const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: pageSize.value.toString()
      });
      if (searchQuery.value) {
        params.append('search', searchQuery.value);
      }
      return `/messages?${params.toString()}`;
    });

    const { data: messagesData, error, isValidating: isLoading, mutate } = swrv<PaginatedResponse<any>>(
      messagesUrl,
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
        const response = await api.get(`/messages/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'messages.xlsx' : 'messages.csv';
        
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
    
    const truncate = (text: string, length: number) => {
      return text.length > length ? text.substring(0, length) + '...' : text;
    };



    const createMessage = async () => {
      formSubmitting.value = true;
      try {
        await api.post('/messages', formData.value);
        await mutate();
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
        await mutate();
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
        await mutate();
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
        videoUrl: '',
        audioUrl: '',
        status: 'draft'
      };
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };



    return {
      columns,
      messagesData,
      error,
      isLoading,
      searchQuery,
      isExporting,
      showCreateModal,
      showEditModal,
      formSubmitting,
      formData,
      handlePageChange,
      handleSearch,
      handleExport,
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