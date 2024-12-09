import { type Ref, defineComponent, h, render, resolveComponent } from "vue"
import type { Item, Stores } from "../../types"


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