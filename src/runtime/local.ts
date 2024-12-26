import { type Ref, h, inject, defineComponent, resolveComponent, isReactive, shallowReactive, type Component, shallowRef, type Reactive, reactive, computed } from "vue"
import type {
    Page,
    Item,
    Stores,
    Pages,
    Input,
    FormElementData,
    ButtonElementData,
    CheckboxElementData,
    FileInputElementData,
    ImageInputElementData,
    InputElementData, RadioElementData, RichTextElementData, SelectElementData, StaticElementData, TextareaElementData
} from "./types"
import { activePageIndexKey, draggedElementKey } from "./utils/symbols"
import { Field } from './utils/constants';
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
} from "./utils/functions";

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
                onActive: (index: number, val: FormElementData) => {
                    this.$emit("active", index, val)
                },
                starter: starter
            }))
        }
    })
}

export class Elements {
    private elements: Array<Reactive<FormElementData>> = []
    public components = shallowReactive(new Map<number, Component>())
    public active = shallowRef<Reactive<FormElementData> | undefined>(undefined);
    private events: { [key: string]: Array<(data: FormElementData) => void> } = {}
    private FormElementsRenderer: ResolvedComponent;
    private movingElement: number | undefined;
    private latestEnter: number | undefined;
    private backpressure: { [key: string]: Array<FormElementData> } = {}
    private pageIndex: number;

    constructor(FormElementsRenderer: ResolvedComponent, pageIndex: number) {
        this.FormElementsRenderer = FormElementsRenderer
        this.pageIndex = pageIndex
    }

    private initialiseElementData(type: Input) {
        const index = this.elements.length;
        let data;
        switch (true) {
            case isInput({ type }):
                data = {
                    inputType: type,
                    type: type,
                    label: (function (field: Field) {
                        switch (field) {
                            case Field.EMAIL:
                                return "Email"
                            default:
                                return ''
                        }
                    }(type)),
                    placeholder: '',
                    value: '',
                    index
                } satisfies InputElementData;
                break;

            case isImageInput({ type }):
                data = {
                    type: Field.IMAGE,
                    inputType: Field.IMAGE,
                    label: '',
                    accept: undefined,
                    value: undefined,
                    index
                } satisfies ImageInputElementData;
                break;

            case isFileInput({ type }):
                data = {
                    type: Field.FILE,
                    inputType: Field.FILE,
                    label: '',
                    index
                } satisfies FileInputElementData;
                break;

            case isCheckbox({ type }):
                data = {
                    type: Field.CHECKBOX,
                    inputType: Field.CHECKBOX,
                    label: '',
                    multiple: true,
                    index
                } satisfies CheckboxElementData;
                break;

            case isButton({ type }):
                data = {
                    type: Field.BUTTON as any,
                    inputType: 'submit',
                    label: '',
                    index
                } satisfies ButtonElementData;
                break;

            case isRadio({ type }):
                data = {
                    type: Field.RADIO,
                    inputType: Field.RADIO,
                    label: '',
                    value: false,
                    options: undefined,
                    index
                } satisfies RadioElementData;
                break;

            case isStatic({ type }):
                data = {
                    type: Field.STATIC,
                    inputType: Field.STATIC,
                    index,
                    text: '',
                    label: undefined as never,
                    value: undefined as never
                } satisfies StaticElementData;
                break;

            case isTextarea({ type }):
                data = {
                    type: Field.TEXTAREA,
                    inputType: Field.TEXTAREA,
                    label: '',
                    placeholder: '',
                    value: '',
                    index
                } satisfies TextareaElementData;
                break;

            case isSelect({ type }):
                data = {
                    label: '',
                    type: Field.SELECT as any,
                    inputType: Field.SELECT as any,
                    index
                } satisfies SelectElementData;
                break;

            case isRichText({ type }):
                data = {
                    type: Field.RICHTEXT,
                    label: '',
                    value: '',
                    inputType: Field.RICHTEXT,
                    index
                } satisfies RichTextElementData;
                break
            default:
                alert("Unsupported Field Type")
                throw new Error("Unsupported Field Type")
        }

        return reactive(data)
    }


    add(fieldName: Input) {
        const data = this.initialiseElementData(fieldName)
        this.elements.push(data)
        this.emit('add', data)
        return this;
    }

    on(event: 'add' | 'delete' | 'update', callback: (data: Reactive<FormElementData>) => void) {
        if (!this.events[event]) this.events[event] = []
        this.events[event].push(callback)
        const backpressure = this.backpressure[event]
        if (backpressure && backpressure.length) {
            backpressure.forEach(callback)
            delete this.backpressure[event]
        }
    }

