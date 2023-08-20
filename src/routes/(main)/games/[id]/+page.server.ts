import type { PageServerLoad } from "./$types"
import { prisma } from "$lib/server/prisma"
import { error } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params

    try {
        const checkIfGameExists = await prisma.game.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!checkIfGameExists) {
            throw error(404, "This game does not exist.")
        }
    } catch {
        throw error(404, "This game does not exist.")
    }
}