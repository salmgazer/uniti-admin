import { ref } from 'vue';
import { api, endpoints, LoginCredentials, AdminUser } from './api';

const currentUser = ref<AdminUser | null>(null);
const isAuthenticated = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

export const useAuth = () => {
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await api.post(endpoints.login, credentials);
      const { token, admin } = response.data;
      
      // Verify this is an admin token
      if (!admin || !admin.role) {
        error.value = 'Invalid admin credentials';
        return { success: false, error: error.value };
      }
      
      localStorage.setItem('token', token);
      currentUser.value = admin;
      isAuthenticated.value = true;
      
      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    currentUser.value = null;
    isAuthenticated.value = false;
  };
  
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      isAuthenticated.value = false;
      return false;
    }
    
    try {
      // Get current authenticated admin user
      const response = await api.get(`${endpoints.adminUsers}/me`);
      if (response.data) {
        currentUser.value = response.data;
        isAuthenticated.value = true;
        return true;
      }
      
      return false;
    } catch (err) {
      logout();
      return false;
    }
  };
  
  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };
};