export interface Users {
    username: string,
    profile_picture: string,
    badges: Badges[]
}

enum Badges {
    registered,
    verified,
    admin
}

export interface Games {
    id: number,
    game_name: string,
    game_cover: string
}

export interface Tournaments {
    id: number,
    cover_image: string,
    title: string
}

export interface Tags {
    tag: string,
    slug: string
}