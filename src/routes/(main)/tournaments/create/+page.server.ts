import type { Actions } from "./$types"
import { prisma } from "$lib/server/prisma"
import { redirect, fail } from "@sveltejs/kit"
import type { Type } from "@prisma/client"

export async function load({ locals }) {
    const { session } = await locals.auth.validateUser()

    if (!session) {
        throw redirect(302, "/tournaments")
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const { title, description, cover_image, prize, max_slots, owner, gameId, startOn, type, password, tags, creatorStream } = Object.fromEntries(await request.formData()) as {
            title: string,
            description: string,
            cover_image: string,
            prize: string,
            max_slots: string,
            owner: string,
            gameId: string,
            startOn: string,
            type: string,
            password: string,
            tags: string,
            creatorStream: string
        }

        if (!title || !description || !cover_image || !prize || !max_slots || !startOn || !type) {
            let missing: string[] = []

            if (!title) {
                missing.push("title")
            }

            if (!description) {
                missing.push("description")
            }

            if (!cover_image) {
                missing.push("cover_image")
            }

            if (!prize) {
                missing.push("prize")
            }

            if (!max_slots) {
                missing.push("max_slots")
            }

            if (!startOn) {
                missing.push("startOn")
            }

            if (!type) {
                missing.push("type")
                missing.push("password")
            }

            if (type == "passwordProtected" && !password) {
                missing.push("password")
            }

            return fail(400, {
                where: missing
            })
        }

        if (owner) {
            try {
                await prisma.tournament.create({
                    data: {
                        title,
                        description,
                        cover_image,
                        prize: Number(prize),
                        max_slots: Number(max_slots),
                        authUser: {
                            connect: {
                                id: owner
                            }
                        },
                        game: {
                            connect: {
                                id: Number(gameId)
                            }
                        },
                        startOn: new Date(startOn),
                        type: type as Type,
                        password,
                        tags: tags.length != 0 ? tags.split(",") : [],
                        status: "scheduled",
                        creatorStream
                    }
                })
            } catch (error) {
                console.error(error)
            }

            const getTournamentId = await prisma.tournament.findFirst({
                orderBy: {
                    id: "desc"
                },
                where: {
                    gameId: Number(gameId),
                    authUserId: owner
                },
                select: {
                    id: true
                }
            })

            return {
                done: true,
                createdTournamentId: getTournamentId
            }
        }
    }
}