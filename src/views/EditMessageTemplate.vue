<template>
  <Layout pageTitle="Edit Message Template">
    <div class="mb-6">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <router-link to="/message-templates" class="text-gray-400 hover:text-gray-500">
              Message Templates
            </router-link>
          </li>
          <li>
            <span class="text-gray-400">/</span>
          </li>
          <li>
            <span class="text-gray-900">Edit Template</span>
          </li>
        </ol>
      </nav>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <p class="text-gray-500">Loading template...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Edit Message Template</h2>
      </div>
      
      <form @submit.prevent="updateTemplate" class="p-6">
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
              <input v-model="formData.title" type="text" required 
                     :class="['input mt-1', errors.title ? 'border-red-500 focus:border-red-500' : '']" />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <input v-model="formData.category" type="text" class="input mt-1" placeholder="e.g., welcome, reminder" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Subject (English) <span class="text-red-500">*</span></label>
            <input v-model="formData.subject" type="text" required 
                   :class="['input mt-1', errors.subject ? 'border-red-500 focus:border-red-500' : '']"
                   placeholder="Welcome to Uniti, {{ user_name }}!" />
            <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Content (English) <span class="text-red-500">*</span></label>
            <textarea v-model="formData.content" rows="4" required 
                      :class="['input mt-1', errors.content ? 'border-red-500 focus:border-red-500' : '']"
                      placeholder="Use {{ user_name }} for placeholders"></textarea>
            <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Video URL (English)</label>
              <input v-model="formData.videoUrls.en" type="url" class="input mt-1" 
                     placeholder="https://www.youtube.com/watch?v=..." />
              <div v-if="formData.videoUrls.en" class="mt-3">
                <iframe :src="getYouTubeEmbedUrl(formData.videoUrls.en)" 
                        class="w-full h-48 rounded-lg" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Audio File (English)</label>
              <div class="space-y-2">
                <input type="file" accept="audio/*" @change="(e) => handleAudioUpload(e, 'en')" class="input" />
                <div v-if="formData.audioUrls.en" class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Audio Preview</span>
                    <button type="button" @click="removeAudio('en')" 
                            class="text-sm text-red-600 hover:text-red-800">Remove</button>
                  </div>
                  <audio controls class="w-full">
                    <source :src="formData.audioUrls.en" type="audio/mpeg">
                  </audio>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Translations</label>
            <div v-for="lang in getTranslationLanguages()" :key="lang" class="mb-4 p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-900">{{ lang.toUpperCase() }}</h4>
                <button type="button" @click="removeTranslation(lang)" class="btn bg-red-500 text-white px-3 py-1 text-sm">
                  Remove
                </button>
              </div>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Subject</label>
                  <input v-model="formData.subjectTranslations[lang]" type="text" class="input" 
                         :placeholder="`${lang.toUpperCase()} subject translation`" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Content</label>
                  <textarea v-model="formData.translations[lang]" rows="3" class="input" 
                            :placeholder="`${lang.toUpperCase()} content translation`"></textarea>
                </div>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Video URL</label>
                    <input v-model="formData.videoUrls[lang]" type="url" class="input" 
                           :placeholder="`${lang.toUpperCase()} YouTube URL`" />
                    <div v-if="formData.videoUrls[lang]" class="mt-2">
                      <iframe :src="getYouTubeEmbedUrl(formData.videoUrls[lang])" 
                              class="w-full h-32 rounded" frameborder="0" allowfullscreen></iframe>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Audio File</label>
                    <input type="file" accept="audio/*" @change="(e) => handleAudioUpload(e, lang)" class="input" />
                    <div v-if="formData.audioUrls[lang]" class="mt-2 p-2 bg-gray-50 rounded">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-medium text-gray-700">Audio Preview</span>
                        <button type="button" @click="removeAudio(lang)" 
                                class="text-xs text-red-600 hover:text-red-800">Remove</button>
                      </div>
                      <audio controls class="w-full h-8">
                        <source :src="formData.audioUrls[lang]" type="audio/mpeg">
                      </audio>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <select v-model="newLang" class="input">
                <option value="">Add translation</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="tw">Twi</option>
              </select>
              <button type="button" @click="addTranslation" class="btn btn-secondary">Add</button>
            </div>
          </div>
          

          
          <div class="flex items-center">
            <input v-model="formData.isActive" type="checkbox" class="mr-2" />
            <label class="text-sm font-medium text-gray-700">Active</label>
          </div>
        </div>
        
        <div class="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <router-link to="/message-templates" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Updating...' : 'Update Template' }}
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import swrv from 'swrv';
import { api, endpoints, MessageTemplate } from '@/services/api';
import Layout from '@/components/Layout.vue';

