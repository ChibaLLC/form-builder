<script setup lang="ts">
import { useDrag } from "../../composables/drag.ts";
import { computed, ref } from "vue";
import { 
  Type, 
  Mail, 
  Phone, 
  Calendar,
  AlignLeft,
  CheckSquare,
  Hash,
  Star,
  Upload,
  MapPin,
  ChevronDown,
  User,
  Search,
  Grip,
  FileText,
  List,
  CircleDot,
  SlidersHorizontal,
  ToggleLeft,
  Link,
  Clock,
  Square,
  Filter
} from 'lucide-vue-next';

const searchQuery = ref("");
const selectedCategory = ref("All");

const categories = [
  { id: "All", label: "All Fields", count: 0 },
  { id: "Basic", label: "Basic", count: 0 },
  { id: "Input", label: "Input", count: 0 },
  { id: "Selection", label: "Selection", count: 0 },
  { id: "Advanced", label: "Advanced", count: 0 },
];

const formElements = [
  // Basic Text Inputs
  { 
    type: "text", 
    label: "Text Input", 
    icon: Type,
    category: "Basic",
    description: "Single line text field",
    gradient: "from-indigo-50 to-purple-50",
    iconColor: "text-indigo-600"
  },
  { 
    type: "textarea", 
    label: "Text Area", 
    icon: FileText,
    category: "Basic",
    description: "Multi-line text input",
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600"
  },
  { 
    type: "email", 
    label: "Email", 
    icon: Mail,
    category: "Input",
    description: "Email address validation",
    gradient: "from-red-50 to-pink-50",
    iconColor: "text-red-600"
  },
  { 
    type: "phone", 
    label: "Phone", 
    icon: Phone,
    category: "Input",
    description: "Phone number format",
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600"
  },
  { 
    type: "number", 
    label: "Number", 
    icon: Hash,
    category: "Input",
    description: "Numeric input only",
    gradient: "from-blue-50 to-cyan-50",
    iconColor: "text-blue-600"
  },
  { 
    type: "url", 
    label: "URL", 
    icon: Link,
    category: "Input",
    description: "Website URL validation",
    gradient: "from-orange-50 to-amber-50",
    iconColor: "text-orange-600"
  },
  
  // Date & Time
  { 
    type: "date", 
    label: "Date Picker", 
    icon: Calendar,
    category: "Input",
    description: "Calendar date selector",
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600"
  },
  { 
    type: "time", 
    label: "Time Picker", 
    icon: Clock,
    category: "Input",
    description: "Time selection field",
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600"
  },
  
  // Selection Fields
  { 
    type: "select", 
    label: "Dropdown", 
    icon: List,
    category: "Selection",
    description: "Single choice list",
    gradient: "from-purple-50 to-pink-50",
    iconColor: "text-purple-600"
  },
  { 
    type: "radio", 
    label: "Radio Button", 
    icon: CircleDot,
    category: "Selection",
    description: "Single choice options",
    gradient: "from-violet-50 to-purple-50",
    iconColor: "text-violet-600"
  },
  { 
    type: "checkbox", 
    label: "Checkbox", 
    icon: CheckSquare,
    category: "Selection",
    description: "Multiple choice options",
    gradient: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-600"
  },
  { 
    type: "toggle", 
    label: "Toggle Switch", 
    icon: ToggleLeft,
    category: "Selection",
    description: "On/Off boolean switch",
    gradient: "from-teal-50 to-cyan-50",
    iconColor: "text-teal-600"
  },
  
  // Advanced Fields
  { 
    type: "file", 
    label: "File Upload", 
    icon: Upload,
    category: "Advanced",
    description: "Upload documents & images",
    gradient: "from-blue-50 to-cyan-50",
    iconColor: "text-blue-600"
  },
  { 
    type: "rating", 
    label: "Rating Scale", 
    icon: Star,
    category: "Advanced",
    description: "Star rating system",
    gradient: "from-yellow-50 to-orange-50",
    iconColor: "text-yellow-600"
  },
  { 
    type: "range", 
    label: "Number Range", 
    icon: SlidersHorizontal,
    category: "Advanced",
    description: "Slider for number ranges",
    gradient: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600"
  },
];

