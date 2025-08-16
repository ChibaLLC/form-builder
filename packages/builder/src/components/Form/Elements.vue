<script setup lang="ts">
import { useDrag } from "../../composables/drag.ts";
import { computed, ref } from "vue";

const TextIcon = {
  template: '<div class="w-4 h-4 bg-gray-400 rounded"></div>',
};
const EmailIcon = {
  template: '<div class="w-4 h-4 bg-gray-400 rounded-full"></div>',
};
const PhoneIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const DateIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const TextAreaIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const CheckboxIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const NumberIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const RatingIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const FileIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const AddressIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const SelectIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };
const NameIcon = { template: '<div class="w-4 h-4 bg-gray-400"></div>' };

const searchQuery = ref("");
const formElements = [
  { type: "text", label: "Text Input", icon: TextIcon },
  { type: "email", label: "Email", icon: EmailIcon },
  { type: "phone", label: "Phone Number", icon: PhoneIcon },
  { type: "date", label: "Date Picker", icon: DateIcon },
  { type: "longtext", label: "Long Text", icon: TextAreaIcon },
  { type: "checkbox", label: "Check-Box", icon: CheckboxIcon },
  { type: "number", label: "Number", icon: NumberIcon },
  { type: "rating", label: "Rating Scale", icon: RatingIcon },
  { type: "file", label: "File Upload", icon: FileIcon },
  { type: "address", label: "Address", icon: AddressIcon },
  { type: "select", label: "Select", icon: SelectIcon },
  { type: "name", label: "Name", icon: NameIcon },
];
const filteredElements = computed(() => {
  if (!searchQuery.value) return formElements;
  return formElements.filter((element) =>
    element.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});
const { startElementDrag } = useDrag();
</script>
<template>
  <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 mb-4">Form Elements</h3>

      <!-- Search -->
      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Elements"
          class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          class="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Form Elements -->
      <div class="space-y-2">
        <div
          v-for="element in filteredElements"
          :key="element.type"
          class="flex items-center gap-3 p-2 rounded-md border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors bg-white"
          draggable="true"
          @dragstart="startElementDrag($event, element)"
          @dragexit="
            (e) => console.log(e.dataTransfer?.getData('drop-element'))
          "
          @dragend="(e) => console.log(e.dataTransfer?.getData('drop-element'))"
        >
          <span
            class="w-6 h-6 grid place-items-center rounded border border-gray-300 bg-gray-50 text-gray-600"
          >
            <component :is="element.icon" class="w-4 h-4" />
          </span>
          <span class="text-sm font-medium text-gray-700">{{
            element.label
          }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>
