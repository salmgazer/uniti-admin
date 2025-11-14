<template>
  <div>
    <!-- Header with Search, Export and Actions -->
    <div v-if="showSearch || showExport || $slots.actions" class="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div v-if="showSearch" class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="localSearchValue" 
          type="text" 
          placeholder="Search..." 
          class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm w-full"
        />
      </div>
      <div class="flex items-center gap-4">
        <slot name="actions"></slot>
        <div v-if="showExport" class="relative">
        <button
          @click="showExportDropdown = !showExportDropdown"
          :disabled="isExporting"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isExporting" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ isExporting ? 'Exporting...' : 'Export' }}
          <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="showExportDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div class="py-1">
            <button
              @click="handleExportOption('csv')"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg class="mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as CSV
            </button>
            <button
              @click="handleExportOption('excel')"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg class="mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as Excel
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
    
    <div class="card p-0 overflow-hidden">
      <table class="table-modern">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.key === 'actions' ? 'text-right' : ''">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td :colspan="columns.length" class="px-6 py-8 text-center">
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <p class="mt-2 text-gray-500">Loading...</p>
          </td>
        </tr>
        <tr v-else-if="error">
          <td :colspan="columns.length" class="px-6 py-8 text-center">
            <div class="text-red-500 flex flex-col items-center">
              <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="mt-2">{{ error }}</p>
            </div>
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="px-6 py-8 text-center">
            <div class="text-gray-500 flex flex-col items-center">
              <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="mt-2">No data found</p>
            </div>
          </td>
        </tr>
        <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
          <td v-for="column in columns" :key="column.key" :class="column.key === 'actions' ? 'text-right' : ''">
            <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
              {{ item[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Pagination -->
    <div v-if="pagination && !isLoading && !error" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} results
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('page-change', pagination.page - 1)"
            :disabled="!pagination.hasPrev"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="$emit('page-change', page)"
              :class="[
                'px-3 py-1 text-sm border rounded-md',
                page === pagination.page 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500">...</span>
          </template>
          
          <button
            @click="$emit('page-change', pagination.page + 1)"
            :disabled="!pagination.hasNext"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted, watch, PropType } from 'vue';

export interface Column {
  key: string;
  label: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default defineComponent({
  name: 'DataTable',
  props: {
    columns: {
      type: Array as PropType<Column[]>,
      required: true
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    pagination: {
      type: Object as PropType<Pagination>,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showExport: {
      type: Boolean,
      default: false
    },
    searchValue: {
      type: String,
      default: ''
    },
    isExporting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['page-change', 'search', 'export'],
  setup(props, { emit }) {
    const showExportDropdown = ref(false);
    const localSearchValue = ref(props.searchValue || '');
    let searchTimeout: NodeJS.Timeout;
    
    const visiblePages = computed(() => {
      if (!props.pagination) return [];
      
      const { page, totalPages } = props.pagination;
      const pages: (number | string)[] = [];
      
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (page <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (page >= totalPages - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = page - 1; i <= page + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    });
    
    const handleExportOption = (format: 'csv' | 'excel') => {
      showExportDropdown.value = false;
      emit('export', format);
    };
    
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        showExportDropdown.value = false;
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    // Debounced search
    watch(localSearchValue, (newValue) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        emit('search', newValue);
      }, 300);
    });
    
    // Update local value when prop changes
    watch(() => props.searchValue, (newValue) => {
      localSearchValue.value = newValue || '';
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(searchTimeout);
    });
    
    return {
      visiblePages,
      showExportDropdown,
      localSearchValue,
      handleExportOption
    };
  }
});
</script>