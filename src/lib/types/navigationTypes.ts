export interface User {
    id: string,
    username: string,
    profile_picture: string,
    badges: string[]
}

export interface Game {
    id: number,
    game_cover: string,
    game_name: string
}

export interface Tag {
    tag: string
}

export interface Tournament {
    id: number,
    title: string,
    cover_image: string,
    authUserId: string,
    players: User[]
}