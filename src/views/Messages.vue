<template>
  <Layout pageTitle="Messages">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
        <button @click="showCreateModal = true" class="btn btn-primary">
          Create Message
        </button>
      </div>

      <!-- Messages List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="message in messages" :key="message.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900">{{ message.subject }}</h3>
                  <div class="flex items-center space-x-2">
                    <span 
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      :class="message.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ message.status }}
                    </span>
                    <span class="text-sm text-gray-500">{{ formatDate(message.createdAt) }}</span>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ message.text.substring(0, 100) }}...</p>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Countries: {{ message.countryCodes.join(', ') }}</span>
                  <span>Channels: {{ message.channels.join(', ') }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <router-link :to="`/messages/${message.id}`" class="btn btn-secondary btn-sm">
                  View Details
                </router-link>
                <button @click="editMessage(message)" class="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button 
                  v-if="message.status === 'draft'" 
                  @click="publishMessage(message.id)" 
                  class="btn btn-primary btn-sm"
                >
                  Publish
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showEditModal ? 'Edit Message' : 'Create Message' }}
            </h3>
            
            <form @submit.prevent="showEditModal ? updateMessage() : createMessage()">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Subject</label>
                  <input v-model="formData.subject" type="text" class="input mt-1" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <textarea v-model="formData.text" rows="4" class="input mt-1" required></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">From</label>
                  <input v-model="formData.from" type="text" class="input mt-1" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select v-model="formData.type" class="input mt-1" required>
                    <option value="system">System</option>
                    <option value="coach">Coach</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Countries</label>
                  <div class="mt-1 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                    <label v-for="country in countries" :key="country.code" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :value="country.code" 
                        v-model="formData.countryCodes"
                        class="mr-2"
                      >
                      {{ country.name }}
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Channels</label>
                  <div class="mt-1 space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox" value="app" v-model="formData.channels" class="mr-2" disabled checked>
                      App (Always included)
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" value="WhatsApp" v-model="formData.channels" class="mr-2">
                      WhatsApp
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select v-model="formData.status" class="input mt-1" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end space-x-3">
                <button type="button" @click="closeModal" class="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="formSubmitting">
                  {{ showEditModal ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { api } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'Messages',
  components: { Layout },
  setup() {
    const messages = ref<any[]>([]);
    const countries = ref<any[]>([]);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const formSubmitting = ref(false);
    const formData = ref<any>({
      subject: '',
      text: '',
      from: '',
      type: 'system',
      channels: ['app'],
      countryCodes: [],
      status: 'draft'
    });

    const loadMessages = async () => {
      try {
        const response = await api.get('/messages');
        messages.value = response.data;
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    const loadCountries = async () => {
      try {
        const response = await api.get('/countries');
        countries.value = response.data;
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    };

    const createMessage = async () => {
      formSubmitting.value = true;
      try {
        await api.post('/messages', formData.value);
        await loadMessages();
        closeModal();
      } catch (error) {
        console.error('Failed to create message:', error);
      } finally {
        formSubmitting.value = false;
      }
    };

    const editMessage = (message: any) => {
      formData.value = { ...message };
      showEditModal.value = true;
    };

    const updateMessage = async () => {
      formSubmitting.value = true;
      try {
        await api.patch(`/messages/${formData.value.id}`, formData.value);
        await loadMessages();
        closeModal();
      } catch (error) {
        console.error('Failed to update message:', error);
      } finally {
        formSubmitting.value = false;
      }
    };

    const publishMessage = async (id: string) => {
      try {
        await api.post(`/messages/${id}/publish`);
        await loadMessages();
      } catch (error) {
        console.error('Failed to publish message:', error);
      }
    };

    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      formData.value = {
        id: undefined,
        subject: '',
        text: '',
        from: '',
        type: 'system',
        channels: ['app'],
        countryCodes: [],
        status: 'draft'
      };
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      loadMessages();
      loadCountries();
    });

    return {
      messages,
      countries,
      showCreateModal,
      showEditModal,
      formSubmitting,
      formData,
      createMessage,
      editMessage,
      updateMessage,
      publishMessage,
      closeModal,
      formatDate
    };
  }
});
</script>