const cacheService = require('../src/services/cacheService');

describe('Cache Service', () => {
  beforeEach(async () => {
    // Clear cache before each test
    await cacheService.flush();
  });

  afterAll(async () => {
    // Clean up after tests
    await cacheService.flush();
  });

  test('should set and get cache values', async () => {
    const key = 'test-key';
    const value = { data: 'test-data', number: 123 };
    
    await cacheService.set(key, value, 3600);
    const result = await cacheService.get(key);
    
    expect(result).toEqual(value);
  });

  test('should return null for non-existent keys', async () => {
    const result = await cacheService.get('non-existent-key');
    expect(result).toBeNull();
  });

  test('should delete cache values', async () => {
    const key = 'delete-test';
    const value = { test: true };
    
    await cacheService.set(key, value);
    await cacheService.del(key);
    
    const result = await cacheService.get(key);
    expect(result).toBeNull();
  });

  test('should handle cache expiration', async () => {
    const key = 'expire-test';
    const value = { expires: true };
    
    // Set with 1 second TTL
    await cacheService.set(key, value, 1);
    
    // Should exist immediately
    let result = await cacheService.get(key);
    expect(result).toEqual(value);
    
    // Wait for expiration and check again
    await new Promise(resolve => setTimeout(resolve, 1100));
    result = await cacheService.get(key);
    expect(result).toBeNull();
  });

  test('should flush all cache', async () => {
    await cacheService.set('key1', 'value1');
    await cacheService.set('key2', 'value2');
    
    await cacheService.flush();
    
    const result1 = await cacheService.get('key1');
    const result2 = await cacheService.get('key2');
    
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
