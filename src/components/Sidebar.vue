<template>
  <div class="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen flex flex-col shadow-xl">
    <div class="p-6 flex items-center">
      <div class="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center mr-3">
        <span class="font-bold">U</span>
      </div>
      <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-400">Uniti Admin</h1>
    </div>
    <nav class="flex-1 px-4 py-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        class="flex items-center py-3 px-4 rounded-lg transition-all duration-200 mb-1 text-gray-300 hover:text-white"
        :class="{ 
          'bg-gradient-to-r from-primary-600 to-primary-700 shadow-md text-white font-medium': isActive(item.path), 
          'hover:bg-gray-700/50 hover:translate-x-1': !isActive(item.path) 
        }"
      >
        <span class="menu-icon mr-3">{{ getMenuIcon(item.name) }}</span>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
    <div class="p-4 border-t border-gray-700/50">
      <button @click="logout" class="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
        <span class="mr-2">⟲</span>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/services/auth';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { logout: authLogout } = useAuth();
    
    const menuItems = [
      { name: 'Dashboard', path: '/' },
      { name: 'Users', path: '/users' },
      { name: 'Messages', path: '/messages' },
      { name: 'Goal Categories', path: '/goal-categories' },
      { name: 'Apps', path: '/apps' },
      { name: 'Countries', path: '/countries' },
      { name: 'Languages', path: '/languages' },
      { name: 'Admin Users', path: '/admin' },
    ];
    
    const isActive = (path: string) => {
      if (path === '/') {
        return route.path === '/';
      }
      return route.path.startsWith(path);
    };
    
    const getMenuIcon = (name: string) => {
      const icons: Record<string, string> = {
        'Dashboard': '📊',
        'Users': '👥',
        'Messages': '💬',
        'Goal Categories': '📋',
        'Apps': '📱',
        'Countries': '🌎',
        'Languages': '🗣️',
        'Admin Users': '🔑',
      };
      return icons[name] || '📄';
    };
    
    const logout = () => {
      authLogout();
      router.push('/login');
    };
    
    return {
      menuItems,
      isActive,
      logout,
      getMenuIcon
    };
  }
});
</script>