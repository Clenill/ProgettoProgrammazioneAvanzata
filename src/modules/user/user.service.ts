import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { vJWT } from '@/middlewares/jwt.service';
import { validateAddToken } from './user.validator';
import { HttpStatus } from '@/utils/http-status';

/**
 * Restituisce il profilo utente partendo dal token di accesso.
 *
 * Funzionalità:
 * - Decodifica e verifica il JWT
 * - Recupera l'ID utente contenuto nel payload
 * - Carica il profilo dal DB
 *
 * @param accessToken Token JWT da validare
 * 
 * @throws CustomError 401 se il token è invalido
 * @throws CustomError 404 se l'utente non esiste
 * 
 * @returns Dati dell'utente
 */
export const getUserProfileService = async (accessToken: string) => {
    const decodeToken = await vJWT(accessToken);

    const userId = decodeToken.userId;

    const user = await repo.getUserProfile(userId);
    if (!user) {
        throw new CustomError('Utente non trovato', HttpStatus.NOT_FOUND);
    }

    return user;
};

/**
 * Restituisce un utente tramite il suo ID.
 *
 * @param userId ID dell’utente da cercare
 * 
 * @throws CustomError 404 se l’utente non esiste
 * 
 * @returns Dati dell'utente
 */
export const userByIdService = async (userId: string) => {
    const user = await repo.getUserProfile(userId);
    if(!user) {
        throw new CustomError('Utente non trovato', HttpStatus.NOT_FOUND);
    }
    return user;
}

/**
 * Modifica il saldo dei token di un utente, aumentando o diminuendo il valore.
 *
 * Funzionalità:
 * - Recupera il profilo dell’utente
 * - Calcola il nuovo saldo
 * - Impedisce che il saldo diventi negativo
 * - Aggiorna il valore nel DB
 *
 * @param userId ID dell’utente
 * @param tokenChange Numero di token da aggiungere (positivo) o scalare (negativo)
 * 
 * @throws CustomError 404 se l’utente non esiste
 * @throws CustomError 400 se il risultato porterebbe i token sotto zero
 */
export const modificaUserTokensService = async (
    userId: string,
    tokenChange: number,
): Promise<void> => {
    const user = await repo.getUserProfile(userId);
    if(!user) {
        throw new CustomError('User not found', HttpStatus.NOT_FOUND);
    }

    const newBalance = user.tokenDisponibili + tokenChange;
    if (newBalance < 0) {
        throw new CustomError('Token insufficienti per completare l’operazione.', HttpStatus.BAD_REQUEST);
    }
    await repo.modificaUserTokens(userId, newBalance);
};

/**
 * Aggiunge token a un utente (funzionalità esclusiva dell’admin).
 *
 * Funzionalità:
 * - Valida input con validator dedicato
 * - Verifica che l’utente esista
 * - Incrementa il numero di token
 *
 * @param data Oggetto contenente userId e numero di token da aggiungere
 * 
 * @throws CustomError 400 se i dati non sono validi
 * @throws CustomError 404 se l’utente non esiste
 * 
 * @returns Oggetto con userId e token aggiunti
 */
export const addTokenToUser = async (data: any) => {
    const { error } = validateAddToken(data);
    if (error) {
        throw new CustomError(error.details[0].message, HttpStatus.BAD_REQUEST);
    }

    const { userId, token } = data;

    const user = await repo.getUserProfile(userId);
    if(!user) {
        throw new CustomError("Utente non trovato", HttpStatus.NOT_FOUND);
    }

    await repo.addToken(userId, token);

    return {
        userId,
        added: token,
    };
}