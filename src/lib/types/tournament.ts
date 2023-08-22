export interface Tournament {
    cover_image: string,
    description: string,
    gameId: number,
    id: number,
    authUser: authUser,
    max_slots: number,
    prize: number,
    startOn: Date,
    status: string,
    title: string,
    type: string,
    tags: string[],
    password: string,
    players: authUser[],
    game: Game,
    creatorStream: string,
    authUserId: string,
    bracket: string[]
}

interface Game {
    game_name: string,
    id: number
}

interface authUser {
    username: string,
    profile_picture: string,
    badges: Badges[]
}

enum Badges {
    verified,
    admin,
    company
}