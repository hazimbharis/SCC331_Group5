const request = require('supertest');
const app = require('./Server');

describe('Express Server Endpoints', () => {
  it('should get door environment data', async () => {
    const response = await request(app).get('/api/door');
    expect(response.status).toBe(200);
  });

  it('should get environment data from the gym', async () => {
    const response = await request(app).get('/api/gym');
    expect(response.status).toBe(200);
  });

  it('should get prisoner positioning system data', async () => {
    const response = await request(app).get('/api/position');
    expect(response.status).toBe(200);
  });
});
