interface Badges {
    [key: string]: {
        icon: string,
        color: string
    }
}

export const badges: Badges = {
    company: {
        icon: "material-symbols:joystick",
        color: "#7f879c"
    },
    verified: {
        icon: "material-symbols:verified",
        color: "blue"
    },
    admin: {
        icon: "mdi:crown",
        color: "gold"
    }
}