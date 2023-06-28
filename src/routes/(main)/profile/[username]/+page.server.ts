import type { PageServerLoad, Actions } from "./$types"
import { prisma } from "$lib/server/prisma"
import { auth } from "$lib/server/lucia"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ params }) => {
    const { username } = params

    const checkIfUserExists = await prisma.authUser.findUnique({
        where: {
            username: username
        }
    })

    if (!checkIfUserExists) {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ locals }) => {
        const session = await locals.auth.validate()

        if (session) {
            await auth.invalidateSession(session.sessionId)
            locals.auth.setSession(null)
        }
    }
}