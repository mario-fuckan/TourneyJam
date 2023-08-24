import { writable } from "svelte/store"

const dataToPass = writable({
    level: 0,
    xp: 0,
    refresh: false
})

export default dataToPass