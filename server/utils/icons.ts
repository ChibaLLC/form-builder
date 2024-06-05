import { readFile } from "node:fs/promises";
export function __readIcon(name: string) {
    if (!name) return null
    if (!name.endsWith(".svg")) name += ".svg"
    return readFile(`/public/icons/${name}`, "utf-8").catch(e => {
        console.error(e)
        return null
    })  
}