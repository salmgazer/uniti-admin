<template>
  <Layout pageTitle="Admin Users">
    <DataTable
      title="Admin User Management"
      :data="adminUsers?.data || []"
      :loading="isLoading"
      :error="error"
      :pagination="adminUsers"
      :columns="columns"
      :show-search="true"
      :show-export="true"
      :search-value="searchQuery"
      :is-exporting="isExporting"
      @search="handleSearch"
      @page-change="handlePageChange"
      @export="handleExport"
    >
      <template #actions>
        <button 
          v-if="isSuperAdmin"
          @click="showCreateModal = true" 
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Admin User
        </button>
      </template>
      
      <template #role="{ item }">
        <span 
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          :class="item.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
        >
          {{ item.role }}
        </span>
      </template>
      
      <template #status="{ item }">
        <span 
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ item.isActive ? 'Active' : 'Inactive' }}
        </span>
      </template>
      
      <template #createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>
      
      <template #cell-actions="{ item }">
        <div v-if="isSuperAdmin" class="flex items-center space-x-2">
          <button 
            @click="editAdmin(item)" 
            class="text-primary-600 hover:text-primary-900"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            v-if="item.id !== currentUser?.id"
            @click="toggleSuspension(item)" 
            :class="item.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
            :title="item.isActive ? 'Suspend' : 'Activate'"
          >
            <svg v-if="item.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            v-if="item.id !== currentUser?.id"
            @click="confirmDelete(item)" 
            class="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <span v-else class="text-gray-400 text-sm">No access</span>
      </template>
    </DataTable>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ showEditModal ? 'Edit Admin User' : 'Create Admin User' }}
        </h3>
        
        <form @submit.prevent="showEditModal ? updateAdmin() : createAdmin()">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                id="name" 
                v-model="formData.name" 
                type="text" 
                required 
                class="input mt-1"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                id="email" 
                v-model="formData.email" 
                type="email" 
                required 
                class="input mt-1"
              />
            </div>
            
            <div v-if="showCreateModal || (showEditModal && formData.id !== currentUser?.id)">
              <label for="password" class="block text-sm font-medium text-gray-700">
                {{ showEditModal ? 'New Password (leave blank to keep current)' : 'Password' }}
              </label>
              <input 
                id="password" 
                v-model="formData.password" 
                type="password" 
                :required="showCreateModal"
                :class="['input mt-1', passwordError ? 'border-red-500' : '']"
                @input="validatePassword"
              />
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              <p v-if="showCreateModal" class="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            
            <div v-if="showEditModal && formData.id !== currentUser?.id">
              <label for="isActive" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="isActive" v-model="formData.isActive" class="input mt-1">
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
            
            <div v-if="formData.id !== currentUser?.id">
              <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
              <select id="role" v-model="formData.role" class="input mt-1">
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
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
              <svg v-if="formSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ formSubmitting ? (showEditModal ? 'Updating...' : 'Creating...') : (showEditModal ? 'Update' : 'Create') }}
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
          Are you sure you want to delete the admin user "{{ adminToDelete?.name }}"? This action cannot be undone.
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
            @click="deleteAdmin" 
            class="btn bg-red-600 text-white hover:bg-red-700"
            :disabled="formSubmitting"
          >
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
import { api, endpoints, AdminUser, PaginatedResponse } from '@/services/api';
import Layout from '@/components/Layout.vue';
import DataTable from '@/components/DataTable.vue';
import { useAuth } from '@/services/auth';

