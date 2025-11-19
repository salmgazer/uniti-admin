<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Message Queue</h1>
    <div class="bg-white p-4 rounded shadow">
      <p>Message Queue monitoring will be displayed here.</p>
      <button @click="testApi" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Test API Connection
      </button>
      <div v-if="testResult" class="mt-4 p-2 bg-gray-100 rounded">
        {{ testResult }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';

const testResult = ref('');

const testApi = async () => {
  try {
    const response = await api.get('/admin/message-queue/stats');
    testResult.value = `Success: ${JSON.stringify(response.data)}`;
  } catch (error) {
    testResult.value = `Error: ${error}`;
  }
};
</script>