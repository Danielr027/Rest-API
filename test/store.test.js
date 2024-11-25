const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;
let adminToken = '';
let storeId = 'A23523'; // CIF del store

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Crear y login como admin para obtener token
  await request(app)
    .post('/api/user/register')
    .send({
      nombre: 'Administrador',
      email: 'admin@example.com',
      password: 'Admin1234',
      edad: 30,
      ciudad: 'Madrid',
      intereses: ['lectura', 'deporte'],
    });

  // Actualizar rol a admin
  const User = mongoose.model('User');
  await User.updateOne(
    { email: 'admin@example.com' },
    { role: 'admin' }
  );

  const res = await request(app)
    .post('/api/user/login')
    .send({
      email: 'admin@example.com',
      password: 'Admin1234',
    });

  adminToken = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Store Endpoints', () => {
  it('should create a new store', async () => {
    const res = await request(app)
      .post('/api/store')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'Tienda Animales',
        CIF: 'A23523',
        address: 'Calle Mirasuegros 33, Madrid',
        email: 'contacto@tiendaanimales.com',
        contactNumber: '+34 632 252 234',
        merchantId: '67445668a810ee3ec60e9d2b',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('storeName', 'Tienda Animales');
    expect(res.body).toHaveProperty('CIF', 'A23523');
  });

  it('should get all stores', async () => {
    const res = await request(app)
      .get('/api/store?order=true')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a specific store by CIF', async () => {
    const res = await request(app)
      .get('/api/store/A23523')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('CIF', 'A23523');
    expect(res.body).toHaveProperty('storeName', 'Tienda Animales');
  });

  it('should update a store by CIF', async () => {
    const res = await request(app)
      .put('/api/store/A23523')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        address: 'Avenida del Comercio, 150, Barcelona',
        contactNumber: '+34 600 123 789',
        merchantId: '67445668a810ee3ec60e9d2b',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('address', 'Avenida del Comercio, 150, Barcelona');
    expect(res.body).toHaveProperty('contactNumber', '+34 600 123 789');
  });

  it('should delete a store by CIF logically', async () => {
    const res = await request(app)
      .delete('/api/store/A23523?deleteType=logical')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deletedCount', 1);
  });

  it('should get interested user emails', async () => {
    // Primero, registrar un usuario interesado
    await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'Juan',
        email: 'juan@gmail.com',
        password: 'password123',
        edad: 25,
        ciudad: 'Madrid',
        intereses: ['cine'],
        permiteRecibirOfertas: true,
      });

    // Iniciar sesión como admin para crear un store y asociar
    const storeRes = await request(app)
      .post('/api/store')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'CineStar',
        CIF: 'B12345678',
        address: 'Avenida del Cine, 45, Madrid',
        email: 'contacto@cinestar.com',
        contactNumber: '+34 600 456 789',
        merchantId: '67445668a810ee3ec60e9d2b', // Poner id de merchant que exista
      });

    expect(storeRes.statusCode).toEqual(200);
    expect(storeRes.body).toHaveProperty('CIF', 'B12345678');

    // Obtener emails de usuarios interesados en 'cine'
    const res = await request(app)
      .get('/api/store/B12345678/interested-users?topic=cine')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toContain('juan@gmail.com');
  });
});
