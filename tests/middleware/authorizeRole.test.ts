import { authorizeRoles } from '../../src/middlewares/auth.middleware';
import { CustomError } from '../../src/utils/custom-error';
import { HttpStatus } from '../../src/utils/http-status';

jest.mock('@/modules/user/user.service', () => ({
  userByIdService: jest.fn(),
}));

jest.mock('@/middlewares/jwt.service', () => ({
  vJWT: jest.fn(),
}));

describe('authorizeRoles middleware', () => {
  const next = jest.fn();

  beforeEach(() => next.mockReset());

  it('permette accesso se il ruolo è incluso', () => {
    const req: any = { context: { role: 'admin' } };
    const res: any = {};

    const mw = authorizeRoles('admin', 'utente');
    mw(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // no error
  });

  it('nega accesso se il ruolo non è incluso', () => {
    const req: any = { context: { role: 'utente' } };
    const res: any = {};

    const mw = authorizeRoles('admin'); // solo admin
    
    expect(() => mw(req, res, next)).toThrow(CustomError);

    try {
      mw(req, res, next);
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(err.message).toMatch(/Accesso non autorizzato/i);
    }
  });

  it('nega accesso quando manca user nel contesto', () => {
    const req: any = {}; // no context
    const res: any = {};

    const mw = authorizeRoles('admin');
    expect(() => mw(req, res, next)).toThrow(CustomError);

    try {
      mw(req, res, next);
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    }
  });
});