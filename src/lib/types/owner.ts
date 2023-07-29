interface Owner {
    username: string,
    id: string
}

export interface OwnerList extends Array<Owner> { }