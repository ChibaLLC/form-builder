<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Example of using PublishedFormRenderer -->
    <PublishedFormRenderer
      :form="exampleForm"
      :stores="exampleStores"
      @submit="handleFormSubmit"
      @page-change="handlePageChange"
      @field-update="handleFieldUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PublishedFormRenderer from './PublishedFormRenderer.vue';
import type { FormSchema, Store } from '@/types';

// Example form schema
const exampleForm = ref<FormSchema>({
  id: 'form-1',
  title: 'Customer Feedback Form',
  description: 'Help us improve our services by sharing your feedback',
  pages: [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          validation: [
            {
              type: 'min',
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          ]
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your@email.com',
          required: true,
          inputType: 'email',
          validation: [
            {
              type: 'pattern',
              value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
              message: 'Please enter a valid email address'
            }
          ]
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number',
          placeholder: '+1 (555) 000-0000',
          inputType: 'tel',
          required: false
        },
        {
          id: 'company',
          type: 'text',
          label: 'Company',
          placeholder: 'Your company name',
          required: false
        }
      ]
    },
    {
      id: 2,
      title: 'Feedback',
      description: 'Share your thoughts with us',
      fields: [
        {
          id: 'service-rating',
          type: 'rating',
          label: 'How would you rate our service?',
          required: true,
          max: 5
        },
        {
          id: 'features',
          type: 'checkbox',
          label: 'Which features do you use most?',
          options: ['Dashboard', 'Reports', 'Analytics', 'Integrations', 'API'],
          required: false
        },
        {
          id: 'recommendation',
          type: 'radio',
          label: 'Would you recommend us to others?',
          options: ['Definitely', 'Probably', 'Not sure', 'Probably not', 'Definitely not'],
          required: true
        },
        {
          id: 'feedback',
          type: 'textarea',
          label: 'Additional Comments',
          placeholder: 'Tell us what you think...',
          rows: 5,
          required: false,
          helperText: 'Your feedback helps us improve'
        }
      ]
    },
    {
      id: 3,
      title: 'Preferences',
      description: 'Customize your experience',
      fields: [
        {
          id: 'newsletter',
          type: 'toggle',
          label: 'Subscribe to newsletter',
          defaultValue: false,
          helperText: 'Get updates about new features and tips'
        },
        {
          id: 'contact-method',
          type: 'select',
          label: 'Preferred contact method',
          options: ['Email', 'Phone', 'SMS', 'No contact'],
          required: true
        },
        {
          id: 'frequency',
          type: 'select',
          label: 'How often would you like to hear from us?',
          options: ['Weekly', 'Monthly', 'Quarterly', 'Annually'],
          required: false
        }
      ]
    }
  ],
  settings: {
    submitText: 'Submit Feedback',
    successMessage: 'Thank you for your feedback! We appreciate your time and will use your input to improve our services.',
    theme: {
      primaryColor: '#10b981',
      fontFamily: 'Inter, sans-serif'
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Example stores with products
const exampleStores = ref<Store[]>([
  {
    id: 'store-1',
    name: 'Premium Add-ons',
    description: 'Enhance your experience with our premium features',
    items: [
      {
        id: 'item-1',
        name: 'Advanced Analytics',
        description: 'Get deeper insights with advanced analytics and reporting',
        price: 29.99,
        quantity: -1, // Unlimited
        infinite: true,
        images: []
      },
      {
        id: 'item-2',
        name: 'Priority Support',
        description: '24/7 priority support with dedicated account manager',
        price: 49.99,
        quantity: 10,
        infinite: false,
        images: []
      },
      {
        id: 'item-3',
        name: 'Custom Integrations',
        description: 'Connect with your favorite tools and services',
        price: 99.99,
        quantity: 5,
        infinite: false,
        images: []
      }
    ]
  }
]);

// Event handlers
const handleFormSubmit = (data: { formData: Record<string, any>; selectedProducts: any[] }) => {
  console.log('Form submitted with data:', data);
  
  // Here you would typically send the data to your backend
  // For example:
  // await api.submitForm(data);
  
  alert('Form submitted successfully! Check the console for the submitted data.');
};

const handlePageChange = (pageIndex: number) => {
  console.log('Page changed to:', pageIndex);
};

const handleFieldUpdate = (fieldId: string, value: any) => {
  console.log(`Field ${fieldId} updated to:`, value);
};
</script>

<style scoped>
/* Any custom styles for the example can go here */
</style>
