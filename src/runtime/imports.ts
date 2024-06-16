import {createResolver} from "@nuxt/kit";
import {readdir} from "node:fs/promises";

const resolver = createResolver(import.meta.url);

for (const file of await readdir(resolver.resolve('./utils'))) {
  if (!file.includes('local')) {
    await import(file);
  }
}
