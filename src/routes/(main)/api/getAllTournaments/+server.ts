import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    let userId: string = await request.json()

    const getAllTournaments = await prisma.tournament.findMany({
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
            },
            game: {
                select: {
                    game_name: true,
                    id: true
                }
            },
            authUserId: true
        },
        take: 12
    })

    const tournamentCount = await prisma.tournament.count({
        where: {
            status: {
                not: "ended"
            }
        }
    })

    const newAllTournaments = await Promise.all(getAllTournaments.map(async (tournament) => {
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

    let myTournamentCount: number = 0

    if (userId != "") {
        const countMyTournaments = await prisma.tournament.count({
            where: {
                authUserId: userId,
                status: {
                    not: "ended"
                }
            }
        })

        const countPartOfTournament = await prisma.tournamentPlayers.count({
            where: {
                authUserId: userId,
                Tournament: {
                    status: {
                        not: "ended"
                    }
                }
            }
        })

        myTournamentCount = myTournamentCount + countMyTournaments + countPartOfTournament
    }

    return json({
        tournaments: newAllTournaments,
        tournamentCount: tournamentCount,
        myTournamentCount
    })
}