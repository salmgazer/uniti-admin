<template>
  <Layout pageTitle="Admin Users">
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold">Admin User Management</h2>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Add Admin User
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">Loading admin users...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-red-500">{{ error }}</td>
          </tr>
          <tr v-else-if="!adminUsers || adminUsers.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No admin users found</td>
          </tr>
          <tr v-for="admin in adminUsers" :key="admin.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ admin.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ admin.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
              >
                {{ admin.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ admin.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(admin.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="editAdmin(admin)" 
                class="text-primary-600 hover:text-primary-900 mr-3"
              >
                Edit
              </button>
              <button 
                v-if="admin.id !== currentUser?.id"
                @click="confirmDelete(admin)" 
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
                class="input mt-1"
              />
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
import { api, endpoints, AdminUser } from '@/services/api';
import Layout from '@/components/Layout.vue';
import { useAuth } from '@/services/auth';

export default defineComponent({
  name: 'AdminUsers',
  components: {
    Layout
  },
  setup() {
    const { currentUser } = useAuth();
    
    const { data: adminUsers, error, isValidating: isLoading, mutate } = swrv<AdminUser[]>(
      endpoints.adminUsers,
      () => api.get(endpoints.adminUsers).then(res => res.data)
    );
    
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
    
    const resetForm = () => {
      formData.id = '';
      formData.name = '';
      formData.email = '';
      formData.password = '';
      formData.isActive = true;
      formData.role = 'admin';
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
    
    const createAdmin = async () => {
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
    
    return {
      adminUsers,
      error,
      isLoading,
      currentUser,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      formData,
      formSubmitting,
      adminToDelete,
      closeModal,
      editAdmin,
      createAdmin,
      updateAdmin,
      confirmDelete,
      deleteAdmin,
      formatDate
    };
  }
});
</script>