export interface UserFull {
    id: string,
    email: string,
    badges: Badges[],
    join_date: Date,
    level: number,
    prizeWon: number,
    profile_picture: string,
    role: Role,
    username: string,
    socials: Array<any>,
    xp: number,
    tournamentsPlayed: number
}

enum Badges {
    verified,
    admin,
    company
}

enum Role {
    user,
    admin,
    company
}