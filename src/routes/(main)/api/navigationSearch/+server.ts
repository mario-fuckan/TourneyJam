import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export async function GET({ url }) {
    const query: string | null = url.searchParams.get("query")

    if (query) {
        const getUsers = await prisma.authUser.findMany({
            orderBy: {
                join_date: "desc"
            },
            where: {
                username: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                username: true,
                profile_picture: true,
                badges: true
            },
            take: 4
        })

        const getGames = await prisma.game.findMany({
            orderBy: {
                id: "desc"
            },
            where: {
                game_name: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                game_cover: true,
                game_name: true
            },
            take: 4
        })

        const getTags = await prisma.tag.findMany({
            orderBy: {
                id: "desc"
            },
            where: {
                tag: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: {
                tag: true
            },
            take: 4
        })

        let getTournaments = await prisma.tournament.findMany({
            orderBy: {
                id: "desc"
            },
            where: {
                title: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                title: true,
                cover_image: true,
                authUserId: true
            }, take: 4
        })

        getTournaments = await Promise.all(getTournaments.map(async (tournament) => {
            const getPlayers = await prisma.tournamentPlayers.findMany({
                where: {
                    tournamentId: tournament.id
                },
                select: {
                    AuthUser: {
                        select: {
                            id: true,
                            username: true,
                            profile_picture: true,
                            badges: true
                        }
                    }
                }
            })

            return { ...tournament, players: getPlayers.map((player) => player.AuthUser) }
        }))

        return json({
            users: getUsers,
            games: getGames,
            tags: getTags,
            tournaments: getTournaments
        })
    }
}