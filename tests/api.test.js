const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
      
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('Budget API', () => {
  test('GET /api/budget should return budget data', async () => {
    const response = await request(app)
      .get('/api/budget')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('totalBudget');
    expect(response.body.data).toHaveProperty('ministries');
    expect(Array.isArray(response.body.data.ministries)).toBe(true);
  });

  test('GET /api/budget with year parameter', async () => {
    const response = await request(app)
      .get('/api/budget?year=2023')
      .expect(200);
      
    expect(response.body.data).toHaveProperty('year', 2023);
  });

  test('GET /api/budget/ministries should return ministries list', async () => {
    const response = await request(app)
      .get('/api/budget/ministries')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('ministries');
    expect(response.body.data).toHaveProperty('totalBudget');
    expect(response.body.data).toHaveProperty('count');
  });

  test('GET /api/budget/expenses should return expense breakdown', async () => {
    const response = await request(app)
      .get('/api/budget/expenses')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('expenses');
    expect(response.body.data.expenses).toHaveProperty('personnel');
    expect(response.body.data.expenses).toHaveProperty('programs');
    expect(response.body.data.expenses).toHaveProperty('investment');
  });
});

describe('Economic API', () => {
  test('GET /api/economic should return economic data', async () => {
    const response = await request(app)
      .get('/api/economic')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('gdp');
    expect(response.body.data).toHaveProperty('inflation');
    expect(response.body.data).toHaveProperty('unemployment');
  });

  test('GET /api/economic/gdp should return GDP data', async () => {
    const response = await request(app)
      .get('/api/economic/gdp')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('current');
    expect(response.body.data).toHaveProperty('history');
    expect(Array.isArray(response.body.data.history)).toBe(true);
  });
});

describe('Ministry API', () => {
  test('GET /api/ministry should return all ministries', async () => {
    const response = await request(app)
      .get('/api/ministry')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('ministries');
    expect(Array.isArray(response.body.data.ministries)).toBe(true);
  });

  test('GET /api/ministry/MINEDUC should return ministry details', async () => {
    const response = await request(app)
      .get('/api/ministry/MINEDUC')
      .expect(200);
      
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('budget');
    expect(response.body.data).toHaveProperty('details');
  });

  test('GET /api/ministry/INVALID should return 404', async () => {
    const response = await request(app)
      .get('/api/ministry/INVALID')
      .expect(404);
      
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Error Handling', () => {
  test('GET /api/nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);
      
    expect(response.body).toHaveProperty('error');
  });
});

describe('Rate Limiting', () => {
  test('Should handle multiple requests within rate limit', async () => {
    const requests = Array(5).fill().map(() => 
      request(app).get('/api/budget')
    );
    
    const responses = await Promise.all(requests);
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});
