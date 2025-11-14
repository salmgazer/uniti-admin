<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />
    <div class="flex-1 overflow-auto">
      <header class="bg-white shadow-sm py-3 px-5 sticky top-0 z-10">
        <div class="flex justify-end items-center max-w-7xl mx-auto">
          <h1 class="text-xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            <!-- {{ title }} -->
          </h1>
          <div class="flex items-center relative">
            <div 
              @click="showDropdown = !showDropdown"
              class="bg-gray-100 rounded-full px-3 py-2 flex items-center cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <div class="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2 font-medium text-sm">
                {{ currentUser?.name?.[0] || 'U' }}
              </div>
              <div class="text-sm font-medium text-gray-700">
                {{ currentUser?.name }} 
                <span class="text-xs text-gray-500 ml-1">({{ currentUser?.role }})</span>
              </div>
              <svg class="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div v-if="showDropdown" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <router-link 
                to="/profile" 
                @click="showDropdown = false"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </router-link>
              <button 
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="px-12 py-6">
        <div class="transition-all duration-300 ease-in-out">
          <slot></slot>
        </div>
      </main>
    </div>
    <ToastContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from './Sidebar.vue';
import ToastContainer from './ToastContainer.vue';
import { useAuth } from '@/services/auth';

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    ToastContainer
  },
  props: {
    pageTitle: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { currentUser, logout } = useAuth();
    const showDropdown = ref(false);
    
    const title = computed(() => {
      return props.pageTitle || route.name?.toString() || '';
    });
    
    const handleLogout = () => {
      logout();
      router.push('/login');
      showDropdown.value = false;
    };
    
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        showDropdown.value = false;
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      title,
      currentUser,
      showDropdown,
      handleLogout
    };
  }
});
</script>