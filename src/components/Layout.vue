<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />
    <div class="flex-1 overflow-auto">
      <header class="bg-white shadow-sm p-5 sticky top-0 z-10">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            {{ title }}
          </h1>
          <div class="flex items-center">
            <div class="bg-gray-100 rounded-full px-4 py-2 flex items-center">
              <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 font-medium">
                {{ currentUser?.name?.[0] || 'U' }}
              </div>
              <div class="text-sm font-medium text-gray-700">
                {{ currentUser?.name }} 
                <span class="text-xs text-gray-500 ml-1">({{ currentUser?.role }})</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="p-6 max-w-7xl mx-auto">
        <div class="transition-all duration-300 ease-in-out">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue';
import { useAuth } from '@/services/auth';

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar
  },
  props: {
    pageTitle: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const route = useRoute();
    const { currentUser } = useAuth();
    
    const title = computed(() => {
      return props.pageTitle || route.name?.toString() || '';
    });
    
    return {
      title,
      currentUser
    };
  }
});
</script>