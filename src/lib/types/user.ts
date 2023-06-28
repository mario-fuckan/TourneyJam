export interface User {
    email: string,
    level: number,
    profile_picture: string,
    role: Role,
    userId: string,
    username: string,
    xp: number
}

enum Role {
    user,
    admin,
    organization
}