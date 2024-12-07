import {
  type ButtonElementData,
  type CheckboxElementData,
  type FileInputElementData,
  type FormElementData,
  type ImageInputElementData,
  type InputElementData,
  type RadioElementData,
  type RichTextElementData,
  type SelectElementData,
  type StaticElementData,
  type TextareaElementData
} from "../types";
import { Field } from "./constants"

export function isInput(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is InputElementData {
  return [Field.DATE, Field.EMAIL, Field.PASSWORD, Field.CHECKBOX, Field.SEARCH, Field.TEL, Field.TEXT, Field.URL, Field.NUMBER, Field.TEXTAREA, Field.IMAGE, Field.SELECT].includes(field.type)
}

export function isButton(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is ButtonElementData {
  return field?.type === Field.BUTTON
}

export function isStatic(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is StaticElementData {
  return field?.type === Field.STATIC
}

export function isSelect(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is SelectElementData {
  return field?.type === Field.SELECT
}

export function isCheckbox(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is CheckboxElementData {
  return field?.type === Field.CHECKBOX
}

export function isRadio(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is RadioElementData {
  return field?.type === Field.RADIO
}

export function isImageInput(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is ImageInputElementData {
  return field?.type === Field.IMAGE
}

export function isFileInput(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is FileInputElementData {
  return field?.type === Field.FILE
}

export function isRichText(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is RichTextElementData {
  return field?.type === Field.RICHTEXT
}

export function isTextarea(field: Omit<Partial<FormElementData>, 'type'> & { type: FormElementData['type'] }): field is TextareaElementData {
  return field?.type === Field.TEXTAREA
}
