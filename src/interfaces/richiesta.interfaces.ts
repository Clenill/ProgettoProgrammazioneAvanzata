export interface Richiesta {
    id?: string;
    titolo: string;
    motivazione: string;
    dataInizio: Date;
    dataFine: Date;
    stato?: 'pending' | 'invalid' | 'approved' | 'rejected';
    tokenSpesi?: number;
    calendarioId: string;
    userId: string;
    created_at?: string;
    updated_at?: string;
}