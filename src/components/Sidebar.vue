<template>
  <div :class="['bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col shadow-xl transition-all duration-300', isCollapsed ? 'w-20' : 'w-64']">
    <div :class="['p-6 flex items-center', isCollapsed ? 'justify-center' : '']">
      <img src="/src/assets/logo.webp" alt="Uniti" class="w-8 h-8 rounded-lg" :class="isCollapsed ? '' : 'mr-3'" />
      <h1 v-if="!isCollapsed" class="text-xl font-bold text-white">Uniti Admin</h1>
    </div>
    <nav class="flex-1 px-4 py-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        @click.stop
        :class="['flex items-center rounded-lg transition-all duration-200 text-gray-300 hover:text-white', 
          isCollapsed ? 'p-2 justify-center mb-3' : 'py-3 px-4 mb-1',
          { 
            'bg-gradient-to-r from-gray-600 to-gray-700 shadow-md text-white font-medium': isActive(item.path), 
            'hover:bg-gray-700/50 hover:translate-x-1': !isActive(item.path) 
          }
        ]"
        :title="isCollapsed ? item.name : ''"
      >
        <svg :class="['transition-all duration-200', isCollapsed ? 'w-14 h-10' : 'w-5 h-5 mr-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getMenuIcon(item.name)"></svg>
        <span v-if="!isCollapsed">{{ item.name }}</span>
      </router-link>
    </nav>
    <div class="p-4 border-t border-gray-700/50">
      <div v-if="!isCollapsed" class="text-center text-xs text-gray-400 mb-3">
        v{{ version }}
      </div>
      <button @click="toggleCollapse" :class="['w-full py-2.5 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center', isCollapsed ? 'justify-center' : 'justify-center']">
        <svg :class="['transition-transform duration-200', isCollapsed ? 'rotate-180 w-5 h-5' : 'w-4 h-4 mr-2']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        <span v-if="!isCollapsed">Collapse</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import packageJson from '../../package.json';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const route = useRoute();
    const isCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true');
    
    const menuItems = [
      { name: 'Dashboard', path: '/' },
      { name: 'Users', path: '/users' },
      { name: 'Messages', path: '/messages' },
      { name: 'Message Templates', path: '/message-templates' },
      { name: 'Goal Categories', path: '/goal-categories' },
      { name: 'Apps', path: '/apps' },
      { name: 'App Settings', path: '/app-settings' },
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
        'Dashboard': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />',
        'Users': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />',
        'Messages': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />',
        'Message Templates': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
        'Goal Categories': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm8 0h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2z" />',
        'Apps': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />',
        'App Settings': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />',
        'Countries': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
        'Languages': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />',
        'Admin Users': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />'
      };
      return icons[name] || icons['Dashboard'];
    };
    
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };
    
    // Watch for changes and save to localStorage
    watch(isCollapsed, (newValue) => {
      localStorage.setItem('sidebar-collapsed', newValue.toString());
    });
    
    return {
      menuItems,
      isActive,
      getMenuIcon,
      toggleCollapse,
      isCollapsed,
      version: packageJson.version
    };
  }
});
</script>