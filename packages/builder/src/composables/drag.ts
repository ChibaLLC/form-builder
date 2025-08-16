import type { FormField, PageSchema, Store } from "@/types";
import type { Ref } from "vue";
export const useDrag = () => {
  const startElementDrag = (event: DragEvent, element: any) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData("drop-element", JSON.stringify(element));
      event.dataTransfer.effectAllowed = "copyMove";
    }
    console.log("data dataTransfer finisdhed");
    console.log("Event Data", event.dataTransfer?.getData("drop-element"));
  };
  // Field Drag
  const dragOver = (event: DragEvent) => {
    event.preventDefault();
  };
  const dragEnter = (event: DragEvent) => {
    event.preventDefault();
  };
  const dragLeave = (event: DragEvent) => {
    event.preventDefault();
  };
  const dragDrop = (event: DragEvent) => {
    event.preventDefault();
  };

  return {
    startElementDrag,
    dragOver,
    dragEnter,
    dragLeave,
    dragDrop,
  };
};

export const usePageDrag = (pages: Ref<PageSchema[]>) => {
  // Page Drags
  const startPageDrag = (event: DragEvent, page: PageSchema, index: number) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData(
        "page-reorder",
        JSON.stringify({ id: page.id, index }),
      );
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const stopPageDrag = (event: DragEvent, targetIndex: number) => {
    if (event.dataTransfer) {
      const data = JSON.parse(event.dataTransfer.getData("page-reorder"));
      if (data) {
        const page = pages.value[data.id];
        pages.value.splice(data.index, 1);
        pages.value.splice(targetIndex, 0, page);
      }
    }
  };

  return {
    startPageDrag,
    stopPageDrag,
  };
};
export const useGridLayoutDrag = (page: Ref<PageSchema>) => {
  const layoutDragEnter = (event: DragEvent) => {
    console.log(event.dataTransfer);
    console.log(event.dataTransfer?.getData("drop-element"));
  };
  const layoutDrop = (event: DragEvent) => {
    if (event.dataTransfer) {
      const data = event.dataTransfer.getData("drop-element");
      console.log(data);
      if (data) {
        const element = JSON.parse(data);
        addField(element);
      }
    }
  };

  const addField = (element: any) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: element.type,
      label: `New ${element.label}`,
      placeholder: "",
      required: false,
    };
    if ((element.type = "select")) {
      newField.options = [{ label: "Option 1", value: "Option 1" }];
    }

    page.value.fields.push(newField);
  };

  return {
    layoutDrop,
    layoutDragEnter,
  };
};

export const useFieldDrag = (page: Ref<PageSchema>) => {
  const startFieldDrag = (
    event: DragEvent,
    field: FormField,
    index: number,
  ) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData(
        "field-reorder",
        JSON.stringify({
          id: field.id,
          index,
        }),
      );
      event.dataTransfer.effectAllowed = "move";
    }
  };
  const dropField = (event: DragEvent, targetIndex: number) => {
    if (event.dataTransfer) {
      const data = event.dataTransfer.getData("field-reorder");
      if (data) {
        const { id, index: sourceIndex } = JSON.parse(data);
        if (sourceIndex != targetIndex) {
          const field = page.value.fields[sourceIndex];
          page.value.fields.splice(sourceIndex, 1);
          page.value.fields.splice(targetIndex, 0, field);
        }
      }
    }
  };
  return {
    startFieldDrag,
    dropField,
  };
};

export const useStoreDrag = (stores: Ref<Store[]>) => {
  const startStoreDrag = (event: DragEvent, store: Store, index: number) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData(
        "store-reorder",
        JSON.stringify({ id: store.id, index }),
      );
      event.dataTransfer.effectAllowed = "move";
    }
  };
  const storeDragOver = (event: DragEvent) => {
    event.preventDefault();
  };
  const storeDrop = (event: DragEvent, targetIndex: number) => {
    event.preventDefault();
    const data = event.dataTransfer?.getData("store-reorder");
    if (data) {
      const { id, index: sourceIndex } = JSON.parse(data);
      if (sourceIndex !== targetIndex) {
        // Reorder the stores
        const store = stores.value[sourceIndex];
        stores.value.splice(sourceIndex, 1);
        stores.value.splice(targetIndex, 0, store);
      }
    }
  };

  return {
    startStoreDrag,
    storeDragOver,
    storeDrop,
  };
};
