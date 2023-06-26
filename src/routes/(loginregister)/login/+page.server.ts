import type { Actions, PageServerLoad } from "./$types"
import { auth } from "$lib/server/lucia"
import { fail, redirect } from "@sveltejs/kit"
import { LuciaError } from "lucia-auth"

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate()

    if (session) {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const { username, password } = Object.fromEntries(await request.formData()) as {
            username: string,
            password: string
        }

        if (!username || !password) {
            let missing: string[] = []

            if (!username) {
                missing.push("Username")
            }

            if (!password) {
                missing.push("Password")
            }

            return fail(400, {
                missing
            })
        }

        try {
            const key = await auth.useKey("username", username, password)
            const session = await auth.createSession(key.userId)
            locals.auth.setSession(session)
        } catch (err) {
            if (err instanceof LuciaError && (err.message === "AUTH_INVALID_KEY_ID" || err.message === "AUTH_INVALID_PASSWORD")) {
                return fail(400, {
                    message: "Incorrect username or password."
                })
            }

            return fail(500, {
                message: "Unknown error occurred"
            })
        }
    }
}