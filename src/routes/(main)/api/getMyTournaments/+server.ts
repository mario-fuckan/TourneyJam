import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    let userId: string = await request.json()

    const getCreatedTournaments = await prisma.tournament.findMany({
        where: {
            authUserId: userId,
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
            },
            game: {
                select: {
                    game_name: true,
                    id: true
                }
            },
            authUserId: true
        }
    })

    const getJoinedTournaments = await prisma.tournamentPlayers.findMany({
        where: {
            authUserId: userId,
            Tournament: {
                status: {
                    not: "ended"
                }
            }
        },
        orderBy: {
            id: "desc"
        },
        select: {
            Tournament: {
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
                    },
                    authUserId: true
                }
            }
        }
    })

    const allMyTournaments = [...getCreatedTournaments, ...getJoinedTournaments.map((tournament) => tournament.Tournament)]

    const newAllTournaments = await Promise.all(allMyTournaments.map(async (tournament) => {
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
        myTournaments: newAllTournaments
    })
}