const request = require('supertest');
const app = require('../src/app');

describe('Publishers API', () => {
  it('should get all publishers', async () => {
    const response = await request(app).get('/publishers');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should create a new publisher', async () => {
    const newPublisher = {
      name: 'New Publisher',
      location: 'Berlin, Germany'
    };

    const response = await request(app)
      .post('/publishers')
      .send(newPublisher);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newPublisher.name);
    expect(response.body.location).toBe(newPublisher.location);
  });

  it('should get a publisher by ID', async () => {
    const publisherId = 1;

    const response = await request(app).get(`/publishers/${publisherId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', publisherId);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('location');
  });

  it('should update a publisher by ID with the full object', async () => {
    const updatedPublisher = {
      id: 1,
      name: 'Updated Publisher Name',
      location: 'San Francisco, USA'
    };

    const response = await request(app)
      .put(`/publishers/${updatedPublisher.id}`)
      .send(updatedPublisher);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedPublisher);
  });

  it('should partially update a publisher by ID', async () => {
    const partialUpdate = {
      location: 'New Location, USA'
    };

    const response = await request(app)
      .patch('/publishers/1')
      .send(partialUpdate);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body.location).toBe(partialUpdate.location);
  });

  it('should delete a publisher by ID', async () => {
    // First, create a publisher to delete
    const newPublisher = {
      name: 'Publisher to Delete',
      location: 'Delete Location'
    };

    const createResponse = await request(app)
      .post('/publishers')
      .send(newPublisher);
    
    const publisherId = createResponse.body.id; // Get the ID of the created publisher

    // Delete the publisher
    const deleteResponse = await request(app)
      .delete(`/publishers/${publisherId}`);

    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.body).toEqual({}); // Ensure response body is empty

    // Verify that the publisher was actually deleted
    const getResponse = await request(app).get(`/publishers/${publisherId}`);
    expect(getResponse.status).toBe(404);
    expect(getResponse.text).toBe('Publisher not found');
  });

  it('should return 404 when deleting a non-existent publisher ID', async () => {
    const response = await request(app)
      .delete('/publishers/999');
    
    expect(response.status).toBe(404);
    expect(response.text).toBe('Publisher not found');
  });

  it('should return 404 for a non-existent publisher ID', async () => {
    const response = await request(app).get('/publishers/999');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Publisher not found');
  });

  it('should return 404 when updating a non-existent publisher ID', async () => {
    const updatedPublisher = {
      name: 'Updated Name',
      location: 'Unknown'
    };

    const response = await request(app)
      .put('/publishers/999')
      .send(updatedPublisher);

    expect(response.status).toBe(404);
    expect(response.text).toBe('Publisher not found');
  });

  it('should return 404 when partially updating a non-existent publisher ID', async () => {
    const partialUpdate = {
      location: 'New Location, USA'
    };

    const response = await request(app)
      .patch('/publishers/999')
      .send(partialUpdate);

    expect(response.status).toBe(404);
    expect(response.text).toBe('Publisher not found');
  });
});
