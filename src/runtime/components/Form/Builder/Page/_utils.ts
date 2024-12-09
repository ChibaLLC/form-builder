import { type Ref, h, inject, defineComponent, resolveComponent, createVNode, shallowReactive, type Component, shallowRef } from "vue"
import type {
    Page,
    Pages,
    Input,
    FormElementData,
    ButtonElementData,
    CheckboxElementData,
    FileInputElementData,
    ImageInputElementData,
    InputElementData, RadioElementData, RichTextElementData, SelectElementData, StaticElementData, TextareaElementData
} from "~/src/runtime/types"
import { disabledKey, draggedElementKey, editKey } from "../../../../utils/symbols"
import { Field } from '../../../../utils/constants';
import {
    isInput,
    isFileInput,
    isImageInput,
    isButton,
    isCheckbox,
    isRadio,
    isRichText,
    isSelect,
    isStatic,
    isTextarea
} from "../../../../utils/functions";

type ResolvedComponent = ReturnType<typeof resolveComponent>
export function createFormPage(Page: ResolvedComponent, canvases: Pages, starter?: Page) {
    return defineComponent({
        setup() {
            const index = Object.keys(canvases).length
            const draggedElement = inject<Ref<Input | undefined>>(draggedElementKey)
            return { index, draggedElement }
        },
        render() {
            return h('div', h(Page, {
                draggedElement: this.draggedElement,
                index: this.index,
                onDeleteCanvas: (index: number) => {
                    delete canvases[index]
                    this.$el.remove()
                },
                onAddField: (index: number, field: FormElementData) => {
                    const canvas = canvases[index]
                    if (canvas) {
                        canvas.push(field)
                    } else {
                        canvases[index] = [field]
                    }
                },
                onDeleteField: (index: number, field: FormElementData) => {
                    const canvas = canvases[index]
                    if (canvas) {
                        canvases[index] = canvas.filter(el => el.index !== field.index)
                    } else {
                        console.warn("Canvas Index not found")
                    }
                },
                onUpdateField: (index: number, field: FormElementData) => {
                    const canvas = canvases[index]
                    if (canvas) {
                        canvases[index] = canvas.map(el => el.index === index ? field : el)
                    } else {
                        console.warn("Canvas Index not found")
                    }
                },
                onActive: (val: FormElementData) => {
                    this.$emit("active", val)
                },
                starter: starter
            }))
        }
    })
}

export class Elements {
    private elements: Array<FormElementData> = []
    public components = shallowReactive(new Map<number, Component>())
    public active = shallowRef<FormElementData | undefined>(undefined);
    private _onAdd = {
        add: [] as Array<Function>,
        delete: [] as Array<Function>,
        update: [] as Array<Function>
    }
    private FieldComponent: ResolvedComponent;
    private movingElement: number | undefined;
    private latestEnter: number | undefined;

    constructor(FormElementsRenderer: ResolvedComponent) {
        this.FieldComponent = FormElementsRenderer
    }

    private initialiseElementData(type: Input) {
        const index = this.elements.length;
        switch (true) {
            case isInput({ type }):
                return {
                    inputType: type,
                    type: type,
                    label: (function (field: Field) {
                        switch (field) {
                            case Field.EMAIL:
                                return "Email"
                        }
                        return ''
                    }(type)),
                    placeholder: '',
                    value: '',
                    index
                } satisfies InputElementData;

            case isImageInput({ type }):
                return {
                    type: Field.IMAGE,
                    inputType: Field.IMAGE,
                    label: '',
                    accept: undefined,
                    value: undefined,
                    index
                } satisfies ImageInputElementData;
            case isFileInput({ type }):
                return {
                    type: Field.FILE,
                    inputType: Field.FILE,
                    label: '',
                    index
                } satisfies FileInputElementData;

            case isCheckbox({ type }):
                return {
                    type: Field.CHECKBOX,
                    inputType: Field.CHECKBOX,
                    label: '',
                    multiple: true,
                    index
                } satisfies CheckboxElementData;

            case isButton({ type }):
                return {
                    type: Field.BUTTON as any,
                    inputType: 'submit',
                    label: '',
                    index
                } satisfies ButtonElementData;

            case isRadio({ type }):
                return {
                    type: Field.RADIO,
                    inputType: Field.RADIO,
                    label: '',
                    value: false,
                    options: undefined,
                    index
                } satisfies RadioElementData;
                break;

            case isStatic({ type }):
                return {
                    type: Field.STATIC,
                    inputType: Field.STATIC,
                    index,
                    text: ''
                } satisfies StaticElementData;

            case isTextarea({ type }):
                return {
                    type: Field.TEXTAREA,
                    inputType: Field.TEXTAREA,
                    label: '',
                    placeholder: '',
                    value: '',
                    index
                } satisfies TextareaElementData;

            case isSelect({ type }):
                return {
                    label: '',
                    type: Field.SELECT as any,
                    inputType: Field.SELECT as any,
                    index
                } satisfies SelectElementData;

            case isRichText({ type }):
                return {
                    type: Field.RICHTEXT,
                    label: '',
                    value: '',
                    inputType: Field.RICHTEXT,
                    index
                } satisfies RichTextElementData;

            default:
                alert("Unsupported Field Type")
                throw new Error("Unsupported Field Type")
        }
    }


