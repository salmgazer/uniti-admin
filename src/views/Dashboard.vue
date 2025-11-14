<template>
  <Layout pageTitle="Dashboard">
    <!-- Main Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Users</h3>
            <p class="text-3xl font-bold text-gray-800">{{ stats?.totalUsers || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ (stats as any)?.recentUsers || 0 }} new this month</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Active Users</h3>
            <p class="text-3xl font-bold text-gray-800">{{ stats?.activeUsers || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ Math.round(((stats?.activeUsers || 0) / (stats?.totalUsers || 1)) * 100) }}% verified</p>
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
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Apps</h3>
            <p class="text-3xl font-bold text-gray-800">{{ stats?.totalApps || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ (stats as any)?.totalCountries || 0 }} countries</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Messages</h3>
            <p class="text-3xl font-bold text-gray-800">{{ (stats as any)?.totalMessages || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ (stats as any)?.totalMessageTemplates || 0 }} templates</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-white to-gray-50">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Languages</h3>
            <p class="text-2xl font-bold text-gray-800">{{ (stats as any)?.totalLanguages || 0 }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Countries</h3>
            <p class="text-2xl font-bold text-gray-800">{{ (stats as any)?.totalCountries || 0 }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Admin Users</h3>
            <p class="text-2xl font-bold text-gray-800">{{ (stats as any)?.activeAdminUsers || 0 }}/{{ (stats as any)?.totalAdminUsers || 0 }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="card overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800">Categories</h3>
          <div class="badge badge-info">Chart</div>
        </div>
        <div class="h-72">
          <Doughnut v-if="chartData.categories" :data="chartData.categories" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center">
            <div class="animate-pulse flex space-x-4">
              <div class="rounded-full bg-gray-200 h-10 w-10"></div>
              <div class="flex-1 space-y-4 py-1">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-800">Users by Country</h3>
          <div class="badge badge-info">Chart</div>
        </div>
        <div class="h-72">
          <Bar v-if="chartData.usersByCountry" :data="chartData.usersByCountry" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center">
            <div class="animate-pulse flex space-x-4">
              <div class="rounded-full bg-gray-200 h-10 w-10"></div>
              <div class="flex-1 space-y-4 py-1">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">App Usage Analytics</h2>
        <div class="flex items-center space-x-4">
          <select v-model="dateRangeType" @change="onDateRangeTypeChange" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="preset">Preset Range</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <div v-if="dateRangeType === 'preset'">
            <select v-model="selectedPeriod" @change="loadAnalytics" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div v-if="dateRangeType === 'custom'" class="flex items-center space-x-2">
            <input 
              v-model="customStartDate" 
              type="date" 
              class="border border-gray-300 rounded-md px-3 py-2 text-sm"
              @change="loadAnalytics"
            />
            <span class="text-sm text-gray-500">to</span>
            <input 
              v-model="customEndDate" 
              type="date" 
              class="border border-gray-300 rounded-md px-3 py-2 text-sm"
              @change="loadAnalytics"
            />
          </div>
        </div>
      </div>
      
      <div v-if="analyticsLoading" class="flex justify-center items-center h-32">
        <svg class="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="analytics" class="space-y-6">
        <!-- Analytics Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="card bg-gradient-to-br from-blue-50 to-blue-100">
            <h4 class="text-sm font-medium text-gray-600 mb-1">Total Usage Time</h4>
            <p class="text-2xl font-bold text-blue-700">{{ formatTime((analytics as any).totalUsageTime) }}</p>
          </div>
          <div class="card bg-gradient-to-br from-green-50 to-green-100">
            <h4 class="text-sm font-medium text-gray-600 mb-1">Total Sessions</h4>
            <p class="text-2xl font-bold text-green-700">{{ (analytics as any).totalSessions.toLocaleString() }}</p>
          </div>
          <div class="card bg-gradient-to-br from-purple-50 to-purple-100">
            <h4 class="text-sm font-medium text-gray-600 mb-1">Active Users</h4>
            <p class="text-2xl font-bold text-purple-700">{{ (analytics as any).activeUsers.toLocaleString() }}</p>
          </div>
          <div class="card bg-gradient-to-br from-orange-50 to-orange-100">
            <h4 class="text-sm font-medium text-gray-600 mb-1">Avg Session</h4>
            <p class="text-2xl font-bold text-orange-700">{{ formatTime((analytics as any).avgSessionDuration) }}</p>
          </div>
        </div>
        
        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top Apps Chart -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Most Used Apps</h3>
            <div v-if="(analytics as any).topApps?.length" class="space-y-3">
              <div v-for="(app, index) in (analytics as any).topApps.slice(0, 8)" :key="app.packageName" class="flex items-center">
                <div class="w-6 text-sm text-gray-500 font-medium">{{ index + 1 }}</div>
                <div class="flex-1 flex items-center ml-2">
                  <div class="w-6 h-6 bg-gray-200 rounded mr-2 flex items-center justify-center text-xs">
                    {{ app.appName?.charAt(0)?.toUpperCase() || 'A' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate">{{ app.appName || app.packageName }}</div>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <div class="text-sm font-medium">{{ formatTime(app.totalTime) }}</div>
                  <div class="text-xs text-gray-500">{{ app.userCount }} users</div>
                </div>
                <div class="ml-3 w-16">
                  <div class="bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" :style="{ width: `${(app.totalTime / (analytics as any).topApps[0].totalTime) * 100}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">No app usage data available</div>
          </div>
          
          <!-- Goal Categories Usage -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Usage by Goal Category</h3>
            <div v-if="(analytics as any).goalCategoryUsage?.length" class="space-y-3">
              <div v-for="category in (analytics as any).goalCategoryUsage" :key="category.categoryId" class="">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium">{{ category.categoryName }}</span>
                  <span class="text-sm text-gray-500">{{ formatTime(category.totalTime) }}</span>
                </div>
                <div class="bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${(category.totalTime / (analytics as any).totalUsageTime) * 100}%` }"></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">{{ category.userCount }} users • {{ category.appCount }} apps</div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">No category usage data available</div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p>No analytics data available</p>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import swrv from 'swrv';
import { api, endpoints, DashboardStats } from '@/services/api';
import Layout from '@/components/Layout.vue';
import { Doughnut, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default defineComponent({
  name: 'Dashboard',
  components: {
    Layout,
    Doughnut,
    Bar
  },
  setup() {
    const selectedPeriod = ref('30');
    const dateRangeType = ref('preset');
    const customStartDate = ref('');
    const customEndDate = ref('');
    const analytics = ref(null);
    const analyticsLoading = ref(false);
    
    const { data: stats, error } = swrv<DashboardStats>(
      endpoints.stats, 
      () => api.get(endpoints.stats).then(res => res.data)
    );

    const chartData = computed(() => {
      if (!stats.value) return {};
      
      return {
        categories: {
          labels: stats.value.categories.map(item => item.category),
          datasets: [
            {
              data: stats.value.categories.map(item => item.count),
              backgroundColor: [
                'rgba(79, 70, 229, 0.8)',  // Indigo
                'rgba(16, 185, 129, 0.8)', // Green
                'rgba(59, 130, 246, 0.8)', // Blue
                'rgba(168, 85, 247, 0.8)'  // Purple
              ],
              borderColor: [
                'rgba(79, 70, 229, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(168, 85, 247, 1)'
              ],
              borderWidth: 2,
              hoverOffset: 6,
              borderRadius: 4
            }
          ]
        },
        usersByCountry: {
          labels: stats.value.usersByCountry.map(item => item.country),
          datasets: [
            {
              label: 'Users',
              data: stats.value.usersByCountry.map(item => item.count),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              borderRadius: 6,
              hoverBackgroundColor: 'rgba(59, 130, 246, 1)'
            }
          ]
        }
      };
    });
    
    const isLoading = computed(() => !stats.value && !error.value);
    
    const formatTime = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
      const hours = Math.floor(seconds / 3600);
      if (hours < 24) return `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    };
    
    const loadAnalytics = async () => {
      analyticsLoading.value = true;
      try {
        let url = endpoints.analyticsOverview;
        
        if (dateRangeType.value === 'preset') {
          url += `?days=${selectedPeriod.value}`;
        } else if (dateRangeType.value === 'custom' && customStartDate.value && customEndDate.value) {
          url += `?startDate=${customStartDate.value}&endDate=${customEndDate.value}`;
        } else {
          url += '?days=30';
        }
        
        const response = await api.get(url);
        analytics.value = response.data;
      } catch (error) {
        console.error('Error loading analytics:', error);
        analytics.value = null;
      } finally {
        analyticsLoading.value = false;
      }
    };
    
    const onDateRangeTypeChange = () => {
      if (dateRangeType.value === 'custom') {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        customStartDate.value = thirtyDaysAgo.toISOString().split('T')[0];
        customEndDate.value = today.toISOString().split('T')[0];
      }
      loadAnalytics();
    };
    
    // Load analytics on mount
    loadAnalytics();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1f2937',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            labelPointStyle: () => ({
              pointStyle: 'circle' as const,
              rotation: 0
            })
          }
        }
      }
      // Removed animation property for compatibility with Bar chart options
    };

    return {
      stats,
      chartData,
      chartOptions,
      isLoading,
      error,
      selectedPeriod,
      dateRangeType,
      customStartDate,
      customEndDate,
      analytics,
      analyticsLoading,
      formatTime,
      loadAnalytics,
      onDateRangeTypeChange
    };
  }
});
</script>