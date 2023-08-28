import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const username = await request.json()

    const getUserProfile = await prisma.authUser.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            role: true,
            prizeWon: true,
            socials: true,
            badges: true,
            join_date: true,
            xp: true,
            level: true,
            profile_picture: true,
            id: true,
            tournamentsPlayed: true
        }
    })

    if (getUserProfile?.role == "company") {
        const getUserGames = await prisma.game.findMany({
            where: {
                authUserId: getUserProfile.id
            },
            select: {
                id: true,
                game_cover: true,
                game_name: true
            }
        })

        return json({
            user: getUserProfile,
            userGames: getUserGames
        })
    }

    return json({
        user: getUserProfile
    })
}