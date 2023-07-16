const request = require('supertest');
const app = require('../app');

describe('Authentication Routes', () => {
  it('should return status 200 for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return status 200 for GET /login', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(200);
  });

  it('should return status 302 for POST /login (with invalid credentials)', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'invalid', password: 'wrongpassword' });
    expect(response.status).toBe(302);
  });

  // Add more tests for other authentication routes if needed
});

describe('Protected Routes', () => {
  let authenticatedUser;

  beforeEach(async () => {
    // Authenticate a user before each test in this block
    authenticatedUser = request.agent(app);
    await authenticatedUser.post('/login').send({ username: 'testuser', password: 'testpassword' });
  });

  it('should return status 200 for GET /dashboard when authenticated', async () => {
    const response = await authenticatedUser.get('/dashboard');
    expect(response.status).toBe(200);
  });

  it('should return status 302 for GET /dashboard when not authenticated', async () => {
    const response = await request(app).get('/dashboard');
    expect(response.status).toBe(302);
  });

  // Add more tests for other protected routes if needed
});
