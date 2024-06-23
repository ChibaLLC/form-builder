import { Field, ImageTypeEnum } from "./utils/constants"

export type Input =
  Field.DATE
  | Field.EMAIL
  | Field.PASSWORD
  | Field.SEARCH
  | Field.TEL
  | Field.TEXT
  | Field.URL
  | Field.NUMBER
  | Field.FILE
  | Field.IMAGE

export type ElementOptions = Array<{ value: string, label: string }> | URL | Promise<Array<{
  value: string,
  label: string
}>> | (() => Promise<Array<{ value: string, label: string }>>) | `http${string}`

export type _ElementData = {
  type: any,
  label: string,
  inputType: string,
  text?: string,
  accept?: string | undefined,
  onClick?: () => void,
  options?: any,
  value?: any,
  index?: number,
  placeholder?: string,
  rules?: Array<'required' | `max:${number}` | `min:${number}` | `same:${string}`>,
  description?: string,
}

export type StaticElementData = {
  index?: number,
  type: Field.STATIC,
  text: string
}

export type SelectElementData = _ElementData & {
  type: Field.SELECT,
  inputType: Field.SELECT,
  value?: string,
  autocomplete?: boolean,
  options: ElementOptions | undefined
}

export type InputElementData = _ElementData & {
  type: Input,
  label: string,
  inputType: Input
  value?: Date | string | number,
}

export type ImageInputElementData = _ElementData & {
  type: Field.IMAGE,
  inputType: Field.IMAGE,
  label: string,
  accept: ImageTypeEnum | undefined | string,
  value: any
}

export type FileInputElementData = _ElementData & {
  type: Field.FILE,
  inputType: Field.FILE,
  label: string,
  accept: string | undefined,
  value: any
}

export type CheckboxElementData = _ElementData & {
  type: Field.CHECKBOX,
  value: boolean,
  inputType: Field.CHECKBOX,
  label: string,
  options: ElementOptions | undefined
}

export type RadioElementData = _ElementData & {
  type: Field.RADIO,
  value: string,
  inputType: Field.RADIO,
  label: string,
  options: ElementOptions | undefined
}

export type TextareaElementData = _ElementData & {
  type: Field.TEXTAREA,
  inputType: Field.TEXTAREA,
  label: string,
  value: string
}

export type RichTextElementData = {
  index?: number,
  type: Field.RICHTEXT,
  label: string,
  value: string,
  inputType: Field.RICHTEXT
}

export type ButtonElementData = _ElementData & {
  type: Field.BUTTON,
  inputType: 'submit' | 'reset' | 'button',
  label: string,
  onClick: (() => void) | undefined
}

export type FormElementData =
  | _ElementData
  | StaticElementData
  | SelectElementData
  | InputElementData
  | CheckboxElementData
  | ButtonElementData
  | RadioElementData
  | ImageInputElementData
  | FileInputElementData
  | TextareaElementData
  | RichTextElementData

export type Item = {
  index: number,
  qtty: number,
  store: number,
  name: string,
  price: number,
  images: Array<string>
}

export type Form = Array<FormElementData>
export type Store = Array<Item>
export type Forms = Record<number, Form>
export type Stores = Record<number, Store>

export type FormStoreData = {
  forms: Forms,
  stores: Stores
}
