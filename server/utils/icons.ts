import {readFile} from "node:fs/promises";

export function __readIcon(name: string){
    if (!name) return null
    if (!name.endsWith(".svg")) name += ".svg"
    return readFile(`${process.cwd()}/public/icons/${name}`, "utf-8")
}