export default defineEventHandler(async (event) =>{
    const name = event.context.params?.icon
    if (!name) return new Response("No icon name provided", { status: 400 })

    const icon = await __readIcon(name)
    if (!icon) return new Response("Icon not found", { status: 404 })

    return new Response(icon, {
        headers: {
            "Content-Type": "image/svg+xml"
        }
    })
})