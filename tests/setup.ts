// tests/setup.ts
jest.mock('pg', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    end: jest.fn(),
  })),
}));

jest.mock('sequelize', () => {
  const ActualSequelize = jest.requireActual('sequelize');
  return {
    ...ActualSequelize,
    Sequelize: jest.fn().mockImplementation(() => ({
      define: jest.fn(),
      authenticate: jest.fn(),
    })),
  };
});
