import { tokenCheckMiddleware } from '../../src/middlewares/auth.middleware';
import { CustomError } from '../../src/utils/custom-error';

// mock del service che altrimenti leggerebbe dal DB
jest.mock('@/modules/user/user.service', () => ({
  userByIdService: jest.fn(),
}));
import { userByIdService } from '../../src/modules/user/user.service';

describe('tokenCheckMiddleware', () => {
  const res: any = {};
  const next = jest.fn();

  beforeEach(() => {
    next.mockReset();
    (userByIdService as jest.Mock).mockReset();
  });

  it('procede se i token sono > 0', async () => {
    (userByIdService as jest.Mock).mockResolvedValue({
      id: 'abc',
      tokenDisponibili: 5,
      role: 'utente',
    });

    const req: any = { context: { userId: 'abc' } };

    await tokenCheckMiddleware(req, res, next);

    expect(userByIdService).toHaveBeenCalledWith('abc');
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // no error
  });

  it('solleva 401 se token = 0', async () => {
    (userByIdService as jest.Mock).mockResolvedValue({
      id: 'abc',
      tokenDisponibili: 0,
      role: 'utente',
    });

    const req: any = { context: { userId: 'abc' } };

    await tokenCheckMiddleware(req, res, next);

    const err = next.mock.calls[0][0] as CustomError;
    expect(err).toBeInstanceOf(CustomError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toMatch(/Token esauriti/i);
  });

  it('solleva 401 se manca userId nel context', async () => {
    const req: any = { context: {} };

    await tokenCheckMiddleware(req, res, next);

    const err = next.mock.calls[0][0] as CustomError;
    expect(err).toBeInstanceOf(CustomError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toMatch(/User mancante nel contesto/i);
  });

  it('solleva 404 se utente inesistente', async () => {
    (userByIdService as jest.Mock).mockResolvedValue(null);

    const req: any = { context: { userId: 'abc' } };

    await tokenCheckMiddleware(req, res, next);

    const err = next.mock.calls[0][0] as CustomError;
    expect(err).toBeInstanceOf(CustomError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toMatch(/Utente non trovato/i);
  });
});