    add(fieldName: Input) {
        const data = this.initialiseElementData(fieldName)
        this.elements.push(data)
        this.emit('add', data)
        return this;
    }

    on(event: 'add' | 'delete' | 'update', callback: Function) {
        this._onAdd[event].push(callback)
    }

    starter(data: Array<FormElementData>) {
        if (!data || data.length === 0) return this;
        data.map(el => {
            const index = el.index || this.elements.length
            this.elements.push({ ...el, index })
            this.emit('add', this.elements[index])
        })
        this.render()
        return this;
    }

    private emit(event: 'add' | 'delete' | 'update', data: FormElementData) {
        for (const callback of this._onAdd[event]) {
            callback(data)
        }
    }

    createComponent(data: FormElementData) {
        return defineComponent({
            setup: () => {
                const onDragStart = (_: Event) => {
                    this.movingElement = data.index
                }
                const onDragEnter = (_: Event) => {
                    this.latestEnter = data.index
                }
                return { FieldComponent: this.FieldComponent, delete: this.delete.bind(this), onDragStart, onDragEnter, setActive: this.setActive.bind(this) }
            },
            render() {
                return h('div', { onDragstart: this.onDragStart, onDragenter: this.onDragEnter }, h(this.FieldComponent, {
                    data: data,
                    onDelete: (idx: number) => {
                        this.delete(idx)
                    },
                    onFocus: (state: boolean, data: FormElementData) => {
                        this.setActive(state, data)
                    }
                }))
            }
        })
    }

    render() {
        this.elements.map(el => {
            if (this.isRendered(el)) return
            const component = this.createComponent(el)
            this.components.set(el.index, component)
        })
        return this;
    }

    isRendered(el: FormElementData) {
        return this.components.has(el.index)
    }

    update(index: number, data: FormElementData) {
        const component = this.createComponent(data)
        this.components.delete(index)
        this.components.set(data.index, component)
        return this;
    }

    delete(index: number) {
        const element = this.elements.find(el => el.index === index)
        if(!element) return console.warn("Buda")
        this.emit('delete', element)
        this.elements = this.elements.filter(el => el.index !== index)
        this.components.delete(index)
        this.render()
        if(!this.elements.length) {
            this.active.value = undefined
        }
        return this;
    }

    setActive(state: boolean, data: FormElementData) {
        if (!state && !this.active.value) return

        if (this.active.value?.index === data.index) {
            if (state === true) {
                this.active.value = data
            } else {
                this.active.value = undefined
            }

            return
        }

        if (state) {
            this.active.value = data
            return
        }
    }


    move(oldIndex: number, newIndex: number) {
        const element = this.elements[oldIndex]
        this.elements.splice(oldIndex, 1)
        this.elements.splice(newIndex, 0, element)
        this.elements = this.elements.map((el, index) => ({ ...el, index }))
        this.components.clear()
        this.render()
        return this;
    }

    get(index: number) {
        return this.elements[index]
    }

    repositionElement() {
        if (this.latestEnter === undefined) return console.warn("No element to reposition")
        if (this.latestEnter === this.movingElement) return

        const movingIndex = Number(this.movingElement)
        const newIndex = Number(this.latestEnter)
        this.move(movingIndex, newIndex)
    }
}