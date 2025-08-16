import type { FormField, FormSchema, PageSchema } from "@/types";
import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

export function useFormBuilder() {
  // Form state
  const formName = ref("Untitled Form");
  const currentPage = ref(1);
  const pages = ref<PageSchema[]>([{ id: 1, title: "", fields: [] }]);
  const selectedFieldId = ref<string | null>(null);
  const formFields = ref<FormField[]>([]);

  // Grid settings
  const currentColumns = ref(2);
  const columnGap = ref("gap-4");
  const responsiveColumns = ref(true);

  // Computed properties
  const selectedField = computed(() =>
    formFields.value.find((field) => field.id === selectedFieldId.value),
  );

  const currentPageData = computed(() =>
    pages.value.find((page) => page.id === currentPage.value),
  );

  // Field management
  const addField = (fieldType: any, position?: number) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: fieldType.type,
      label: `New ${fieldType.label}`,
      placeholder: "",
      required: false,
      columnSpan: getDefaultColumnSpan(fieldType.type),
    };

    if (position !== undefined) {
      formFields.value.splice(position, 0, newField);
    } else {
      formFields.value.push(newField);
    }

    selectedFieldId.value = newField.id;
    return newField;
  };

  const removeField = (fieldId: string) => {
    const index = formFields.value.findIndex((field) => field.id === fieldId);
    if (index > -1) {
      formFields.value.splice(index, 1);
      if (selectedFieldId.value === fieldId) {
        selectedFieldId.value = null;
      }
    }
  };

  const duplicateField = (fieldId: string) => {
    const field = formFields.value.find((f) => f.id === fieldId);
    if (field) {
      const duplicated = {
        ...field,
        id: Date.now().toString(),
        label: `${field.label} (Copy)`,
      };
      const index = formFields.value.findIndex((f) => f.id === fieldId);
      formFields.value.splice(index + 1, 0, duplicated);
      return duplicated;
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const field = formFields.value[fromIndex];
    formFields.value.splice(fromIndex, 1);
    formFields.value.splice(toIndex, 0, field);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const field = formFields.value.find((f) => f.id === fieldId);
    if (field) {
      Object.assign(field, updates);
    }
  };

  // Page management
  const addPage = () => {
    saveCurrentPageData();
    const newPageId = Math.max(...pages.value.map((p) => p.id)) + 1;
    const newPage: FormPage = {
      id: newPageId,
      title: "",
      fields: [],
    };
    pages.value.push(newPage);
    switchToPage(newPageId);
    return newPage;
  };

  const removePage = (pageId: number) => {
    if (pages.value.length <= 1) return false;

    const index = pages.value.findIndex((page) => page.id === pageId);
    if (index > -1) {
      pages.value.splice(index, 1);
      if (currentPage.value === pageId) {
        currentPage.value = pages.value[0]?.id || 1;
        switchToPage(currentPage.value);
      }
      return true;
    }
    return false;
  };

  const switchToPage = (pageId: number) => {
    saveCurrentPageData();
    currentPage.value = pageId;
    const targetPage = pages.value.find((p) => p.id === pageId);
    if (targetPage) {
      formFields.value = [...targetPage.fields];
      selectedFieldId.value = null;
    }
  };

  const saveCurrentPageData = () => {
    const currentPageData = pages.value.find((p) => p.id === currentPage.value);
    if (currentPageData) {
      currentPageData.fields = [...formFields.value];
    }
  };

  // Grid management
  const getDefaultColumnSpan = (fieldType: string): number => {
    switch (fieldType) {
      case "name":
      case "address":
      case "rating":
        return Math.min(2, currentColumns.value);
      case "longtext":
        return currentColumns.value;
      default:
        return 1;
    }
  };

  const updateFieldColumnSpan = (fieldId: string, span: number) => {
    const field = formFields.value.find((f) => f.id === fieldId);
    if (field) {
      field.columnSpan = Math.min(span, currentColumns.value);
    }
  };

  const resetAllFieldSpans = () => {
    formFields.value.forEach((field) => {
      field.columnSpan = 1;
    });
  };

  const autoArrangeFields = () => {
    formFields.value.forEach((field) => {
      field.columnSpan = getDefaultColumnSpan(field.type);
    });
  };

  // Layout management
  const updateLayoutColumns = () => {
    formFields.value.forEach((field) => {
      if (field.columnSpan && field.columnSpan > currentColumns.value) {
        field.columnSpan = currentColumns.value;
      }
    });
  };

  // Validation (simplified without plugins)
  const validateField = (field: FormField, value: any): string[] => {
    const errors: string[] = [];

    if (field.required && (!value || value.toString().trim() === "")) {
      errors.push(`${field.label} is required`);
    }

    // Basic validation can be added here later
    // For now, just basic required field validation

    return errors;
  };

  const validateForm = (
    formData: Record<string, any>,
  ): Record<string, string[]> => {
    const errors: Record<string, string[]> = {};

    formFields.value.forEach((field) => {
      const fieldErrors = validateField(field, formData[field.id]);
      if (fieldErrors.length > 0) {
        errors[field.id] = fieldErrors;
      }
    });

    return errors;
  };

  // Export/Import
  const exportForm = () => {
    saveCurrentPageData();

    const exportData = {
      formName: formName.value,
      pages: pages.value,
      currentPage: currentPage.value,
      currentColumns: currentColumns.value,
      columnGap: columnGap.value,
      responsiveColumns: responsiveColumns.value,
      exportTimestamp: new Date().toISOString(),
      version: "3.0",
    };

    return exportData;
  };

  const importForm = (data: any) => {
    if (!data.pages || !Array.isArray(data.pages)) {
      throw new Error("Invalid form data");
    }

    formName.value = data.formName || "Imported Form";
    pages.value = data.pages;
    currentPage.value = data.currentPage || 1;
    currentColumns.value = data.currentColumns || 2;
    columnGap.value = data.columnGap || "gap-4";
    responsiveColumns.value = data.responsiveColumns ?? true;

    switchToPage(currentPage.value);
  };

  const clearForm = () => {
    formFields.value = [];
    selectedFieldId.value = null;
  };

  return {
    // State
    formName,
    currentPage,
    pages,
    selectedFieldId,
    formFields,
    currentColumns,
    columnGap,
    responsiveColumns,

    // Computed
    selectedField: readonly(selectedField),
    currentPageData: readonly(currentPageData),

    // Field management
    addField,
    removeField,
    duplicateField,
    moveField,
    updateField,

    // Page management
    addPage,
    removePage,
    switchToPage,
    saveCurrentPageData,

    // Grid management
    getDefaultColumnSpan,
    updateFieldColumnSpan,
    resetAllFieldSpans,
    autoArrangeFields,
    updateLayoutColumns,

    // Validation
    validateField,
    validateForm,

    // Export/Import
    exportForm,
    importForm,
    clearForm,
  };
}

