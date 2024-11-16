import {
  type ButtonElementData,
  type CheckboxElementData,
  type FileInputElementData,
  type ImageInputElementData,
  type Input,
  type RadioElementData,
  type SelectElementData,
  type StaticElementData
} from "../types";
import {Field} from "./constants"

export function isInput(field: any): field is Input {
  return [Field.DATE, Field.EMAIL, Field.PASSWORD, Field.CHECKBOX, Field.SEARCH, Field.TEL, Field.TEXT, Field.URL, Field.NUMBER, Field.TEXTAREA, Field.IMAGE, Field.SELECT].includes(field)
}

export function isButton(field: any): field is ButtonElementData {
  return field === Field.BUTTON
}

export function isStatic(field: any): field is StaticElementData {
  return field === Field.STATIC
}

export function isSelect(field: any): field is SelectElementData {
  return field === Field.SELECT
}

export function isCheckbox(field: any): field is CheckboxElementData {
  return field === Field.CHECKBOX
}

export function isRadio(field: any): field is RadioElementData {
  return field === Field.RADIO
}

export function isImageInput(field: any): field is ImageInputElementData {
  return field === Field.IMAGE
}

export function isFileInput(field: any): field is FileInputElementData {
  return field === Field.FILE
}

export function isRichText(field: any): field is Field.RICHTEXT {
  return field === Field.RICHTEXT
}

export function isTextarea(field: any): field is Field.TEXTAREA {
  return field === Field.TEXTAREA
}
