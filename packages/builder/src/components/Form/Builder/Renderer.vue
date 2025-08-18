<script setup lang="ts">
import DatePickerField from "../../Fields/DatePickerField.vue";
import RatingScaleField from "../../Fields/RatingScaleField.vue";
import SelectField from "../../Fields/SelectField.vue";
import TextAreaField from "../../Fields/TextAreaField.vue";
import TextInputField from "../../Fields/TextInputField.vue";
import CheckboxField from "../../Fields/CheckboxField.vue";
import RadioButtonField from "../../Fields/RadioButtonField.vue";
import FileUploadField from "../../Fields/FileUploadField.vue";
import NumberRangeField from "../../Fields/NumberRangeField.vue";
import ToggleSwitchField from "../../Fields/ToggleSwitchField.vue";
import {
  useFieldDrag,
  useGridLayoutDrag,
  usePageDrag,
} from "../../../composables/drag";
import type { FormField, FormSchema, PageSchema } from "@/types";
import { onMounted, ref, toRef, type Component } from "vue";
import Properties from "../Element/Properties.vue";

function getFieldComponent(fieldType: string) {
  const components: Record<any, Component> = {
    text: TextInputField,
    email: TextInputField,
    phone: TextInputField,
    name: TextInputField,
    number: TextInputField,
    url: TextInputField,
    textarea: TextAreaField,
    longtext: TextAreaField,
    date: DatePickerField,
    time: DatePickerField,
    select: SelectField,
    checkbox: CheckboxField,
    radio: RadioButtonField,
    toggle: ToggleSwitchField,
    rating: RatingScaleField,
    file: FileUploadField,
    range: NumberRangeField,
  };

  return components[fieldType] || TextInputField;
}
const props = defineProps<{
  form: FormSchema;
}>();

const emits = defineEmits<{
  "select-field": [field: FormField];
}>();
const currentPage = ref<PageSchema>(props.form.pages[0]);
const selectedField = ref<FormField | null>(null);
const { startPageDrag, stopPageDrag } = usePageDrag(
  toRef<PageSchema[]>(props.form.pages),
);
const { startFieldDrag, dropField } = useFieldDrag(currentPage);
const { layoutDragEnter, layoutDrop } = useGridLayoutDrag(currentPage);

// Functions
const switchToPage = (page: PageSchema) => {
  currentPage.value = page;
};
const selectField = (field: FormField) => {
  emits("select-field", field);
  selectedField.value = field;
};

const removeField = (index: number) => {
  if (index > -1) {
    currentPage.value.fields.splice(index, 1);
  }
};

const updateField = (index: number, updatedField: FormField) => {
  if (index > -1 && index < currentPage.value.fields.length) {
    currentPage.value.fields[index] = updatedField;
  }
};
const addNewPage = () => {
  const newPage = {
    id: props.form.pages.length + 1,
    title: "",
    description: "",
    fields: [],
  } as PageSchema;
  props.form.pages.push(newPage);
  switchToPage(newPage);
};
const removePage = (pageId: number) => {
  if (props.form.pages.length <= 1) {
    alert("You must have at least one page.");
    return;
  }

  if (
    confirm("Are you sure you want to delete this page and all its fields?")
  ) {
    const index = props.form.pages.findIndex((page) => page.id === pageId);
    if (index > -1) {
      props.form.pages.splice(index, 1);
      if (currentPage.value.id === pageId) {
        currentPage.value = props.form.pages[0] || 1;
        switchToPage(currentPage.value);
      }
    }
  }
};
const clearCanvas = () => {
  currentPage.value.fields = [];
};
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      selectedField.value = null;
    }
  });
});
</script>
<template>
  <main class="flex-1 overflow-y-auto bg-gray-50">
    <section class="p-6">
      <!-- Page Tabs -->
      <div class="bg-white rounded-lg border border-gray-200 mb-6">
        <div class="flex items-center gap-2 p-4 border-b border-gray-200">
          <span class="text-sm font-medium text-gray-700 mr-2">Pages:</span>
          <div class="flex items-center gap-2 overflow-x-auto flex-1">
            <div
              v-for="(page, index) in form.pages"
              :key="page.id"
              class="flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors group"
              :class="{
                'border-blue-500 bg-blue-50 text-blue-700':
                  currentPage.id === page.id,
                'border-gray-200 bg-white hover:bg-gray-50':
                  currentPage.id !== page.id,
              }"
              draggable="true"
              @click="switchToPage(page)"
              @dragstart="startPageDrag($event, page, index)"
              @drop.prevent="stopPageDrag($event, index)"
            >
              <svg
                class="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>

              <span class="text-sm font-medium whitespace-nowrap">{{
                page.title || `Page ${page.id}`
              }}</span>
              <span
                class="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600"
                >{{ page.fields.length }}</span
              >

              <!-- Close button -->
              <button
                v-if="form.pages.length > 1"
                @click.stop="removePage(page.id)"
                class="w-4 h-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div>
              <button @click.prevent="addNewPage()">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Header -->
      <div class="flex items-center gap-4 mb-6">
        <input
          v-model="currentPage.title"
          type="text"
          placeholder="Enter Page Title"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Canvas wrapper with floating actions -->
      <div class="relative">
        <!-- centered page status pill -->
        <div class="flex justify-center mb-4">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs"
          >
            Page {{ currentPage.title }} ({{ currentPage.fields.length }}
            fields)
          </span>
        </div>

        <!-- top-right clear canvas button -->
        <button
          class="absolute -top-2 right-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="Clear page"
          @click="clearCanvas"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 7h12m-9 4v6m6-6v6M9 7l1-2h4l1 2m-1 0l-1 12a2 2 0 01-2 2h-2a2 2 0 01-2-2L8 7"
            />
          </svg>
        </button>

        <!-- Grid Layout Container -->
        <div
          class="min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white/40 relative"
          ref="dropZone"
          @dragover="
            (e) => {
              e.preventDefault();
            }
          "
          @dragenter="layoutDragEnter($event)"
          @drop="layoutDrop"
        >
          <div
            v-if="currentPage.fields.length > 0"
            class="grid gap-2 min-h-full"
          >
            <div
              v-for="(field, fieldIndex) in currentPage.fields"
              :key="field.id"
              class="group relative"
              @click="selectField(field)"
              draggable="true"
              @dragstart="startFieldDrag($event, field, fieldIndex)"
              @drop.prevent="dropField($event, fieldIndex)"
            >
              <div class="relative">
                <component
                  :is="getFieldComponent(field.type)"
                  :field="field"
                  :is-selected="selectedField && selectedField.id === field.id"
                  :mode="'builder'"
                  @update:field="(updatedField) => updateField(fieldIndex, updatedField)"
                />

                <button
                  v-if="selectedField && selectedField.id === field.id"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  @click.stop="removeField(fieldIndex)"
                >
                  <svg
                    class="w-3 h-3 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State (when no fields) -->
          <template v-if="currentPage.fields.length === 0">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <svg
                  class="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Start building your form
                </h3>
                <p class="text-gray-500">
                  Drag form elements from the sidebar to get started
                </p>
                <p class="text-sm text-gray-400 mt-2">
                  Fields will automatically
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>
