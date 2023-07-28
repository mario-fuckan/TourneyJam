import type { Actions } from "./$types"
import { redirect } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export async function load({ locals }) {
    const { user, session } = await locals.auth.validateUser()

    if (!session || user.role != "admin") {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const { tag } = Object.fromEntries(await request.formData()) as {
            tag: string
        }

        await prisma.tag.create({
            data: {
                tag
            }
        })

        return {
            done: true
        }
    }
}