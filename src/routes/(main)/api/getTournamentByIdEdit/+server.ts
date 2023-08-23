import { prisma } from "$lib/server/prisma"
import { json } from "@sveltejs/kit"

export async function POST({ request }) {
    const id = await request.json()

    const getTournament = await prisma.tournament.findUnique({
        where: {
            id: Number(id)
        }
    })

    return json({
        tournament: getTournament
    })
}