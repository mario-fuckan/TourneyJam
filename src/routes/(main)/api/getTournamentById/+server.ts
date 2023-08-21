import { json } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"
import type { Player } from "$lib/types/player"

export const POST: RequestHandler = async ({ request }) => {
    const id = await request.json()

    const getTournament = await prisma.tournament.findFirst({
        where: {
            id: Number(id)
        },
        include: {
            game: {
                select: {
                    game_name: true,
                    id: true
                }
            },
            authUser: {
                select: {
                    id: true,
                    username: true,
                    profile_picture: true,
                    badges: true
                }
            }
        }
    })

    const getTournamentPlayers = await prisma.tournamentPlayers.findMany({
        where: {
            tournamentId: Number(id)
        },
        select: {
            AuthUser: {
                select: {
                    username: true,
                    id: true,
                    badges: true,
                    profile_picture: true
                }
            }
        }
    })

    let players: Player[] = getTournamentPlayers.map((item) => {
        return item.AuthUser
    })

    return json({
        tournament: getTournament,
        players
    })
}