import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"
import type { Player } from "$lib/types/leaderboardplayer"

export async function GET({ url }) {
    const filter: string | null = url.searchParams.get("filter")
    const skip: string | null = url.searchParams.get("skip")
    const username: string | null = url.searchParams.get("username")
    let players: Player[] = []

    const maxPlayers = await prisma.authUser.count()

    if (filter == "Wins") {
        if (username) {
            players = await prisma.authUser.findMany({
                where: {
                    username: {
                        contains: username,
                        mode: "insensitive"
                    }
                },
                orderBy: {
                    wins: "desc"
                },
                select: {
                    profile_picture: true,
                    username: true,
                    id: true,
                    prizeWon: true,
                    badges: true,
                    wins: true,
                    tournamentsPlayed: true
                },
                skip: Number(skip),
                take: 10
            })
        } else {
            players = await prisma.authUser.findMany({
                orderBy: {
                    wins: "desc"
                },
                select: {
                    profile_picture: true,
                    username: true,
                    id: true,
                    prizeWon: true,
                    badges: true,
                    wins: true,
                    tournamentsPlayed: true
                },
                skip: Number(skip),
                take: 10
            })
        }
    }

    if (filter == "Prize Won") {
        if (username) {
            players = await prisma.authUser.findMany({
                where: {
                    username: {
                        contains: username,
                        mode: "insensitive"
                    }
                },
                orderBy: {
                    prizeWon: "desc"
                },
                select: {
                    profile_picture: true,
                    username: true,
                    id: true,
                    prizeWon: true,
                    badges: true,
                    wins: true,
                    tournamentsPlayed: true
                },
                skip: Number(skip),
                take: 10
            })
        } else {
            players = await prisma.authUser.findMany({
                orderBy: {
                    prizeWon: "desc"
                },
                select: {
                    profile_picture: true,
                    username: true,
                    id: true,
                    prizeWon: true,
                    badges: true,
                    wins: true,
                    tournamentsPlayed: true
                },
                skip: Number(skip),
                take: 10
            })
        }
    }

    if (filter == "Tournaments Played") {
        if (username) {
            players = await prisma.authUser.findMany({
                where: {
                    username: {
                        contains: username,
                        mode: "insensitive"
                    }
                },
                orderBy: {
                    tournamentsPlayed: "desc"
                },
                select: {
                    profile_picture: true,
                    username: true,
                    id: true,
                    prizeWon: true,
                    badges: true,
                    wins: true,
                    tournamentsPlayed: true
                },
                skip: Number(skip),
                take: 10
            })
        } else {
            players = await prisma.authUser.findMany({
                orderBy: {
                    tournamentsPlayed: "desc"
                },
                select: {
                    profile_picture: true,
                    username: true,
                    id: true,
                    prizeWon: true,
                    badges: true,
                    wins: true,
                    tournamentsPlayed: true
                },
                skip: Number(skip),
                take: 10
            })
        }
    }

    return json({
        players,
        maxPlayers
    })
}