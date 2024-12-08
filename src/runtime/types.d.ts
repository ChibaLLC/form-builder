import { Field, ImageTypeEnum } from "./utils/constants"
import type { ModuleOptions } from './module'

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


export type ElementOptions = Array<{ value: string, label: string }>
export interface _ElementData {
  type: any,
  label: string,
  inputType: string,
  accept?: string | undefined,
  onClick?: () => void,
  options?: any,
  value?: any,
  index: number,
  placeholder?: string,
  rules?: Array<'required' | `max:${number}` | `min:${number}` | `same:${string}`>,
  description?: string,
}

export interface StaticElementData extends _ElementData {
  type: Field.STATIC,
  label?: never
  inputType: Field.STATIC
  value?: never
  text: string
}

export interface SelectElementData  extends _ElementData {
  type: Field.SELECT,
  inputType: Field.SELECT,
  value?: string,
  label: string
  autocomplete?: boolean,
  options?: ElementOptions
}

export interface InputElementData  extends _ElementData {
  type: Input,
  label: string,
  inputType: Input
  value?: Date | string | number,
}

export interface ImageInputElementData  extends _ElementData {
  type: Field.IMAGE,
  inputType: Field.IMAGE,
  label: string,
  accept?: ImageTypeEnum | string,
  value?: File | undefined
}

export interface FileInputElementData extends _ElementData {
  type: Field.FILE,
  inputType: Field.FILE,
  label: string,
  accept?: string,
  value?: File
}

export interface CheckboxElementData extends _ElementData { 
  type: Field.CHECKBOX,
  value?: Record<string, string>,
  inputType: Field.CHECKBOX,
  label: string,
  options?: ElementOptions,
  multiple: boolean
}

export interface RadioElementData  extends _ElementData {
  type: Field.RADIO,
  value: boolean,
  inputType: Field.RADIO,
  label: string,
  options?: ElementOptions
}

export interface TextareaElementData  extends _ElementData {
  type: Field.TEXTAREA,
  inputType: Field.TEXTAREA,
  label: string,
  value: string
}

export interface RichTextElementData  extends  _ElementData {
  type: Field.RICHTEXT,
  label: string,
  value: string,
  inputType: Field.RICHTEXT
}

export interface ButtonElementData  extends _ElementData {
  type: Field.BUTTON,
  inputType: 'submit' | 'reset' | 'button',
  label: string,
  onClick?: (() => void)
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
  carted: boolean,
  liked: boolean,
  images: Array<string>
}

export type Page = Array<FormElementData>
export type Store = Array<Item>
export type Pages = Record<number, Page>
export type Stores = Record<number, Store>

export type Form = {
  pages: Pages,
  stores: Stores
}

declare module '@nuxt/schema' {
  interface NuxtConfig { ['nuxtFormBuilder']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['nuxtFormBuilder']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['nuxtFormBuilder']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['nuxtFormBuilder']?: ModuleOptions }
}
export type { ModuleOptions, default } from './module'
