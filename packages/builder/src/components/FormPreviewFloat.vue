<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { X, Maximize2, Minimize2, Smartphone, Tablet, Monitor, Move } from 'lucide-vue-next';
import FormRenderer from './FormRenderer.vue';
import Button from './ui/Button.vue';
import type { FormSchema, Store as StoreType } from '@/types';

interface Props {
  form: FormSchema;
  stores?: StoreType[];
  position?: { x: number; y: number };
}

const props = withDefaults(defineProps<Props>(), {
  stores: () => [],
  position: () => ({ x: window.innerWidth - 520, y: 100 }),
});

const emit = defineEmits<{
  close: [];
}>();

// State
const previewRef = ref<HTMLDivElement>();
const isDragging = ref(false);
const isFullscreen = ref(false);
const deviceMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
const position = ref({ ...props.position });
const dragStart = ref({ x: 0, y: 0 });

// Device dimensions
const deviceSizes = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '375px', height: '667px', label: 'Mobile' },
};

// Computed styles
const previewStyles = computed(() => {
  if (isFullscreen.value) {
    return {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: 9999,
    };
  }
  
  return {
    position: 'fixed',
    top: `${position.value.y}px`,
    left: `${position.value.x}px`,
    width: '500px',
    height: '700px',
    zIndex: 9999,
  };
});

const contentStyles = computed(() => {
  if (isFullscreen.value) {
    return {};
  }
  
  const device = deviceSizes[deviceMode.value];
  return {
    maxWidth: device.width,
    height: deviceMode.value === 'desktop' ? '100%' : device.height,
    margin: '0 auto',
  };
});

// Drag functionality
const startDrag = (e: MouseEvent) => {
  if (isFullscreen.value) return;
  
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  
  position.value = {
    x: Math.max(0, Math.min(window.innerWidth - 500, e.clientX - dragStart.value.x)),
    y: Math.max(0, Math.min(window.innerHeight - 700, e.clientY - dragStart.value.y)),
  };
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const setDeviceMode = (mode: 'desktop' | 'tablet' | 'mobile') => {
  deviceMode.value = mode;
};

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !isFullscreen.value) {
    emit('close');
  }
  if (e.key === 'F11') {
    e.preventDefault();
    toggleFullscreen();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  stopDrag();
});
</script>

<template>
  <div
    ref="previewRef"
    :style="previewStyles"
    :class="[
      'bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all',
      isDragging && 'cursor-move select-none',
      !isFullscreen && 'resize-none'
    ]"
  >
    <!-- Header -->
    <div 
      class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200"
      :class="!isFullscreen && 'cursor-move'"
      @mousedown="startDrag"
    >
      <div class="flex items-center gap-3">
        <Move v-if="!isFullscreen" class="w-4 h-4 text-slate-400" />
        <h3 class="font-semibold text-sm text-slate-900">Form Preview</h3>
        <div class="flex items-center gap-1 ml-4">
          <button
            v-for="(device, key) in deviceSizes"
            :key="key"
            @click="setDeviceMode(key as any)"
            :class="[
              'p-2 rounded-lg transition-all',
              deviceMode === key 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'hover:bg-slate-100 text-slate-500'
            ]"
            :title="device.label"
          >
            <component 
              :is="key === 'desktop' ? Monitor : key === 'tablet' ? Tablet : Smartphone"
              class="w-4 h-4"
            />
          </button>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="toggleFullscreen"
          class="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
          <component 
            :is="isFullscreen ? Minimize2 : Maximize2"
            class="w-4 h-4 text-slate-600"
          />
        </button>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          title="Close preview (Esc)"
        >
          <X class="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>

    <!-- Device Frame -->
    <div class="flex-1 overflow-hidden bg-slate-50 p-4">
      <div
        :style="contentStyles"
        :class="[
          'bg-white h-full overflow-auto transition-all duration-300',
          deviceMode !== 'desktop' && 'rounded-lg shadow-lg border border-slate-200'
        ]"
      >
        <!-- Form Content -->
        <div class="p-6">
          <FormRenderer :form="form" :stores="stores" />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-4 py-3 bg-slate-50 border-t border-slate-200">
      <div class="flex items-center justify-between">
        <div class="text-xs text-slate-500">
          <span class="font-medium">Device:</span> {{ deviceSizes[deviceMode].label }}
          <span class="ml-3">{{ deviceSizes[deviceMode].width }} × {{ deviceSizes[deviceMode].height }}</span>
        </div>
        <div class="flex gap-2">
          <Button size="sm" variant="outline" @click="$emit('close')">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Backdrop for fullscreen -->
  <div
    v-if="isFullscreen"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm"
    style="z-index: 9998"
    @click="isFullscreen = false"
  />
</template>
