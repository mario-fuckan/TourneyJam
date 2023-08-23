import { prisma } from "$lib/server/prisma"
import { redirect, fail } from "@sveltejs/kit"
import type { Actions } from "./$types"
import type { Type } from "@prisma/client"

export async function load({ params, locals }) {
    const { session, user } = await locals.auth.validateUser()
    const { id } = params

    if (!session) {
        throw redirect(302, `/tournaments/${id}`)
    }

    const checkIfTournamentExists = await prisma.tournament.findFirst({
        where: {
            id: Number(id),
            authUserId: user.userId
        }
    })

    if (!checkIfTournamentExists) {
        throw redirect(302, `/tournaments/${id}`)
    }
}

export const actions: Actions = {
    default: async ({ request, params }) => {
        const { id } = params

        const { title, description, cover_image, prize, startOn, type, password, tags, creatorString, status } = Object.fromEntries(await request.formData()) as {
            title: string,
            description: string,
            cover_image: string,
            prize: string,
            startOn: string,
            type: string,
            password: string,
            tags: string,
            creatorString: string,
            status: "active" | "scheduled" | "ended"
        }

        if (!title || !description || !cover_image || !prize || !startOn || !type) {
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

        if (status == "active") {
            await prisma.tournament.update({
                where: {
                    id: Number(id)
                },
                data: {
                    title,
                    description,
                    cover_image,
                    prize: Number(prize),
                    startOn: new Date(),
                    type: type as Type,
                    password,
                    tags: tags.length != 0 ? tags.split(",") : [],
                    status: status,
                    creatorStream: creatorString
                }
            })
        } else {
            await prisma.tournament.update({
                where: {
                    id: Number(id)
                },
                data: {
                    title,
                    description,
                    cover_image,
                    prize: Number(prize),
                    startOn: new Date(startOn),
                    type: type as Type,
                    password,
                    tags: tags.length != 0 ? tags.split(",") : [],
                    status: status,
                    creatorStream: creatorString
                }
            })
        }

        return {
            done: true
        }
    }
}