export default defineComponent({
  name: 'AdminUsers',
  components: {
    Layout,
    DataTable
  },
  setup() {
    const { currentUser } = useAuth();
    const isSuperAdmin = computed(() => currentUser.value?.role === 'super-admin');
    
    const currentPage = ref(1);
    const searchQuery = ref('');
    const isExporting = ref(false);
    
    const { data: adminUsers, error, isValidating: isLoading, mutate } = swrv<PaginatedResponse<AdminUser>>(
      () => `${endpoints.adminUsers}?page=${currentPage.value}&limit=10&search=${searchQuery.value}`,
      (url) => api.get(url).then(res => res.data)
    );
    
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Created' },
      { key: 'actions', label: 'Actions' }
    ];
    
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const formSubmitting = ref(false);
    const adminToDelete = ref<AdminUser | null>(null);
    
    const formData = reactive({
      id: '',
      name: '',
      email: '',
      password: '',
      isActive: true,
      role: 'admin'
    });
    
    const passwordError = ref('');
    
    const resetForm = () => {
      formData.id = '';
      formData.name = '';
      formData.email = '';
      formData.password = '';
      formData.isActive = true;
      formData.role = 'admin';
      passwordError.value = '';
    };
    
    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      resetForm();
    };
    
    const editAdmin = (admin: AdminUser) => {
      formData.id = admin.id;
      formData.name = admin.name;
      formData.email = admin.email;
      formData.password = '';
      formData.isActive = admin.isActive;
      formData.role = admin.role;
      showEditModal.value = true;
    };
    
    const validatePassword = () => {
      const password = formData.password;
      if (!password && showCreateModal.value) {
        passwordError.value = 'Password is required';
        return false;
      }
      if (password && password.length > 0) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if (!passwordRegex.test(password)) {
          passwordError.value = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
          return false;
        }
      }
      passwordError.value = '';
      return true;
    };
    
    const createAdmin = async () => {
      if (!validatePassword()) return;
      
      try {
        formSubmitting.value = true;
        await api.post(endpoints.adminUsers, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to create admin user:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const updateAdmin = async () => {
      if (formData.password && !validatePassword()) return;
      
      try {
        formSubmitting.value = true;
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          isActive: formData.isActive,
          role: formData.role
        };
        
        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await api.patch(endpoints.adminUser(formData.id), updateData);
        
        await mutate();
        closeModal();
      } catch (err) {
        console.error('Failed to update admin user:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const confirmDelete = (admin: AdminUser) => {
      adminToDelete.value = admin;
      showDeleteModal.value = true;
    };
    
    const toggleSuspension = async (admin: AdminUser) => {
      try {
        await api.patch(endpoints.adminUser(admin.id), {
          isActive: !admin.isActive
        });
        await mutate();
      } catch (err) {
        console.error('Failed to toggle admin suspension:', err);
      }
    };
    
    const deleteAdmin = async () => {
      if (!adminToDelete.value) return;
      
      try {
        formSubmitting.value = true;
        await api.delete(endpoints.adminUser(adminToDelete.value.id));
        
        await mutate();
        showDeleteModal.value = false;
        adminToDelete.value = null;
      } catch (err) {
        console.error('Failed to delete admin user:', err);
      } finally {
        formSubmitting.value = false;
      }
    };
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    const handleSearch = (query: string) => {
      searchQuery.value = query;
      currentPage.value = 1;
      mutate();
    };
    
    const handlePageChange = (page: number) => {
      currentPage.value = page;
      mutate();
    };
    
    const handleExport = async (format: 'csv' | 'excel') => {
      try {
        isExporting.value = true;
        const params = new URLSearchParams({ format });
        if (searchQuery.value) params.append('search', searchQuery.value);
        
        const response = await api.get(`${endpoints.adminUsers}/export?${params.toString()}`, {
          responseType: 'blob'
        });
        
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const filename = format === 'excel' ? 'admin-users.xlsx' : 'admin-users.csv';
        
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
    
    return {
      adminUsers,
      error,
      isLoading,
      currentUser,
      isSuperAdmin,
      columns,
      searchQuery,
      isExporting,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      adminToDelete,
      passwordError,
      closeModal,
      editAdmin,
      createAdmin,
      updateAdmin,
      confirmDelete,
      toggleSuspension,
      deleteAdmin,
      formatDate,
      validatePassword,
      handleSearch,
      handlePageChange,
      handleExport
    };
  }
});
</script>