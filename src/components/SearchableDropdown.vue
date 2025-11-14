<template>
  <div class="relative" ref="dropdownRef">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        @focus="showDropdown = true"
        @input="onSearch"
      />
      <button
        v-if="searchQuery"
        @click="clearSelection"
        class="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
        type="button"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <div v-if="showDropdown" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      <div v-if="loading" class="px-3 py-2 text-sm text-gray-500">Loading...</div>
      <div v-else-if="options.length === 0" class="px-3 py-2 text-sm text-gray-500">No options found</div>
      <div v-else>
        <div
          v-for="option in options"
          :key="(option as any).id"
          @click="selectOption(option as any)"
          class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-primary-50 text-primary-700': selectedValue?.id === (option as any).id }"
        >
          {{ (option as any).name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'SearchableDropdown',
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Search...'
    },
    options: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const showDropdown = ref(false);
    const dropdownRef = ref<HTMLElement>();
    const selectedValue = ref<any>(props.modelValue);

    const selectOption = (option: any) => {
      selectedValue.value = option || {};
      searchQuery.value = option?.name || '';
      showDropdown.value = false;
      emit('update:modelValue', option);
    };

    const onSearch = () => {
      emit('search', searchQuery.value);
    };
    
    const clearSelection = () => {
      searchQuery.value = '';
      selectedValue.value = {} as any;
      showDropdown.value = false;
      emit('update:modelValue', {} as any);
      emit('search', '');
    };

    const handleClickOutside = (event: Event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        showDropdown.value = false;
      }
    };

    watch(() => props.modelValue, (newValue) => {
      selectedValue.value = newValue;
      searchQuery.value = newValue?.name || '';
    });

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      if (props.modelValue) {
        searchQuery.value = props.modelValue.name;
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      searchQuery,
      showDropdown,
      dropdownRef,
      selectedValue,
      selectOption,
      onSearch,
      clearSelection
    };
  }
});
</script>