process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;
let adminToken = '';
let merchantToken = '';
let merchantId = '';
let storeId = 'A23523'; // CIF del store

beforeAll(async () => {
  // Iniciar el servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Conectar Mongoose sin opciones obsoletas
  await mongoose.connect(uri);

  // Crear y registrar un usuario admin
  const adminRes = await request(app)
    .post('/api/user/register')
    .send({
      nombre: 'Administrador',
      email: 'admin@example.com',
      password: 'Admin1234',
      edad: 30,
      ciudad: 'Madrid',
      intereses: ['lectura', 'deporte'],
    });

  // Actualizar el rol a admin
  const User = mongoose.model('User');
  await User.updateOne(
    { email: 'admin@example.com' },
    { role: 'admin' }
  );

  // Login como admin para obtener el token
  const loginRes = await request(app)
    .post('/api/user/login')
    .send({
      email: 'admin@example.com',
      password: 'Admin1234',
    });

  adminToken = loginRes.body.token;

  // Crear y registrar un usuario merchant
  const merchantRes = await request(app)
    .post('/api/user/register-merchant')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      nombre: 'Merchant',
      email: 'merchant@example.com',
      password: 'Password123',
      edad: 35,
      ciudad: 'Madrid',
    });

  // Obtener el ID del merchant
  const merchantUser = await User.findOne({ email: 'merchant@example.com' });
  merchantId = merchantUser._id.toString();

  // Login como merchant para obtener el token
  const merchantLoginRes = await request(app)
    .post('/api/user/login')
    .send({
      email: 'merchant@example.com',
      password: 'Password123',
    });

  merchantToken = merchantLoginRes.body.token;
});

afterAll(async () => {
  // Desconectar Mongoose y detener MongoMemoryServer
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
        CIF: storeId, // 'A23523'
        address: 'Calle Mirasuegros 33, Madrid',
        email: 'contacto@tiendaanimales.com',
        contactNumber: '+34 632 252 234',
        merchantId: merchantId, // Utilizar el ID real del merchant
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
      .get(`/api/store/${storeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('CIF', 'A23523');
    expect(res.body).toHaveProperty('storeName', 'Tienda Animales');
  });

  it('should update a store by CIF', async () => {
    const res = await request(app)
      .put(`/api/store/${storeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        address: 'Avenida del Comercio, 150, Barcelona',
        contactNumber: '+34 600 123 789',
        merchantId: merchantId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('address', 'Avenida del Comercio, 150, Barcelona');
    expect(res.body).toHaveProperty('contactNumber', '+34 600 123 789');
  });

  it('should delete a store by CIF logically', async () => {
    const res = await request(app)
      .delete(`/api/store/${storeId}?deleteType=logical`)
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

    // Registrar otro usuario que no está interesado en 'cine'
    await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'María',
        email: 'maria@gmail.com',
        password: 'password123',
        edad: 28,
        ciudad: 'Barcelona',
        intereses: ['deporte'],
        permiteRecibirOfertas: true,
      });

    // Crear un store asociado a un tema específico ('cine')
    const storeRes = await request(app)
      .post('/api/store')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'CineStar',
        CIF: 'B12345678',
        address: 'Avenida del Cine, 45, Madrid',
        email: 'contacto@cinestar.com',
        contactNumber: '+34 600 456 789',
        merchantId: merchantId, // Utilizar el ID real del merchant
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
    expect(res.body).not.toContain('maria@gmail.com');
  });
});
