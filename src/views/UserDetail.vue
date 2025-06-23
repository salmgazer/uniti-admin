<template>
  <Layout :pageTitle="user ? `User: ${user.name || user.phoneNumber}` : 'User Details'">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Loading user data...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    
    <div v-else-if="user" class="space-y-6">
      <!-- User Profile -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div v-if="user.profilePicture" class="h-24 w-24 rounded-full overflow-hidden">
              <img :src="user.profilePicture" alt="Profile" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
              {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
            </div>
          </div>
          <div class="ml-6 flex-1">
            <div class="flex justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ user.name || 'Unnamed User' }}</h2>
                <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
              </div>
              <span 
                class="px-2 h-6 inline-flex items-center text-xs leading-5 font-semibold rounded-full"
                :class="user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ user.isVerified ? 'Verified' : 'Unverified' }}
              </span>
            </div>
            
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Phone Number</p>
                <p class="mt-1">{{ user.phoneNumber }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="mt-1">{{ user.email || 'Not provided' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Country</p>
                <p class="mt-1">{{ user.countryCode || 'Not specified' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Joined</p>
                <p class="mt-1">{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import swrv from 'swrv';
import { api, endpoints, User } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'UserDetail',
  components: {
    Layout
  },
  setup() {
    const route = useRoute();
    const userId = computed(() => route.params.id as string);
    
    const { data: user, error, isValidating: isLoading } = swrv<User>(
      () => userId.value ? endpoints.user(userId.value) : null,
      (key) => api.get(key).then(res => res.data)
    );
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    return {
      user,
      error,
      isLoading,
      formatDate
    };
  }
});
</script>