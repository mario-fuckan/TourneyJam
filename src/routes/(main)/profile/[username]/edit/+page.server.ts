import type { PageServerLoad, Actions } from "./$types"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ params, locals }) => {
    const { session, user } = await locals.auth.validateUser()

    const paramUsername = params.username

    if (!session || paramUsername != user.username) {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        // OVO SUTRAs
    }
}