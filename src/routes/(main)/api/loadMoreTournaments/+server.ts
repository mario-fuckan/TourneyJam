import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const toSkip: number = await request.json()

    const getMoreTournaments = await prisma.tournament.findMany({
        where: {
            status: {
                not: "ended"
            }
        },
        orderBy: {
            id: "desc"
        },
        select: {
            id: true,
            cover_image: true,
            tags: true,
            title: true,
            prize: true,
            max_slots: true,
            type: true,
            status: true,
            startOn: true,
            authUser: {
                select: {
                    username: true,
                    profile_picture: true,
                    badges: true
                }
            }
        },
        take: 12, skip: toSkip
    })

    const getMoreTournamentsTotal = await Promise.all(getMoreTournaments.map(async (tournament) => {
        const tournamentPlayers = await prisma.tournamentPlayers.findMany({
            where: {
                tournamentId: tournament.id
            },
            select: {
                AuthUser: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })

        interface Player {
            id: string,
            username: string
        }

        let players: Player[] = []

        tournamentPlayers.map((player) => {
            players.push(player.AuthUser)
        })

        return {
            ...tournament,
            players
        }
    }))

    return json({
        moreTournaments: getMoreTournamentsTotal
    })
}