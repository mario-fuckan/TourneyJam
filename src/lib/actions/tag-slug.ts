export function toSlug(tag: string) {
    tag = tag.toLowerCase()
    return tag.replace(" ", "-")
}