<script setup lang="ts">
import type { FormSchema } from "@/types";
import {
  Settings as SettingsIcon,
  Layout,
  Save,
  FileText,
} from "lucide-vue-next";

interface Props {
  form: FormSchema;
}

const props = defineProps<Props>();

const saveSettings = () => {
  // Emit or save settings
  console.log("Settings saved:", props.form);
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
        <p class="text-gray-600 mt-1">
          Configure your form appearance and behavior
        </p>
      </div>

      <!-- Settings Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <FileText class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>

          <div class="space-y-5">
            <!-- Form Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Form Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
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
                v-model="form.description"
                placeholder="Describe your form..."
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Form Price</label
              >
              <input
                v-model="form.price"
                type="number"
                placeholder="Enter form price"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div v-if="form.allowGroups" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Form Group Payable Amount</label
              >
              <input
                v-model="form.groupAmountPayable"
                type="number"
                placeholder="Enter group payable amount"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Form Group Member Limit</label
              >
              <input
                v-model="form.groupMemberLimit"
                type="number"
                placeholder="Enter group member limit"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Form Information Prompt Message</label
              >
              <textarea
                v-model="form.infoPromptMessage"
                placeholder="Enter form price"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
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
            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="form.allowGroups"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700"
                    >Allow Groups</span
                  >
                  <p class="text-xs text-gray-500">Allow Groups</p>
                </div>
              </div>
            </label>

            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="form.requireMerch"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700"
                    >Require Merch</span
                  >
                  <p class="text-xs text-gray-500">Require merch</p>
                </div>
              </div>
            </label>
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