// Performance composable for virtual scrolling and optimization
export function useVirtualScroll(items: Ref<any[]>, itemHeight: number = 60) {
  cons;
  const scrollTop = ref(0);
  const containerHeight = ref(0);

  const visibleCount = computed(
    () => Math.ceil(containerHeight.value / itemHeight) + 2,
  );

  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - 1),
  );

  const endIndex = computed(() =>
    Math.min(items.value.length, startIndex.value + visibleCount.value),
  );

  const visibleItems = computed(() =>
    items.value.slice(startIndex.value, endIndex.value).map((item, index) => ({
      item,
      index: startIndex.value + index,
    })),
  );

  const totalHeight = computed(() => items.value.length * itemHeight);
  const offsetY = computed(() => startIndex.value * itemHeight);

  const onScroll = (event: Event) => {
    scrollTop.value = (event.target as HTMLElement).scrollTop;
  };

  const updateContainerHeight = () => {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight;
    }
  };

  return {
    containerRef,
    visibleItems: readonly(visibleItems),
    totalHeight: readonly(totalHeight),
    offsetY: readonly(offsetY),
    onScroll,
    updateContainerHeight,
  };
}

// Utility function to make refs readonly
function readonly<T>(ref: Ref<T>): ComputedRef<T> {
  return computed(() => ref.value);
}
