import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    const getTournaments = await prisma.tournament.findMany({
        orderBy: {
            id: "desc"
        },
        where: {
            status: {
                not: "ended"
            },
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    game: {
                        game_name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                },
                {
                    tags: {
                        hasSome: search
                    }
                }
            ]
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
            },
            game: {
                select: {
                    game_name: true,
                    id: true
                }
            }
        }
    })

    const getMoreTournamentsTotal = await Promise.all(getTournaments.map(async (tournament) => {
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
        tournaments: getMoreTournamentsTotal
    })
}