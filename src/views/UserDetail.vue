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
      
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button 
              @click="activeTab = 'analytics'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'analytics' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Analytics
            </button>
            <button 
              @click="activeTab = 'apps'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'apps' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Apps ({{ userApps?.length || 0 }})
            </button>
            <button 
              @click="activeTab = 'categories'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'categories' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Goal Categories ({{ userGoalCategories?.length || 0 }})
            </button>
            <button 
              @click="activeTab = 'messages'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'messages' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Messages ({{ userMessages?.length || 0 }})
            </button>
          </nav>
        </div>
        
        <div class="p-6">
          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'">
            <!-- Date Filter -->
            <div class="mb-6 flex items-center space-x-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select v-model="selectedDateRange" @change="loadAnalyticsData" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
              <div v-if="analyticsLoading" class="flex items-center text-sm text-gray-500">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading analytics...
              </div>
            </div>
            
            <div v-if="analyticsData" class="space-y-6">
              <!-- App Usage Overview -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">App Usage Overview</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div class="bg-white rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ formatTime((analyticsData as any).totalUsageTime) }}</div>
                    <div class="text-sm text-gray-500">Total Usage Time</div>
                  </div>
                  <div class="bg-white rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-green-600">{{ (analyticsData as any).totalSessions }}</div>
                    <div class="text-sm text-gray-500">Total Sessions</div>
                  </div>
                  <div class="bg-white rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-purple-600">{{ (analyticsData as any).activeApps }}</div>
                    <div class="text-sm text-gray-500">Active Apps</div>
                  </div>
                </div>
              </div>
              
              <!-- Top Apps Chart -->
              <div class="bg-white rounded-lg border p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Top Apps by Usage Time</h3>
                <div v-if="(analyticsData as any).topApps?.length" class="space-y-3">
                  <div v-for="(app, index) in (analyticsData as any).topApps" :key="app.packageName" class="flex items-center">
                    <div class="w-8 text-sm text-gray-500 font-medium">{{ index + 1 }}</div>
                    <div class="flex-1 flex items-center">
                      <div class="w-8 h-8 bg-gray-200 rounded mr-3 flex items-center justify-center text-xs font-medium">
                        {{ app.appName?.charAt(0)?.toUpperCase() || app.packageName.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ app.appName || app.packageName }}</div>
                        <div class="text-xs text-gray-500">{{ app.packageName }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium">{{ formatTime(app.totalTime) }}</div>
                      <div class="text-xs text-gray-500">{{ app.sessions }} sessions</div>
                    </div>
                    <div class="ml-4 w-24">
                      <div class="bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-blue-500 h-2 rounded-full" 
                          :style="{ width: `${(app.totalTime / (analyticsData as any).topApps[0].totalTime) * 100}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  No app usage data available for the selected period
                </div>
              </div>
              
              <!-- Daily Usage Trend -->
              <div class="bg-white rounded-lg border p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Usage Trend</h3>
                <div v-if="(analyticsData as any).dailyUsage?.length" class="space-y-2">
                  <div v-for="day in (analyticsData as any).dailyUsage" :key="day.date" class="flex items-center">
                    <div class="w-20 text-sm text-gray-600">{{ formatDateShort(day.date) }}</div>
                    <div class="flex-1 mx-4">
                      <div class="bg-gray-200 rounded-full h-3">
                        <div 
                          class="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" 
                          :style="{ width: `${Math.min((day.totalTime / ((analyticsData as any).maxDailyUsage || 1)) * 100, 100)}%` }"
                        ></div>
                      </div>
                    </div>
                    <div class="w-20 text-right text-sm font-medium">{{ formatTime(day.totalTime) }}</div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  No daily usage data available
                </div>
              </div>
              
              <!-- Goal Categories Usage -->
              <div class="bg-white rounded-lg border p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Usage by Goal Category</h3>
                <div v-if="(analyticsData as any).goalCategoryUsage?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="category in (analyticsData as any).goalCategoryUsage" :key="category.categoryId" class="border rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-medium">{{ category.categoryName }}</h4>
                      <span class="text-sm text-gray-500">{{ formatTime(category.totalTime) }}</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        class="bg-green-500 h-2 rounded-full" 
                        :style="{ width: `${(category.totalTime / ((analyticsData as any).totalUsageTime || 1)) * 100}%` }"
                      ></div>
                    </div>
                    <div class="text-xs text-gray-500">{{ category.appCount }} apps • {{ category.sessions }} sessions</div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  No goal category usage data available
                </div>
              </div>
            </div>
            
            <div v-else-if="!analyticsLoading" class="text-center py-12 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No analytics data available for this user</p>
              <p class="text-sm mt-1">Analytics data is collected from the mobile app usage tracking</p>
            </div>
          </div>
          
          <!-- Apps Tab -->
          <div v-if="activeTab === 'apps'">
            <div v-if="userApps?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="app in userApps" :key="app.id" class="border rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <div v-if="app.imageUrl" class="h-10 w-10 rounded overflow-hidden mr-3">
                    <img :src="app.imageUrl" :alt="app.title" class="h-full w-full object-cover" />
                  </div>
                  <div v-else class="h-10 w-10 rounded bg-gray-200 flex items-center justify-center mr-3 text-gray-500">
                    {{ app.title.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="font-medium">{{ app.title }}</h4>
                    <p class="text-xs text-gray-500">{{ app.goalCategory?.name }}</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600">{{ app.description || 'No description' }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No apps assigned to this user
            </div>
          </div>
          
          <!-- Goal Categories Tab -->
          <div v-if="activeTab === 'categories'">
            <div v-if="userGoalCategories?.length" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected Goals</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="ugc in userGoalCategories" :key="ugc.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ ugc.category.name }}</div>
                        <div class="text-sm text-gray-500">{{ ugc.category.description }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                        :class="ugc.relationshipType === 'primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ ugc.relationshipType }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div v-if="ugc.priorities?.length" class="flex flex-wrap gap-1">
                        <span 
                          v-for="priority in ugc.priorities" 
                          :key="priority.id" 
                          class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {{ priority.title }}
                        </span>
                      </div>
                      <span v-else class="text-sm text-gray-500">No goals selected</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(ugc.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No goal categories for this user
            </div>
          </div>
          
          <!-- Messages Tab -->
          <div v-if="activeTab === 'messages'">
            <div v-if="userMessages?.length" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="message in userMessages" :key="message.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ message.subject }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 max-w-xs truncate">{{ message.content }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                        :class="message.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ message.isRead ? 'Read' : 'Unread' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(message.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No messages sent to this user
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
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
    const activeTab = ref('analytics');
    const selectedDateRange = ref('7');
    const analyticsData = ref(null);
    const analyticsLoading = ref(false);
    
    const { data: user, error, isValidating: isLoading } = swrv<User>(
      () => userId.value ? endpoints.user(userId.value) : null,
      (key) => api.get(key).then(res => res.data)
    );
    
    const { data: userGoalCategories } = swrv<any[]>(
      () => userId.value ? `/user-goal-categories/user/${userId.value}` : null,
      (key) => api.get(key).then(res => res.data)
    );
    
    const { data: userApps } = swrv<any[]>(
      () => userId.value ? `/users/${userId.value}/apps` : null,
      (key) => api.get(key).then(res => res.data)
    );
    
    const { data: userMessages } = swrv<any[]>(
      () => userId.value ? `/messages?userId=${userId.value}` : null,
      (key) => api.get(key).then(res => res.data?.data || res.data)
    );
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    const formatDateShort = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const formatTime = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    };
    
    const loadAnalyticsData = async () => {
      if (!userId.value) return;
      
      analyticsLoading.value = true;
      try {
        const days = parseInt(selectedDateRange.value);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Fetch analytics data from the API
        const response = await api.get(`${endpoints.userAnalytics(userId.value)}?days=${days}`);
        
        if (response.data) {
          analyticsData.value = response.data;
        } else {
          // Fallback mock data for demonstration
          analyticsData.value = {
            totalUsageTime: 0,
            totalSessions: 0,
            activeApps: 0,
            topApps: [],
            dailyUsage: [],
            goalCategoryUsage: [],
            maxDailyUsage: 0
          } as any;
        }
      } catch (error) {
        console.error('Error loading analytics data:', error);
        // Set empty analytics data on error
        analyticsData.value = {
          totalUsageTime: 0,
          totalSessions: 0,
          activeApps: 0,
          topApps: [],
          dailyUsage: [],
          goalCategoryUsage: [],
          maxDailyUsage: 0
        } as any;
      } finally {
        analyticsLoading.value = false;
      }
    };
    
    // Load analytics data when component mounts
    if (userId.value) {
      loadAnalyticsData();
    }
    
    return {
      user,
      userGoalCategories,
      userApps,
      userMessages,
      activeTab,
      selectedDateRange,
      analyticsData,
      analyticsLoading,
      error,
      isLoading,
      formatDate,
      formatDateShort,
      formatTime,
      loadAnalyticsData
    };
  }
});
</script>