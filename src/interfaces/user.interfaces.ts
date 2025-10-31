export interface User {
    id?: string;
    username: string;
    role: string;
    email: string;
    tokenDisponibili: number;
    created_at: string | undefined;
    updated_at: string | undefined;
}