    starter(data: Array<FormElementData>) {
        if (!data || data.length === 0) return this;
        data.map(el => {
            const index = el.index || this.elements.length
            const datum = reactive({ ...el, index })
            this.elements.push(datum)
            this.emit('add', this.elements[index])
        })
        this.render()
        return this;
    }

    private emit(event: 'add' | 'delete' | 'update', data: Reactive<FormElementData>) {
        if (!isReactive(data)) {
            console.warn("Non reactive data found: ", data)
        }
        const functions = this.events[event]
        if (!functions || event.length === 0) {
            if (!this.backpressure[event]) {
                this.backpressure[event] = []
            }
            this.backpressure[event].push(data)
            return
        }
        for (const callback of functions) {
            callback(data)
        }
    }

    createComponent(data: Reactive<FormElementData>): Component {
        if (!isReactive(data)) {
            console.warn("Non reactive data passed to create component of Elements: ", data)
        }
        return defineComponent({
            setup: () => {
                const onDragStart = (_: Event) => {
                    this.movingElement = data.index
                }
                const onDragEnter = (_: Event) => {
                    this.latestEnter = data.index
                }
                const activePageIndex = inject<Ref<number | undefined>>(activePageIndexKey)
                return {
                    FormElementsRenderer: this.FormElementsRenderer,
                    delete: this.delete.bind(this),
                    onDragStart, onDragEnter,
                    setActive: this.setActive.bind(this),
                    pageIndex: this.pageIndex,
                    reactive: {
                        active: this.active,
                        activePageIndex: activePageIndex!,
                    }
                }
            },
            render() {
                return h('div', { onDragstart: this.onDragStart, onDragenter: this.onDragEnter }, h(this.FormElementsRenderer, {
                    data: data,
                    active: computed(() => {
                        const onCurrentPage = this.pageIndex === this.reactive.activePageIndex.value
                        const onCurrentElement = this.reactive.active.value === data
                        return onCurrentElement && onCurrentPage
                    }),
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

    isRendered(el: Reactive<FormElementData>) {
        return this.components.has(el.index)
    }

    update(index: number, data: Reactive<FormElementData>) {
        const component = this.createComponent(data)
        this.components.delete(index)
        this.components.set(data.index, component)
        return this;
    }

    delete(index: number) {
        const element = this.elements.find(el => el.index === index)
        if (!element) return console.warn("Buda")
        this.emit('delete', element)
        this.elements = this.elements.filter(el => el.index !== index)
        this.components.delete(index)
        this.render()
        if (!this.elements.length) {
            this.active.value = undefined
        }
        return this;
    }

    setActive(state: boolean, data: Reactive<FormElementData>) {
        if (!isReactive(data)) {
            console.error("Non reactive data passed to setActive of Elements: ", data)
        }

        if (!state && !this.active.value) return

        if (this.active.value === data) {
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

export function clearPages() {
    if(import.meta.client){
        document.querySelectorAll("#dropzone").forEach((el) => {
          const container = el.closest(".canvas-container");
          if (container) {
            container.remove();
          } else {
            console.warn("Container not found for", el);
          }
        });
    }
    console.warn("cCleared all pages | page data may have not been cleared yet")
}


export function createStorePage(Store: ReturnType<typeof resolveComponent>, stores: Stores, starter?: Item[] | undefined) {
    return defineComponent({
        setup() {
            const storeIndex = Object.keys(stores || {})?.length
            return { storeIndex }
        },
        render() {
            return h('div', h(Store, {
                onItem: (item: Item) => {
                    addStoreItem(stores, item)
                },
                onDeleteItem: (item: Item) => {
                    deleteStoreItem(stores, item)
                },
                onDeleteStore: (index: number) => {
                    deleteStore(stores, index)
                },
                storeIndex: this.storeIndex,
                starter: starter
            }))
        }
    })
}

function addStoreItem(stores: Stores, item: Item) {
    const store = stores[item.store]
    if (store) {
        stores[item.store].push(item)
    } else {
        stores[item.store] = [item]
    }
}

function deleteStoreItem(stores: Stores, item: Item) {
    const store = stores[item.store]
    if (store) {
        stores[item.store] = store.filter(el => el.index !== item.index)
    } else {
        console.warn("Store not found")
    }
}

function deleteStore(stores: Stores, id: number) {
    delete stores[id]
}