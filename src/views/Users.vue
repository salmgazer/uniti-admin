<template>
  <Layout pageTitle="Users">
    <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 class="text-xl font-semibold">User Management</h2>
        <p class="text-gray-500 mt-1">Manage and view all registered users</p>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="usersData?.data || []"
      :pagination="usersData ? { page: usersData.page, limit: usersData.limit, total: usersData.total, totalPages: usersData.totalPages, hasNext: usersData.hasNext, hasPrev: usersData.hasPrev } : undefined"
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
      <template #cell-name="{ item }">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img v-if="item.profilePicture" :src="item.profilePicture" class="h-10 w-10 rounded-full object-cover shadow-sm" alt="" />
            <div v-else class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center text-primary-600 font-medium shadow-sm">
              {{ item.name ? item.name.charAt(0).toUpperCase() : 'U' }}
            </div>
          </div>
          <div class="ml-4">
            <div class="font-medium text-gray-900">{{ item.name || 'Unnamed User' }}</div>
            <div class="text-xs text-gray-500">Created: {{ formatDate(item.createdAt) }}</div>
          </div>
        </div>
      </template>
      
      <template #cell-email="{ item }">
        {{ item.email || '-' }}
      </template>
      
      <template #cell-country="{ item }">
        {{ item.country?.name || item.countryCode || '-' }}
      </template>
      
      <template #cell-status="{ item }">
        <span 
          class="badge"
          :class="item.isVerified ? 'badge-success' : 'badge-warning'"
        >
          {{ item.isVerified ? 'Verified' : 'Unverified' }}
        </span>
      </template>
      
      <template #cell-actions="{ item }">
        <router-link :to="`/users/${item.id}`" class="inline-flex items-center px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
          View Details
        </router-link>
      </template>
    </DataTable>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import swrv from 'swrv';
import { api, endpoints, PaginatedResponse, User } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable, { Column } from '@/components/DataTable.vue';

export default defineComponent({
  name: 'Users',
  components: {
    Layout,
    DataTable
  },
  setup() {
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchQuery = ref('');
    const isExporting = ref(false);
    
    const columns: Column[] = [
      { key: 'name', label: 'Name' },
      { key: 'phoneNumber', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'country', label: 'Country' },
      { key: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions' }
    ];
    
    const usersUrl = computed(() => {
      const params = new URLSearchParams({
        page: currentPage.value.toString(),
        limit: pageSize.value.toString()
      });
      if (searchQuery.value) {
        params.append('search', searchQuery.value);
      }
      return `${endpoints.users}?${params.toString()}`;
    });
    
    const { data: usersData, error, isValidating: isLoading } = swrv<PaginatedResponse<User>>(
      usersUrl,
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
        const response = await api.get(`${endpoints.users}/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'users.xlsx' : 'users.csv';
        
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
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    return {
      columns,
      usersData,
      error,
      isLoading,
      searchQuery,
      isExporting,
      handlePageChange,
      handleSearch,
      handleExport,
      formatDate
    };
  }
});
</script>