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
  type TextareaElementData,
} from "../types";
import { type Reactive } from "vue";
import { Field } from "./constants";

type ElementData = Omit<Partial<FormElementData>, "type"> & {
  type: FormElementData["type"];
};
type ArgData = Reactive<ElementData> | ElementData;
export function isInput(field?: ArgData): field is InputElementData {
  return [
    Field.DATE,
    Field.EMAIL,
    Field.PASSWORD,
    Field.CHECKBOX,
    Field.SEARCH,
    Field.TEL,
    Field.TEXT,
    Field.URL,
    Field.NUMBER,
    Field.TEXTAREA,
    Field.IMAGE,
    Field.SELECT,
  ].includes(field?.type);
}

export function isButton(field?: ArgData): field is ButtonElementData {
  return field?.type === Field.BUTTON;
}

export function isStatic(field?: ArgData): field is StaticElementData {
  return field?.type === Field.STATIC;
}

export function isSelect(field?: ArgData): field is SelectElementData {
  return field?.type === Field.SELECT;
}

export function isCheckbox(field?: ArgData): field is CheckboxElementData {
  return field?.type === Field.CHECKBOX;
}

export function isRadio(field?: ArgData): field is RadioElementData {
  return field?.type === Field.RADIO;
}

export function isImageInput(field?: ArgData): field is ImageInputElementData {
  return field?.type === Field.IMAGE;
}

export function isFileInput(field?: ArgData): field is FileInputElementData {
  return field?.type === Field.FILE;
}

export function isRichText(field?: ArgData): field is RichTextElementData {
  return field?.type === Field.RICHTEXT;
}

export function isTextarea(field?: ArgData): field is TextareaElementData {
  return field?.type === Field.TEXTAREA;
}

export function isNumberField(field?: ArgData): field is Omit<
  InputElementData,
  "inputType" | "type"
> & {
  type: Field.NUMBER;
  inputType: Field.NUMBER;
} {
  return field?.type === Field.NUMBER;
}

export function deleteValues<T extends Object>(obj: T, key?: keyof T) {
  if (!obj) return;
  if (!key) {
    for (const key in obj) {
      delete obj[key];
    }
  } else {
    if (obj[key]) {
      delete obj[key];
    }
  }
}
