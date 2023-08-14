import { writable } from "svelte/store"

const fetchLocalStorage = writable(false)

export default fetchLocalStorage