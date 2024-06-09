import { type ButtonElementData, type CheckboxElementData, type ElementOptions, type FileInputElementData, type ImageInputElementData, type Input, type RadioElementData, type SelectElementData, type StaticElementData } from "~/typings";

export function capitalise(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function parseElementOptions(options: ElementOptions | undefined): Promise<{ label: string, value: string }[]> {
    if (options === undefined) return Promise.resolve([])

    function format(item: any) {
        if (Array.isArray(item)) {
            return item.map((option) => {
                if (typeof option === 'string') {
                    return { label: option, value: option }
                } else {
                    if (option.label && option.value) {
                        return option
                    } else {
                        return Object.keys(option).map((key) => ({ label: key, value: option[key] }))
                    }
                }
            })
        }

        if (typeof item === 'string') {
            try {
                return format(JSON.parse(item))
            } catch (e) {
                return item.split(', ').map((option) => ({ label: option, value: option }))
            }
        }

        if (typeof item === 'object') {
            if (item.label && item.value) {
                return [item]
            } else {
                return Object.keys(item).map((key) => ({ label: key, value: item[key] }))
            }
        }

        console.warn("Un-parsable options")
        return []
    }

    switch (typeof options) {
        case 'function':
            return Promise.resolve(options()).then(parseElementOptions)
        case 'string':
            if (options.startsWith('http')) {
                try {
                    return $fetch<string>(options, { responseType: 'text' }).then(format)
                } catch (e) {
                    return Promise.resolve([])
                }
            } else {
                try {
                    return Promise.resolve(format(options))
                } catch (e) {
                    return Promise.resolve([])
                }
            }
        case 'object':
            return Promise.resolve(format(options))
        default:
            return Promise.resolve([])
    }
}

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
    BMP = 'image/bmp',
    join = "join"
}

export function isInput(field: any): field is Input {
    return [Field.DATE, Field.EMAIL, Field.PASSWORD, Field.SEARCH, Field.TEL, Field.TEXT, Field.URL, Field.NUMBER, Field.TEXTAREA, Field.IMAGE, Field.SELECT].includes(field)
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