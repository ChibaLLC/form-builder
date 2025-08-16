import { ref, type Ref } from "vue";

export const useEditingLabel = (label: Ref<string>) => {
  const isEditing = ref(false);
  const tempLabel = ref("");
  const startEditing = () => {
    isEditing.value = true;
    tempLabel.value = label.value;
  };
  const finishEditing = () => {
    isEditing.value = false;
    label.value = tempLabel.value;
  };

  return {
    isEditing,
    tempLabel,
  };
};
