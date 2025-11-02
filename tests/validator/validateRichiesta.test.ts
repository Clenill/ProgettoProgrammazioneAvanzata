import { validateRichiesta } from '../../src/modules/richiesta/richiesta.validator';

describe('validateRichiesta', () => {
  it('accetta una richiesta valida', () => {
    const data = {
      titolo: 'Richiesta GPU',
      motivazione: 'utilizzo risorsa per training',
      dataInizio: '2025-01-01T10:00:00Z',
      dataFine: '2025-01-01T12:00:00Z',
      calendarioId: '550e8400-e29b-41d4-a716-446655440000',
      userId: '7b9d6f43-6f38-4e0b-9d1d-6e5dc3a2a111',
    };
    const { error } = validateRichiesta(data);
    expect(error).toBeUndefined();
  });

  it('rifiuta richiesta senza calendarioId', () => {
    const data = {
      titolo: 'x',
      motivazione: 'motivo lungo',
      dataInizio: '2025-01-01T10:00:00Z',
      dataFine: '2025-01-01T11:00:00Z',
      userId: '7b9d6f43-6f38-4e0b-9d1d-6e5dc3a2a111',
    } as any;

    const { error } = validateRichiesta(data);
    expect(error).toBeDefined();
    expect(error!.details.map(d => d.message).join(' ')).toMatch(/calendarioId/i);
  });

  it('rifiuta se dataFine <= dataInizio', () => {
    const data = {
      titolo: 'Richiesta',
      motivazione: 'motivo lungo',
      dataInizio: '2025-01-01T10:00:00Z',
      dataFine: '2025-01-01T09:00:00Z',
      calendarioId: '550e8400-e29b-41d4-a716-446655440000',
      userId: '7b9d6f43-6f38-4e0b-9d1d-6e5dc3a2a111',
    };

    const { error } = validateRichiesta(data);
    expect(error).toBeDefined();
    expect(error!.details.map(d => d.message).join(' ')).toMatch(/data di fine.*successiva/i);
  });
});