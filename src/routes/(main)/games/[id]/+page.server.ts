import type { PageServerLoad, Actions } from "./$types"
import { prisma } from "$lib/server/prisma"
import { auth } from "$lib/server/lucia"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params

    const checkIfGameExists = await prisma.game.findUnique({
        where: {
            id: Number(id)
        }
    })

    if (!checkIfGameExists) {
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