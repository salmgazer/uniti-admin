<template>
  <Layout pageTitle="Message Queue">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Message Queue</h1>
      <div class="flex gap-3">
        <button
          @click="processQueue"
          :disabled="processing"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg v-if="processing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ processing ? 'Processing...' : 'Process Queue' }}
        </button>
        <button
          @click="refreshData"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Pending</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Processing</h3>
            <p class="text-3xl font-bold text-blue-600">{{ stats.processing }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Completed</h3>
            <p class="text-3xl font-bold text-green-600">{{ stats.completed }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Failed</h3>
            <p class="text-3xl font-bold text-red-600">{{ stats.failed }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total</h3>
            <p class="text-3xl font-bold text-gray-600">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">Queue Management</h2>
      <div class="flex items-center space-x-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="templateTitleFilter" 
            @input="loadQueue"
            type="text" 
            placeholder="Search templates..." 
            class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
        <div class="relative">
          <select 
            v-model="selectedStatus" 
            @change="loadQueue"
            class="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Queue Table -->
    <DataTable
      :data="queueData"
      :columns="columns"
      :is-loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    >
      <template #cell-status="{ item }">
        <span :class="getStatusClass(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
          {{ item.status.toUpperCase() }}
        </span>
      </template>
      
      <template #cell-progress="{ item }">
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(item.processedCount / item.userCount) * 100}%` }"
            ></div>
          </div>
          <span class="text-xs text-gray-600">
            {{ item.processedCount }}/{{ item.userCount }}
          </span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex gap-2">
          <button
            @click="viewDetails(item.id)"
            class="text-gray-600 hover:text-gray-800 text-sm font-medium"
            title="View Details"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            v-if="item.status === 'failed'"
            @click="retryJob(item.id)"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            title="Retry"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Queue Item Details</h3>
            <button @click="showDetailsModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]" v-if="selectedItem">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Template Information</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div><span class="font-medium">Title:</span> {{ selectedItem.templateTitle }}</div>
                <div><span class="font-medium">ID:</span> {{ selectedItem.templateId }}</div>
                <div><span class="font-medium">Content:</span></div>
                <div class="bg-white p-3 rounded border text-sm">{{ selectedItem.templateContent }}</div>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Queue Information</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div><span class="font-medium">Status:</span> 
                  <span :class="getStatusClass(selectedItem.status)" class="px-2 py-1 rounded-full text-xs font-medium ml-2">
                    {{ selectedItem.status.toUpperCase() }}
                  </span>
                </div>
                <div><span class="font-medium">Total Users:</span> {{ selectedItem.users.length }}</div>
                <div><span class="font-medium">Processed:</span> {{ selectedItem.users.filter((u: any) => u.isProcessed).length }}</div>
                <div><span class="font-medium">Retry Count:</span> {{ selectedItem.retryCount }}</div>
                <div><span class="font-medium">Created:</span> {{ new Date(selectedItem.createdAt).toLocaleString() }}</div>
                <div v-if="selectedItem.error"><span class="font-medium text-red-600">Error:</span> {{ selectedItem.error }}</div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedItem.placeholders && Object.keys(selectedItem.placeholders).length > 0" class="mt-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Placeholders</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div v-for="(value, key) in selectedItem.placeholders" :key="key" class="flex justify-between py-1">
                <span class="font-medium">{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Users ({{ selectedItem.users.length }})</h4>
            <div class="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <div class="space-y-2">
                <div v-for="user in selectedItem.users" :key="user.id" 
                     :class="user.isProcessed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'"
                     class="p-3 border rounded-lg flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-medium text-sm" :class="user.isProcessed ? 'text-green-800' : 'text-gray-800'">
                      {{ user.name }}
                    </div>
                    <div class="text-xs text-gray-500">{{ user.phoneNumber }}</div>
                    <div class="text-xs text-gray-400 font-mono">{{ user.id }}</div>
                  </div>
                  <div v-if="user.isProcessed" class="text-green-500">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Layout from '@/components/Layout.vue';
import DataTable from '@/components/DataTable.vue';
import { api, endpoints, QueueStats, QueueItem, PaginatedResponse } from '@/services/api';
import { useToast } from '@/composables/useToast';

const { addToast } = useToast();

const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  addToast({ title: message, type });
};

const loading = ref(false);
const processing = ref(false);
const selectedStatus = ref('');
const templateTitleFilter = ref('');
const showDetailsModal = ref(false);
const selectedItem = ref<any>(null);
const queueData = ref<QueueItem[]>([]);
const stats = ref<QueueStats>({
  pending: 0,
  processing: 0,
  completed: 0,
  failed: 0,
  total: 0
});

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
});

const columns = [
  { key: 'id', label: 'Queue ID', sortable: true },
  { key: 'templateTitle', label: 'Template', sortable: true },
  { key: 'userCount', label: 'Users', sortable: true },
  { key: 'progress', label: 'Progress', slot: true },
  { key: 'status', label: 'Status', slot: true, sortable: true },
  { key: 'retryCount', label: 'Retries', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true, type: 'datetime' },
  { key: 'actions', label: 'Actions', slot: true }
];

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const loadStats = async () => {
  try {
    const response = await api.get(endpoints.queueStats);
    stats.value = response.data;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};

const loadQueue = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...(selectedStatus.value && { status: selectedStatus.value }),
      ...(templateTitleFilter.value && { templateTitle: templateTitleFilter.value })
    };
    
    const response = await api.get<PaginatedResponse<QueueItem>>(endpoints.queue, { params });
    queueData.value = response.data.data;
    pagination.value = {
      page: response.data.page,
      limit: response.data.limit,
      total: response.data.total,
      totalPages: response.data.totalPages,
      hasNext: response.data.hasNext,
      hasPrev: response.data.hasPrev
    };
  } catch (error) {
    console.error('Failed to load queue:', error);
    showToast('Failed to load queue data', 'error');
  } finally {
    loading.value = false;
  }
};

const processQueue = async () => {
  processing.value = true;
  try {
    const response = await api.post(endpoints.queueProcess);
    showToast(response.data.message, 'success');
    await refreshData();
  } catch (error) {
    console.error('Failed to process queue:', error);
    showToast('Failed to process queue', 'error');
  } finally {
    processing.value = false;
  }
};

const viewDetails = async (itemId: string) => {
  try {
    const response = await api.get(`/message-queue/admin/${itemId}`);
    selectedItem.value = response.data;
    showDetailsModal.value = true;
  } catch (error) {
    console.error('Failed to load item details:', error);
    showToast('Failed to load item details', 'error');
  }
};

const retryJob = async (jobId: string) => {
  try {
    const response = await api.post(endpoints.queueRetry(jobId));
    showToast(response.data.message, 'success');
    await refreshData();
  } catch (error) {
    console.error('Failed to retry job:', error);
    showToast('Failed to retry job', 'error');
  }
};

const refreshData = async () => {
  await Promise.all([loadStats(), loadQueue()]);
};

const handlePageChange = (page: number) => {
  pagination.value.page = page;
  loadQueue();
};

onMounted(() => {
  refreshData();
  // Auto-refresh every 30 seconds
  setInterval(refreshData, 30000);
});
</script>