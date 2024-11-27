process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Endpoints', () => {
  let adminToken = '';
  let userToken = '';

  it('should register a new basic user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'Daniel',
        email: 'daniel@gmail.com',
        password: 'qwertyui',
        edad: 19,
        ciudad: 'Madrid',
        intereses: ['cine', 'música'],
        permiteRecibirOfertas: true,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'daniel@gmail.com');
  });

  it('should login the basic user', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'daniel@gmail.com',
        password: 'qwertyui',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    userToken = res.body.token; // Guardar el token para usos futuros
  });

  it('should register a new admin user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'Administrador',
        email: 'admin@example.com',
        password: 'Admin1234',
        edad: 30,
        ciudad: 'Madrid',
        intereses: ['lectura', 'deporte'],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'admin@example.com');
    
    // Es necesario actualizar el usuario manualmente
    const User = mongoose.model('User');
    await User.updateOne(
      { email: 'admin@example.com' },
      { role: 'admin' }
    );
  });

  it('should login the admin user', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin1234',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    adminToken = res.body.token;
  });

  it('should create a merchant user only by admin', async () => {
    const res = await request(app)
      .post('/api/user/register-merchant')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Comercia XYZ',
        email: 'comercioxyz@example.com',
        password: 'Password123',
        edad: 35,
        ciudad: 'Madrid',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'comercioxyz@example.com');

    const User = mongoose.model('User');
    await User.updateOne(
      { email: 'comercioxyz@example.com' },
      { role: 'merchant' }
    );
  });

  it('should login the merchant user', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'comercioxyz@example.com',
        password: 'Password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should modify the basic user data', async () => {
    const res = await request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre: 'Usuario Básico Modificado',
        ciudad: 'Barcelona',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('nombre', 'Usuario Básico Modificado');
    expect(res.body.user).toHaveProperty('ciudad', 'Barcelona');
  });

  it('should delete the basic user', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted');
  });
});
