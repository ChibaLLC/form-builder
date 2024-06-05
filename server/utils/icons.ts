import { readFile } from "node:fs/promises";
export function __readIcon(name: string) {
    if (!name) return null
    if (!name.endsWith(".svg")) name += ".svg"
    const path = isVercel ? `/icons/${name}` : `public/icons/${name}`
    return readFile(path, "utf-8").catch(e => {
        console.error(e)
        return null
    })  
}