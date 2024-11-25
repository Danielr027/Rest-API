const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const path = require('path');

let mongoServer;
let merchantToken = '';
let storeId = '67445eb0bf6d9f7e92430f94';
let webStoreId = '67445eb0bf6d9f7e92430f94';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Registrar y loguear un merchant para obtener token
  await request(app)
    .post('/api/user/register')
    .send({
      nombre: 'Comercio XYZ',
      email: 'comercioxyz@example.com',
      password: 'Password123',
      edad: 35,
      ciudad: 'Madrid',
      intereses: ['lectura', 'deporte'],
      permiteRecibirOfertas: true,
    });

  // Actualizar rol a merchant
  const User = mongoose.model('User');
  await User.updateOne(
    { email: 'comercioxyz@example.com' },
    { role: 'merchant' }
  );

  const loginRes = await request(app)
    .post('/api/user/login')
    .send({
      email: 'comercioxyz@example.com',
      password: 'Password123',
    });

  merchantToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('WebStore Endpoints', () => {
  it('should create a new web store', async () => {
    const res = await request(app)
      .post('/api/webStore')
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        city: 'Madrid',
        activity: 'Mascotas',
        title: 'Tienda Animales',
        resume: 'Las mejores mascotas.',
        textsArray: ['Mascotas especiales', 'Mascotas'],
        imagesArray: ['http://example.com/mascotin1.jpg', 'http://example.com/animalia.jpg'],
        reviews: {
          scoring: 4.9,
          totalRatings: 25,
          reviews: ['Excelentes animales', 'Buen servicio'],
        },
        storeId: storeId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Tienda Animales');
  });

  it('should get all web stores', async () => {
    const res = await request(app)
      .get('/api/webStore')
      .set('Authorization', `Bearer ${merchantToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get web stores by city', async () => {
    const res = await request(app)
      .get('/api/webStore?city=Madrid')
      .set('Authorization', `Bearer ${merchantToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach(webStore => {
      expect(webStore.city).toEqual('Madrid');
    });
  });

  it('should get web stores by city and activity', async () => {
    const res = await request(app)
      .get('/api/webStore?city=Madrid&activity=Mascotas')
      .set('Authorization', `Bearer ${merchantToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach(webStore => {
      expect(webStore.city).toEqual('Madrid');
      expect(webStore.activity).toEqual('Mascotas');
    });
  });

  it('should get a specific web store by ID', async () => {
    const res = await request(app)
      .get(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', webStoreId);
  });

  it('should add a review to a web store', async () => {
    // Primero, registra un usuario para agregar una review
    await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'Maria',
        email: 'maria@gmail.com',
        password: 'password123',
        edad: 28,
        ciudad: 'Madrid',
        intereses: ['cine'],
        permiteRecibirOfertas: true,
      });

    const loginRes = await request(app)
      .post('/api/user/login')
      .send({
        email: 'maria@gmail.com',
        password: 'password123',
      });

    const userToken = loginRes.body.token;

    const res = await request(app)
      .patch(`/api/webStore/${webStoreId}/review`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        scoring: 4.5,
        review: 'Excelente servicio y productos de calidad.',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reviews');
    expect(res.body.reviews.reviews).toContain('Excelente servicio y productos de calidad.');
    expect(res.body.reviews.scoring).toBeCloseTo(4.9);
  });

  it('should modify a web store by ID', async () => {
    const res = await request(app)
      .put(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        city: 'Barcelona',
        title: 'Tech Store Barcelona',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('city', 'Barcelona');
    expect(res.body).toHaveProperty('title', 'Tech Store Barcelona');
  });

  it('should upload an image to the web store', async () => {
    const res = await request(app)
      .patch(`/api/webStore/${webStoreId}/uploadImage`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .attach('image', path.resolve(__dirname, 'doraemon.jpg'));
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('imagesArray');
    expect(res.body.imagesArray).toContain(expect.stringContaining('doraemon.jpg'));
  });

  it('should add text to the web store', async () => {
    const res = await request(app)
      .post(`/api/webStore/${webStoreId}/addText`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        text: 'Este es un nuevo texto para mi página web.',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('textsArray');
    expect(res.body.textsArray).toContain('Este es un nuevo texto para mi página web.');
  });

  it('should delete a web store physically by ID', async () => {
    const res = await request(app)
      .delete(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Página web eliminada');
  });
});
