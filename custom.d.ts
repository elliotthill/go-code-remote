declare namespace Express {
    export interface Request {
        user?: {
            id: number,
            email: string,
            username: string,
            password: string,
        }
    }
    export interface User{
        id: number,
        email: string,
        username: string,
        password: string,
    }

}