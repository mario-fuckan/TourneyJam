import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    const searchUsers = await prisma.authUser.findMany({
        where: {
            username: {
                contains: search,
                mode: "insensitive"
            }
        }, select: {
            username: true,
            profile_picture: true,
            badges: true
        }, take: 3
    })

    const searchGames = await prisma.game.findMany({
        where: {
            game_name: {
                contains: search,
                mode: "insensitive"
            }
        }, select: {
            game_name: true,
            game_cover: true,
            id: true
        }, take: 3
    })

    const searchTournaments = await prisma.tournament.findMany({
        where: {
            title: {
                contains: search,
                mode: "insensitive"
            }
        },
        select: {
            title: true,
            cover_image: true,
            id: true
        }, take: 3
    })

    const searchTags = await prisma.tag.findMany({
        where: {
            tag: {
                contains: search,
                mode: "insensitive"
            }
        },
        select: {
            tag: true,
            slug: true
        }, take: 3
    })

    return json({
        searchUsers: searchUsers,
        searchGames: searchGames,
        searchTournaments: searchTournaments,
        searchTags: searchTags
    })
}