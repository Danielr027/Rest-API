// test/user.test.js

const request = require('supertest');
const app = require('../app');

describe('Pruebas de Usuarios', () => {
  let userToken;
  let adminToken;
  let merchantToken;
  let userId;
  let adminId;
  let merchantId;
  let storeId;

  // Registrar un usuario básico
  it('Debería registrar un usuario básico', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'Daniel',
        email: 'daniel@gmail.com',
        password: 'qwertyui',
        edad: 19,
        ciudad: 'Madrid',
        intereses: ['cine', 'música'],
        permiteRecibirOfertas: true
      })
      .expect(200);

    expect(res.body.user.email).toBe('daniel@gmail.com');
    expect(res.body.user.nombre).toBe('Daniel');

    userId = res.body.user._id;
  });

  // Iniciar sesión como usuario básico
  it('Debería iniciar sesión como usuario básico', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'daniel@gmail.com',
        password: 'qwertyui'
      })
      .expect(200);

    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  // Registrar un usuario admin
  it('Debería registrar un usuario admin', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        nombre: 'Administrador',
        email: 'admin@example.com',
        password: 'Admin1234',
        edad: 30,
        ciudad: 'Madrid',
        intereses: ['lectura', 'deporte']
      })
      .expect(200);

    expect(res.body.user.email).toBe('admin@example.com');
    expect(res.body.user.nombre).toBe('Administrador');

    adminId = res.body.user._id;

    // Cambiar el rol del usuario a 'admin' en la base de datos
    const User = require('../models/user'); // Asegúrate de que la ruta es correcta
    await User.findByIdAndUpdate(adminId, { role: 'admin' });
  });

  // Iniciar sesión como admin
  it('Debería iniciar sesión como admin', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin1234'
      })
      .expect(200);

    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  // Crear un usuario merchant (solo el admin puede hacerlo)
  it('Debería crear un usuario merchant (por admin)', async () => {
    const res = await request(app)
      .post('/api/user/register-merchant')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Comercio XYZ',
        email: 'comercioxyz@example.com',
        password: 'Password123',
        edad: 35,
        ciudad: 'Madrid'
      })
      .expect(200);

    expect(res.body.user.email).toBe('comercioxyz@example.com');
    expect(res.body.user.nombre).toBe('Comercio XYZ');
    expect(res.body.user.role).toBe('merchant');

    merchantId = res.body.user._id;
  });

  // Iniciar sesión como merchant
  it('Debería iniciar sesión como merchant', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'comercioxyz@example.com',
        password: 'Password123'
      })
      .expect(200);

    expect(res.body.token).toBeDefined();
    merchantToken = res.body.token;
  });

  // Crear una tienda para el merchant
  it('Debería crear una tienda para el merchant', async () => {
    const res = await request(app)
      .post('/api/store')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'Tienda XYZ',
        CIF: 'B12345678',
        address: 'Calle Falsa 123',
        city: 'Madrid',
        email: 'contacto@tiendaxyz.com',
        contactNumber: '+34 600 123 456',
        merchantId: merchantId
      })
      .expect(200);

    expect(res.body.store.storeName).toBe('Tienda XYZ');
    expect(res.body.store.merchantId).toBe(merchantId);

    storeId = res.body.store._id;
  });

  // Crear una webStore para el merchant
  it('Debería crear una webStore para el merchant', async () => {
    const res = await request(app)
      .post('/api/webStore')
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        city: 'Madrid',
        activity: 'cine',
        title: 'Tienda XYZ',
        resume: 'Resumen de la tienda',
        textsArray: ['Texto 1', 'Texto 2'],
        imagesArray: ['imagen1.jpg', 'imagen2.jpg']
      })
      .expect(200);

    expect(res.body.city).toBe('Madrid');
    expect(res.body.activity).toBe('cine');
  });

  // Modificar datos del usuario básico
  it('Debería modificar los datos del usuario básico', async () => {
    const res = await request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre: 'Usuario Básico Modificado',
        ciudad: 'Barcelona'
      })
      .expect(200);

    expect(res.body.nombre).toBe('Usuario Básico Modificado');
    expect(res.body.ciudad).toBe('Barcelona');
  });

  // Obtener correos de usuarios interesados (merchant)
  it('Merchant debería obtener correos de usuarios interesados', async () => {
    const res = await request(app)
      .get('/api/store/interested-users?topic=cine')
      .set('Authorization', `Bearer ${merchantToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // Puedes agregar más expectativas aquí si lo deseas
  });

  // Eliminar usuario básico
  it('Debería eliminar el usuario básico', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(res.body.message).toBeDefined();
  });

  // Eliminar el usuario admin
  it('Debería eliminar el usuario admin', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.message).toBeDefined();
  });

  // Eliminar el usuario merchant
  it('Debería eliminar el usuario merchant', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${merchantToken}`)
      .expect(200);

    expect(res.body.message).toBeDefined();
  });
});
