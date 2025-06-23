<template>
  <Layout pageTitle="Dashboard">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-white to-gray-50 border-l-4 border-primary-500 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Users</h3>
            <p class="text-3xl font-bold text-gray-800">{{ stats?.totalUsers || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl">
            👥
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 border-l-4 border-green-500 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Active Users</h3>
            <p class="text-3xl font-bold text-gray-800">{{ stats?.activeUsers || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
            ✓
          </div>
        </div>
      </div>
      <div class="card bg-gradient-to-br from-white to-gray-50 border-l-4 border-purple-500 hover:translate-y-[-5px] transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Apps</h3>
            <p class="text-3xl font-bold text-gray-800">{{ stats?.totalApps || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
            📱
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
  </Layout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
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
      error
    };
  }
});
</script>