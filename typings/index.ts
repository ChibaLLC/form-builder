export enum Field {
    TEXT = 'text',
    PASSWORD = 'password',
    EMAIL = 'email',
    NUMBER = 'number',
    DATE = 'date',
    URL = 'url',
    TEL = 'tel',
    SEARCH = 'search',
    FILE = 'file',
    IMAGE = 'image',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    SELECT = 'select',
    BUTTON = 'button',
    STATIC = 'static',
    TEXTAREA = 'textarea',
    RICHTEXT = 'richtext',
    STORE = 'store',
}

export enum ImageTypeEnum {
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    GIF = 'image/gif',
    SVG = 'image/svg+xml',
    WEBP = 'image/webp',
    BMP = 'image/bmp'
}

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
    accept: ImageTypeEnum | undefined,
    value: string
}

export type FileInputElementData = _ElementData & {
    type: Field.FILE,
    inputType: Field.FILE,
    label: string,
    accept: string | undefined,
    value: string
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

export function isInput(field: any): field is Input {
    return [Field.DATE, Field.EMAIL, Field.PASSWORD, Field.SEARCH, Field.TEL, Field.TEXT, Field.URL, Field.NUMBER].includes(field)
}

export function isImageInput(field: any): field is ImageInputElementData {
    return field === Field.IMAGE
}

export function isFileInput(field: any): field is FileInputElementData {
    return field === Field.FILE
}

export function isButton(field: any): field is ButtonElementData {
    return field === Field.BUTTON
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

export function isStatic(field: any): field is StaticElementData {
    return field === Field.STATIC
}

export function isRichText(field: any): field is Field.RICHTEXT {
    return field === Field.RICHTEXT
}

export function isTextarea(field: any): field is Field.TEXTAREA {
    return field === Field.TEXTAREA
}

export type Item = {
    index: number,
    qtty: number,
    store: number,
    name: string,
    price: number,
    images: Array<string>
}