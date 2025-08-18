<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  Eye,
  FileJson,
  Upload,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import Button from './Button.vue';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  collapsed?: boolean;
}

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsed: false,
});

const emit = defineEmits<{
  'update:activeTab': [value: string];
  'toggle-preview': [];
  'export-form': [];
  'import-form': [];
  'toggle-collapse': [];
}>();

const isCollapsed = ref(props.collapsed);

const menuItems = [
  { 
    id: 'builder', 
    label: 'Form Builder', 
    icon: LayoutDashboard,
    description: 'Design your form'
  },
  { 
    id: 'store', 
    label: 'Store & Products', 
    icon: ShoppingBag,
    description: 'Manage products'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'Form configuration'
  },
];

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse');
};
</script>

<template>
  <aside
    :class="cn(
      'relative flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-72'
    )"
  >
    <!-- Logo/Header -->
    <div class="px-6 py-6 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <div v-if="!isCollapsed" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="font-bold text-lg text-slate-900">Form Builder</h1>
            <p class="text-xs text-slate-500">Create beautiful forms</p>
          </div>
        </div>
        <div v-else class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
          <LayoutDashboard class="w-5 h-5 text-white" />
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <button
        v-for="item in menuItems"
        :key="item.id"
        @click="$emit('update:activeTab', item.id)"
        :class="cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group',
          activeTab === item.id
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100'
            : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
        )"
      >
        <component 
          :is="item.icon" 
          :class="cn(
            'flex-shrink-0 transition-colors',
            activeTab === item.id ? 'w-5 h-5 text-indigo-600' : 'w-5 h-5'
          )"
        />
        <div v-if="!isCollapsed" class="text-left flex-1">
          <div class="font-medium text-sm">{{ item.label }}</div>
          <div v-if="activeTab !== item.id" class="text-xs text-slate-500 mt-0.5">
            {{ item.description }}
          </div>
        </div>
      </button>
    </nav>

    <!-- Actions -->
    <div class="px-4 pb-6 space-y-2 border-t border-slate-200 pt-6">
      <Button
        variant="outline"
        :size="isCollapsed ? 'icon' : 'default'"
        class="w-full justify-start"
        @click="$emit('toggle-preview')"
      >
        <Eye class="w-4 h-4" />
        <span v-if="!isCollapsed" class="ml-2">Preview Form</span>
      </Button>
      
      <div v-if="!isCollapsed" class="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          class="flex-1"
          @click="$emit('export-form')"
        >
          <FileJson class="w-4 h-4" />
          <span class="ml-1">Export</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="flex-1"
          @click="$emit('import-form')"
        >
          <Upload class="w-4 h-4" />
          <span class="ml-1">Import</span>
        </Button>
      </div>
    </div>

    <!-- Collapse Toggle -->
    <button
      @click="toggleCollapse"
      class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110"
    >
      <component 
        :is="isCollapsed ? ChevronRight : ChevronLeft" 
        class="w-3 h-3 text-slate-600"
      />
    </button>
  </aside>
</template>
