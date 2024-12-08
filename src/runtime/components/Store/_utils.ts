import { type Ref, defineComponent, h, render, resolveComponent } from "vue"
import type { Item, Stores } from "../../types"


export function createStorePage(Store: ReturnType<typeof resolveComponent>, stores: Stores, starter?: Item[] | undefined) {
    const storeIndex = Object.keys(stores || {})?.length
    return defineComponent({
        render() {
            return h('div', h(Store, {
                onItem: addStoreItem,
                onDeleteItem: deleteStoreItem,
                onDeleteStore: deleteStore,
                storeIndex: storeIndex,
                starter: starter
            }))
        }
    })
}

function addStoreItem(stores: Ref<Stores>, item: Item) {
    const store = stores.value[item.store]
    if (store) {
        stores.value[item.store].push(item)
    } else {
        stores.value[item.store] = [item]
    }
}

function deleteStoreItem(stores: Ref<Stores>, item: Item) {
    const store = stores.value[item.store]
    if (store) {
        stores.value[item.store] = store.filter(el => el.index !== item.index)
    } else {
        console.warn("Store not found")
    }
}

function deleteStore(stores: Ref<Stores>, id: number) {
    delete stores.value[id]
}