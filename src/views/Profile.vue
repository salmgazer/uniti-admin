<template>
  <Layout pageTitle="Profile">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-6">Profile Settings</h2>
        
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input 
                id="name" 
                v-model="formData.name" 
                type="text" 
                required 
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                id="email" 
                v-model="formData.email" 
                type="email" 
                required 
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              {{ currentUser?.role }}
            </div>
          </div>
          
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium mb-4">Change Password</h3>
            
            <div class="space-y-4">
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input 
                  id="currentPassword" 
                  v-model="formData.currentPassword" 
                  type="password" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input 
                  id="newPassword" 
                  v-model="formData.newPassword" 
                  type="password" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input 
                  id="confirmPassword" 
                  v-model="formData.confirmPassword" 
                  type="password" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
          
          <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Profile updated successfully!
          </div>
          
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span v-else>Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { api, endpoints } from '@/services/api';
import Layout from '@/components/Layout.vue';
import { useAuth } from '@/services/auth';

export default defineComponent({
  name: 'Profile',
  components: {
    Layout
  },
  setup() {
    const { currentUser } = useAuth();
    const isSubmitting = ref(false);
    const error = ref('');
    const success = ref(false);
    
    const formData = reactive({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    const updateProfile = async () => {
      if (!currentUser.value) return;
      
      error.value = '';
      success.value = false;
      
      // Validate password fields if any are filled
      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          error.value = 'Current password is required to change password';
          return;
        }
        if (!formData.newPassword) {
          error.value = 'New password is required';
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          error.value = 'New passwords do not match';
          return;
        }
        if (formData.newPassword.length < 6) {
          error.value = 'New password must be at least 6 characters';
          return;
        }
      }
      
      try {
        isSubmitting.value = true;
        
        const updateData: any = {
          name: formData.name,
          email: formData.email
        };
        
        // Only include password if changing
        if (formData.newPassword) {
          updateData.password = formData.newPassword;
        }
        
        await api.patch(endpoints.adminUser(currentUser.value.id), updateData);
        
        // Clear password fields
        formData.currentPassword = '';
        formData.newPassword = '';
        formData.confirmPassword = '';
        
        success.value = true;
        setTimeout(() => {
          success.value = false;
        }, 3000);
        
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to update profile';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(() => {
      if (currentUser.value) {
        formData.name = currentUser.value.name;
        formData.email = currentUser.value.email;
      }
    });
    
    return {
      currentUser,
      formData,
      isSubmitting,
      error,
      success,
      updateProfile
    };
  }
});
</script>