<template>
  <Layout :pageTitle="message ? `Message: ${message.subject}` : 'Message Details'">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Loading message data...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    
    <div v-else-if="message" class="space-y-6">
      <!-- Message Details -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ message.subject }}</h2>
            <p class="text-sm text-gray-500">ID: {{ message.id }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              class="px-3 py-1 text-sm font-semibold rounded-full"
              :class="message.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
            >
              {{ message.status }}
            </span>
            <button 
              v-if="message.status === 'draft'" 
              @click="publishMessage" 
              class="btn btn-primary btn-sm"
            >
              Publish
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Message Content</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500">From</p>
                <p class="mt-1">{{ message.from }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Type</p>
                <p class="mt-1 capitalize">{{ message.type }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Message</p>
                <p class="mt-1 whitespace-pre-wrap">{{ message.text }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Targeting & Channels</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500">Countries</p>
                <div class="mt-1 flex flex-wrap gap-1">
                  <span 
                    v-for="code in message.countryCodes" 
                    :key="code"
                    class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {{ code }}
                  </span>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Channels</p>
                <div class="mt-1 flex flex-wrap gap-1">
                  <span 
                    v-for="channel in message.channels" 
                    :key="channel"
                    class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {{ channel }}
                  </span>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Created</p>
                <p class="mt-1">{{ formatDate(message.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- User Interactions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Interactions</h3>
        
        <div v-if="interactions" class="space-y-4">
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-blue-600">Total Sent</p>
              <p class="text-2xl font-bold text-blue-900">{{ interactions.totalSent }}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-green-600">Viewed</p>
              <p class="text-2xl font-bold text-green-900">{{ interactions.totalViewed }}</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-purple-600">Read</p>
              <p class="text-2xl font-bold text-purple-900">{{ interactions.totalRead }}</p>
            </div>
          </div>
          
          <!-- Interactions List -->
          <div v-if="interactions.interactions.length > 0">
            <h4 class="text-md font-medium text-gray-900 mb-3">User Activity</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viewed At</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="interaction in interactions.interactions" :key="interaction.user.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ interaction.user.name || 'Unnamed User' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ interaction.user.phoneNumber }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                        :class="interaction.isRead ? 'bg-green-100 text-green-800' : 
                               interaction.viewedAt ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ interaction.isRead ? 'Read' : interaction.viewedAt ? 'Viewed' : 'Sent' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ interaction.viewedAt ? formatDate(interaction.viewedAt) : '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            No user interactions yet
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import swrv from 'swrv';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'MessageDetail',
  components: { Layout },
  setup() {
    const route = useRoute();
    const messageId = computed(() => route.params.id as string);
    const interactions = ref<any>(null);
    
    const { data: message, error, isValidating: isLoading } = swrv<any>(
      () => messageId.value ? `/messages/${messageId.value}` : null,
      (key) => api.get(key).then(res => res.data)
    );
    
    const loadInteractions = async () => {
      if (!messageId.value) return;
      try {
        const response = await api.get(`/messages/${messageId.value}/user-interactions`);
        interactions.value = response.data;
      } catch (error) {
        console.error('Failed to load interactions:', error);
      }
    };
    
    const publishMessage = async () => {
      try {
        await api.post(`/messages/${messageId.value}/publish`);
        // Reload message data
        window.location.reload();
      } catch (error) {
        console.error('Failed to publish message:', error);
      }
    };
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    onMounted(() => {
      loadInteractions();
    });
    
    return {
      message,
      interactions,
      error,
      isLoading,
      publishMessage,
      formatDate
    };
  }
});
</script>