// Update category counts
categories.forEach(cat => {
  if (cat.id === "All") {
    cat.count = formElements.length;
  } else {
    cat.count = formElements.filter(el => el.category === cat.id).length;
  }
});
const filteredElements = computed(() => {
  let filtered = formElements;
  
  // Filter by category
  if (selectedCategory.value !== "All") {
    filtered = filtered.filter(el => el.category === selectedCategory.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter((element) =>
      element.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      element.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  return filtered;
});

// Group elements by category for display
const groupedElements = computed(() => {
  const groups: Record<string, typeof formElements> = {};
  
  filteredElements.value.forEach(element => {
    if (!groups[element.category]) {
      groups[element.category] = [];
    }
    groups[element.category].push(element);
  });
  
  return groups;
});
const { startElementDrag } = useDrag();
</script>
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Header -->
    <div class="px-4 py-3 bg-white border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-900">Form Elements</h3>
      <p class="text-xs text-gray-500 mt-0.5">Drag elements to add them to your form</p>
    </div>

    <!-- Search Bar -->
    <div class="px-4 py-3 bg-white border-b border-gray-200">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search elements..."
          class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="px-4 py-2 bg-white border-b border-gray-200">
      <div class="flex gap-1 overflow-x-auto">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap',
            selectedCategory === category.id
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ category.label }}
          <span 
            v-if="category.count > 0"
            :class="[
              'ml-1 px-1.5 py-0.5 rounded-full text-xs',
              selectedCategory === category.id
                ? 'bg-green-200 text-green-800'
                : 'bg-gray-200 text-gray-600'
            ]"
          >
            {{ category.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Elements List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Show grouped elements when not searching -->
      <div v-if="!searchQuery && selectedCategory === 'All'" class="">
        <div v-for="(elements, category) in groupedElements" :key="category">
          <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {{ category }}
            </h4>
          </div>
          <div class="">
            <div
              v-for="element in elements"
              :key="element.type"
              draggable="true"
              @dragstart="startElementDrag($event, element)"
              class="group bg-white px-4 py-3 cursor-grab hover:bg-green-50 transition-all border-b border-gray-100 active:cursor-grabbing"
            >
              <div class="flex items-center gap-3">
                <!-- Icon -->
                <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <component 
                    :is="element.icon" 
                    :class="['w-4 h-4', 'text-gray-600 group-hover:text-green-600']"
                  />
                </div>
                
                <!-- Info -->
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">
                    {{ element.label }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ element.description }}
                  </div>
                </div>

                <!-- Drag Indicator -->
                <Grip class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Show flat list when searching or specific category -->
      <div v-else class="">
        <div
          v-for="element in filteredElements"
          :key="element.type"
          draggable="true"
          @dragstart="startElementDrag($event, element)"
          class="group bg-white px-4 py-3 cursor-grab hover:bg-green-50 transition-all border-b border-gray-100 active:cursor-grabbing"
        >
          <div class="flex items-center gap-3">
            <!-- Icon -->
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <component 
                :is="element.icon" 
                :class="['w-4 h-4', 'text-gray-600 group-hover:text-green-600']"
              />
            </div>
            
            <!-- Info -->
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900">
                {{ element.label }}
              </div>
              <div class="text-xs text-gray-500">
                {{ element.description }}
              </div>
            </div>

            <!-- Drag Indicator -->
            <Grip class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div

      <!-- Empty State -->
      <div v-if="filteredElements.length === 0" class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Filter class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-sm font-medium text-gray-900 mb-1">No elements found</h3>
        <p class="text-xs text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    </div>
  </div>
</template>
