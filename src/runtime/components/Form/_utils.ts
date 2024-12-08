import type { InjectionKey } from "vue"

export const formDataKey = Symbol() as InjectionKey<string>
export const storeDataKey = Symbol() as InjectionKey<string>
export const editKey = Symbol("FormEditKey") as InjectionKey<string>
export const disabledKey = Symbol("FormDisabledKey") as InjectionKey<string>
export const draggedElementKey = Symbol("PickerDraggedElement") as InjectionKey<string>