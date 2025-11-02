import { validateCalendario } from '../../src/modules/calendario/calendario.validator';

describe('validateCalendario', () => {
  it('accetta un payload valido', () => {
    const data = {
      risorsaId: '550e8400-e29b-41d4-a716-446655440000',
      tokenCostoOrario: 5,
      isArchived: false,
    };
    const { error } = validateCalendario(data);
    expect(error).toBeUndefined();
  });

  it('rifiuta risorsaId non UUID', () => {
    const data = {
      risorsaId: 'not-a-uuid',
      tokenCostoOrario: 5,
    };
    const { error } = validateCalendario(data);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toMatch(/ID risorsa non valido/i);
  });

  it('rifiuta tokenCostoOrario mancante', () => {
    const data = {
      risorsaId: '550e8400-e29b-41d4-a716-446655440000',
    } as any;
    const { error } = validateCalendario(data);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toMatch(/costo orario.*obbligatorio/i);
  });
});