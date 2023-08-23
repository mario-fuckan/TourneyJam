import type { PageServerLoad } from "./$types"
import { prisma } from "$lib/server/prisma"
import { error } from "@sveltejs/kit"

export async function load({ params }) {
    const { id } = params

    try {
        const checkIfTournamentExists = await prisma.tournament.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!checkIfTournamentExists) {
            throw error(404, "This tournament does not exist.")
        }
    } catch {
        throw error(404, "This tournament does not exist.")
    }
}