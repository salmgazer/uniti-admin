<template>
  <Layout pageTitle="Users">
    <div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">User Management</h2>
        <p class="text-gray-500 mt-1">Manage and view all registered users</p>
      </div>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search users..." 
          class="input pl-10 bg-white shadow-sm border-gray-200 focus:border-primary-500"
        />
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <table class="table-modern">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Country</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-8 text-center">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
              <p class="mt-2 text-gray-500">Loading users...</p>
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
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="6" class="px-6 py-8 text-center">
              <div class="text-gray-500 flex flex-col items-center">
                <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="mt-2">No users found</p>
              </div>
            </td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td>
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img v-if="user.profilePicture" :src="user.profilePicture" class="h-10 w-10 rounded-full object-cover shadow-sm" alt="" />
                  <div v-else class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center text-primary-600 font-medium shadow-sm">
                    {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900">{{ user.name || 'Unnamed User' }}</div>
                  <div class="text-xs text-gray-500">Created: {{ formatDate(user.createdAt) }}</div>
                </div>
              </div>
            </td>
            <td>{{ user.phoneNumber }}</td>
            <td>{{ user.email || '-' }}</td>
            <td>{{ user.countryCode || '-' }}</td>
            <td>
              <span 
                class="badge"
                :class="user.isVerified ? 'badge-success' : 'badge-warning'"
              >
                {{ user.isVerified ? 'Verified' : 'Unverified' }}
              </span>
            </td>
            <td>
              <router-link :to="`/users/${user.id}`" class="btn-primary text-sm py-1.5 px-3">
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import swrv from 'swrv';
import { api, endpoints, User } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'Users',
  components: {
    Layout
  },
  setup() {
    const searchQuery = ref('');
    
    const { data: users, error, isValidating: isLoading } = swrv<User[]>(
      endpoints.users,
      () => api.get(endpoints.users).then(res => res.data)
    );
    
    const filteredUsers = computed(() => {
      if (!users.value) return [];
      if (!searchQuery.value) return users.value;
      
      const query = searchQuery.value.toLowerCase();
      return users.value.filter(user => 
        (user.name?.toLowerCase().includes(query)) || 
        user.phoneNumber.toLowerCase().includes(query) || 
        (user.email?.toLowerCase().includes(query)) ||
        (user.countryCode?.toLowerCase().includes(query))
      );
    });
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    return {
      users,
      error,
      isLoading,
      searchQuery,
      filteredUsers,
      formatDate
    };
  }
});
</script>