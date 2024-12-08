import { type Ref, h, render, type Component, defineComponent, type PropType, type Prop, resolveComponent } from "vue"
import type { FormElementData, Input, Page, Pages } from "~/src/runtime/types"

export function createFormPage(Page: ReturnType<typeof resolveComponent>, canvases: Pages, starter?: Page) {
    return defineComponent({
        props: {
            draggedElement: {
                type: Object as PropType<Input | undefined>,
                required: false
            }
        },
        setup() {
            const index = Object.keys(canvases).length
            return {index}
        },
        render() {
            return h('div', h(Page, {
                draggedElement: this.$props.draggedElement,
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
                starter: starter
            }))
        }
    })
}