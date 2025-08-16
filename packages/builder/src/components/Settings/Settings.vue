<script setup lang="ts">
import { ref } from "vue";

// Form settings data
const formDescription = ref("");
const formType = ref("basic");
const amount = ref("0");
const features = ref({
  progressTracking: true,
  saveResume: true,
  allowGroups: false,
  requireMerch: true,
  calculateTax: true,
});
</script>
<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-gray-100 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Form Settings</h2>

      <!-- Form Description -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Form Description</label
        >
        <textarea
          v-model="formDescription"
          placeholder="Enter a description for your form..."
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">
          200 characters MAX
        </div>
      </div>

      <!-- Image Upload -->
      <div class="mb-6">
        <div class="flex">
          <input
            type="text"
            placeholder="Choose an image for your form description"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            readonly
          />
          <button
            class="px-4 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form Type -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Form Type</label
        >
        <div class="relative">
          <select
            v-model="formType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="basic">Basic</option>
            <option value="survey">Survey</option>
            <option value="registration">Registration</option>
            <option value="order">Order Form</option>
            <option value="events">Events & Bookings</option>
            <option value="contributions">Contributions</option>
          </select>
          <svg
            class="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Amount -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Amount</label
        >
        <div class="relative">
          <span class="absolute left-3 top-2 text-sm text-gray-500">Ksh</span>
          <input
            v-model="amount"
            type="text"
            placeholder="0"
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Features -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3"
          >Features</label
        >
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              v-model="features.progressTracking"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700"
              >Enable progress tracking</span
            >
          </label>

          <label class="flex items-center">
            <input
              v-model="features.saveResume"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700">Save & resume later</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="features.allowGroups"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700">Allow groups</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="features.requireMerch"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700">Require merch</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="features.calculateTax"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span class="ml-2 text-sm text-gray-700">Calculate TAT</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
