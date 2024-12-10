import type { InjectionKey } from "vue"

export const formElementDataListKey = Symbol("FormElementDataListKey") as InjectionKey<string>
export const formElementDataKey = Symbol("FormElementDataKey") as InjectionKey<string>
export const storeDataKey = Symbol("StoreDataKey") as InjectionKey<string>
export const editKey = Symbol("FormEditKey") as InjectionKey<string>
export const disabledKey = Symbol("FormDisabledKey") as InjectionKey<string>
export const draggedElementKey = Symbol("PickerDraggedElement") as InjectionKey<string>
export const activePageIndexKey = Symbol("ActivePageIndex")