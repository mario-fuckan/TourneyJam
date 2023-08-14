import type { PageServerLoad, Actions } from "./$types"
import { prisma } from "$lib/server/prisma"
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