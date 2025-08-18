<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { FormSchema } from '@/types';
import { Settings as SettingsIcon, Palette, Layout, Type, Save, Eye, FileText } from 'lucide-vue-next';

interface Props {
  form: FormSchema;
}

const props = defineProps<Props>();

// Local copy of form for editing
const localForm = ref<FormSchema>(JSON.parse(JSON.stringify(props.form)));

// Watch for prop changes
watch(() => props.form, (newForm) => {
  localForm.value = JSON.parse(JSON.stringify(newForm));
}, { deep: true });

// Theme options
const themes = [
  { value: 'light', label: 'Light', color: 'bg-white' },
  { value: 'dark', label: 'Dark', color: 'bg-gray-800' },
  { value: 'auto', label: 'Auto', color: 'bg-gradient-to-r from-white to-gray-800' },
];

// Layout options
const layouts = [
  { value: 'vertical', label: 'Vertical', icon: '⬇️' },
  { value: 'horizontal', label: 'Horizontal', icon: '➡️' },
  { value: 'inline', label: 'Inline', icon: '↔️' },
];

// Spacing options
const spacings = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'loose', label: 'Loose' },
];

// Features
const features = ref({
  multiPage: localForm.value.pages.length > 1,
  progressBar: true,
  autoSave: false,
  requiredIndicator: true,
  fieldValidation: true,
  submitConfirmation: false,
  successMessage: true,
  emailNotification: false,
});

// Success message
const successMessage = ref('Thank you for submitting the form!');
const notificationEmail = ref('');

// Methods
const updateSetting = (key: string, value: any) => {
  if (key.includes('.')) {
    const keys = key.split('.');
    let obj = localForm.value as any;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  } else {
    (localForm.value as any)[key] = value;
  }
};

const saveSettings = () => {
  // Emit or save settings
  console.log('Settings saved:', localForm.value);
};
</script>
<template>
  <div class="h-full bg-gray-50 overflow-auto">
    <div class="max-w-5xl mx-auto p-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon class="w-6 h-6 text-gray-600" />
          Form Settings
        </h2>
        <p class="text-gray-600 mt-1">Configure your form appearance and behavior</p>
      </div>

      <!-- Settings Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <FileText class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div class="space-y-5">
            <!-- Form Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Form Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="localForm.title"
                type="text"
                placeholder="Enter form title"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Form Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Form Description
              </label>
              <textarea
                v-model="localForm.description"
                placeholder="Describe your form..."
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <!-- Submit Button Text -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Submit Button Text
              </label>
              <input
                v-model="localForm.settings.submitText"
                type="text"
                placeholder="Submit"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Reset Button Text -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reset Button Text
              </label>
              <input
                v-model="localForm.settings.resetText"
                type="text"
                placeholder="Reset"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <Palette class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">Appearance</h3>
          </div>

          <div class="space-y-5">
            <!-- Theme Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Theme
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="theme in themes"
                  :key="theme.value"
                  @click="updateSetting('settings.theme', theme.value)"
                  :class="[
                    'relative p-4 rounded-lg border-2 transition-all',
                    localForm.settings.theme === theme.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div :class="['w-full h-8 rounded mb-2', theme.color]"></div>
                  <span class="text-sm font-medium text-gray-700">{{ theme.label }}</span>
                  <div
                    v-if="localForm.settings.theme === theme.value"
                    class="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <span class="text-white text-xs">✓</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Layout -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Layout
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="layout in layouts"
                  :key="layout.value"
                  @click="updateSetting('settings.layout', layout.value)"
                  :class="[
                    'p-3 rounded-lg border-2 transition-all text-center',
                    localForm.settings.layout === layout.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <span class="text-2xl mb-1">{{ layout.icon }}</span>
                  <div class="text-xs font-medium text-gray-700">{{ layout.label }}</div>
                </button>
              </div>
            </div>

            <!-- Spacing -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Field Spacing
              </label>
              <div class="flex gap-2">
                <button
                  v-for="spacing in spacings"
                  :key="spacing.value"
                  @click="updateSetting('settings.spacing', spacing.value)"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium',
                    localForm.settings.spacing === spacing.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  ]"
                >
                  {{ spacing.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <Layout class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">Form Features</h3>
          </div>

          <div class="space-y-4">
            <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center gap-3">
                <input
                  v-model="features.progressBar"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Progress Bar</span>
                  <p class="text-xs text-gray-500">Show progress indicator</p>
                </div>
              </div>
            </label>

            <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center gap-3">
                <input
                  v-model="features.autoSave"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Auto-save</span>
                  <p class="text-xs text-gray-500">Save progress automatically</p>
                </div>
              </div>
            </label>

            <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center gap-3">
                <input
                  v-model="features.requiredIndicator"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Required Fields Indicator</span>
                  <p class="text-xs text-gray-500">Show * for required fields</p>
                </div>
              </div>
            </label>

            <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center gap-3">
                <input
                  v-model="features.fieldValidation"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Real-time Validation</span>
                  <p class="text-xs text-gray-500">Validate fields as user types</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Success Settings -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <Eye class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">After Submission</h3>
          </div>

          <div class="space-y-5">
            <!-- Success Message Toggle -->
            <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center gap-3">
                <input
                  v-model="features.successMessage"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Show Success Message</span>
                  <p class="text-xs text-gray-500">Display message after submission</p>
                </div>
              </div>
            </label>

            <!-- Success Message Text -->
            <div v-if="features.successMessage">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Success Message
              </label>
              <textarea
                v-model="successMessage"
                placeholder="Thank you for your submission!"
                rows="2"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <!-- Email Notification -->
            <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div class="flex items-center gap-3">
                <input
                  v-model="features.emailNotification"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">Email Notifications</span>
                  <p class="text-xs text-gray-500">Send submission notifications</p>
                </div>
              </div>
            </label>

            <!-- Notification Email -->
            <div v-if="features.emailNotification">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notification Email
              </label>
              <input
                v-model="notificationEmail"
                type="email"
                placeholder="admin@example.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <button
          @click="saveSettings"
          class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Save class="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>
