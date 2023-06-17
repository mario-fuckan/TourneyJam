import { error } from "@sveltejs/kit"

export async function load() {
    throw error(404, {
        message: "This page does not exist."
    })
}