export default defineComponent({
  name: 'EditMessageTemplate',
  components: { Layout },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const templateId = route.params.id as string;
    const isSubmitting = ref(false);
    const newLang = ref('');
    
    const { data: template, error, isValidating: isLoading } = swrv<MessageTemplate>(
      endpoints.messageTemplate(templateId),
      () => api.get(endpoints.messageTemplate(templateId)).then(res => res.data)
    );
    
    const formData = reactive({
      title: '',
      subject: '',
      content: '',
      category: '',
      videoUrls: { en: '' } as Record<string, string>,
      audioUrls: { en: '' } as Record<string, string>,
      translations: {} as Record<string, string>,
      subjectTranslations: {} as Record<string, string>,
      isActive: true
    });
    
    const errors = reactive({
      title: '',
      subject: '',
      content: ''
    });
    
    // Populate form when template loads
    onMounted(() => {
      if (template.value) {
        formData.title = template.value.title;
        formData.subject = template.value.subject;
        formData.content = template.value.content;
        formData.category = template.value.category || '';
        formData.videoUrls = template.value.videoUrls ? { ...template.value.videoUrls } : { en: '' };
        formData.audioUrls = template.value.audioUrls ? { ...template.value.audioUrls } : { en: '' };
        formData.translations = template.value.translations ? { ...template.value.translations } : {};
        formData.subjectTranslations = template.value.subjectTranslations ? { ...template.value.subjectTranslations } : {};
        formData.isActive = template.value.isActive;
      }
    });
    
    // Watch for template changes
    const updateFormData = () => {
      if (template.value) {
        formData.title = template.value.title;
        formData.subject = template.value.subject;
        formData.content = template.value.content;
        formData.category = template.value.category || '';
        formData.videoUrls = template.value.videoUrls ? { ...template.value.videoUrls } : { en: '' };
        formData.audioUrls = template.value.audioUrls ? { ...template.value.audioUrls } : { en: '' };
        formData.translations = template.value.translations ? { ...template.value.translations } : {};
        formData.subjectTranslations = template.value.subjectTranslations ? { ...template.value.subjectTranslations } : {};
        formData.isActive = template.value.isActive;
      }
    };
    
    // Update form when template loads
    if (template.value) {
      updateFormData();
    }
    
    const getTranslationLanguages = () => {
      const languages = new Set([
        ...Object.keys(formData.translations),
        ...Object.keys(formData.subjectTranslations)
      ]);
      return Array.from(languages).sort();
    };
    
    const addTranslation = () => {
      if (newLang.value && !formData.translations[newLang.value]) {
        formData.translations[newLang.value] = '';
        formData.subjectTranslations[newLang.value] = '';
        newLang.value = '';
      }
    };
    
    const removeTranslation = (lang: string) => {
      delete formData.translations[lang];
      delete formData.subjectTranslations[lang];
    };
    
    const validateForm = () => {
      errors.title = formData.title.trim() ? '' : 'Title is required';
      errors.subject = formData.subject.trim() ? '' : 'Subject is required';
      errors.content = formData.content.trim() ? '' : 'Content is required';
      
      return !errors.title && !errors.subject && !errors.content;
    };
    
    const handleAudioUpload = async (event: Event, languageCode: string) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      
      try {
        const audioFormData = new FormData();
        audioFormData.append('audioFile', file);
        const response = await api.post(`${endpoints.messageTemplates}/${templateId}/upload-audio/${languageCode}`, audioFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Update form data with new audio URL
        if (!formData.audioUrls) formData.audioUrls = {};
        formData.audioUrls[languageCode] = response.data.audioUrls[languageCode];
        
        // Clear the file input
        target.value = '';
      } catch (error) {
        console.error('Audio upload failed:', error);
        alert('Failed to upload audio');
      }
    };
    
    const removeAudio = async (languageCode: string) => {
      formData.audioUrls[languageCode] = '';
      
      // Update the template on server
      try {
        await api.patch(endpoints.messageTemplate(templateId), {
          audioUrls: formData.audioUrls
        });
      } catch (error) {
        console.error('Failed to remove audio:', error);
      }
    };
    
    const getAudioFileName = (languageCode: string) => {
      if (!formData.audioUrls[languageCode]) return '';
      return formData.audioUrls[languageCode].split('/').pop() || 'Audio file';
    };
    
    const updateTemplate = async () => {
      if (!validateForm()) return;
      
      try {
        isSubmitting.value = true;
        await api.patch(endpoints.messageTemplate(templateId), {
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          category: formData.category,
          videoUrls: formData.videoUrls,
          audioUrls: formData.audioUrls,
          translations: formData.translations,
          subjectTranslations: formData.subjectTranslations,
          isActive: formData.isActive
        });
        router.push('/message-templates');
      } catch (err) {
        console.error('Failed to update template:', err);
        alert('Failed to update template');
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const getYouTubeEmbedUrl = (url: string) => {
      if (!url) return '';
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
    };
    
    return {
      template,
      error,
      isLoading,
      formData,
      errors,
      newLang,
      isSubmitting,
      getTranslationLanguages,
      addTranslation,
      removeTranslation,
      handleAudioUpload,
      removeAudio,
      getAudioFileName,
      getYouTubeEmbedUrl,
      updateTemplate,
      updateFormData
    };
  },
  watch: {
    'template'(newTemplate) {
      if (newTemplate) {
        this.updateFormData();
      }
    }
  }
});
</script>