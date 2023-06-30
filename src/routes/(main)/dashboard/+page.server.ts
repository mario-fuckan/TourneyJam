import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals }) => {
    const { user, session } = await locals.auth.validateUser()

    if (!session || user.role != "admin") {
        throw redirect(302, "/")
    }
}