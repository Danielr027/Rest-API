const request = require('supertest');
const app = require('../app');
const path = require('path');

describe('Pruebas de WebStores', () => {
  let adminToken;
  let merchantToken;
  let merchantId;
  let webStoreId;

  beforeAll(async () => {
    // Iniciar sesión como admin
    const adminLoginRes = await request(app)
      .post('/api/user/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin1234'
      })
      .expect(200);

    adminToken = adminLoginRes.body.token;

    // Registrar un merchant como admin
    const merchantRes = await request(app)
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

    merchantId = merchantRes.body.user._id;

    // Crear store para el merchant (como admin)
    await request(app)
      .post('/api/store')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'Comercio XYZ',
        CIF: 'B12345678',
        address: 'Calle Falsa 123, Madrid',
        email: 'contacto@comercioxyz.com',
        contactNumber: '+34 600 123 456',
        merchantId: merchantId
      })
      .expect(200);

    // Iniciar sesión como merchant
    const merchantLoginRes = await request(app)
      .post('/api/user/login')
      .send({
        email: 'comercioxyz@example.com',
        password: 'Password123'
      })
      .expect(200);

    merchantToken = merchantLoginRes.body.token;
  });

  // Crear una webStore (solo merchant)
  it('Debería permitir al merchant crear una webStore', async () => {
    const res = await request(app)
      .post('/api/webStore')
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        city: 'Madrid',
        activity: 'Venta de electrónicos',
        title: 'Comercio XYZ Electrónicos',
        resume: 'Los mejores productos electrónicos al mejor precio.',
        textsArray: ['Texto adicional 1', 'Texto adicional 2'],
        imagesArray: ['http://example.com/image1.jpg']
      })
      .expect(200);

    expect(res.body.title).toBe('Comercio XYZ Electrónicos');
    webStoreId = res.body._id;
  });

  // Obtener todas las webStores
  it('Debería obtener todas las webStores', async () => {
    const res = await request(app)
      .get('/api/webStore')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Obtener una webStore por su ID
  it('Debería obtener una webStore por su ID', async () => {
    const res = await request(app)
      .get(`/api/webStore/${webStoreId}`)
      .expect(200);

    expect(res.body._id).toBe(webStoreId);
  });

  // Modificar una webStore (solo merchant propietario)
  it('Debería permitir al merchant modificar su webStore', async () => {
    const res = await request(app)
      .put(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        title: 'Comercio XYZ Actualizado',
        resume: 'Ahora con más ofertas.'
      })
      .expect(200);

    expect(res.body.title).toBe('Comercio XYZ Actualizado');
    expect(res.body.resume).toBe('Ahora con más ofertas.');
  });

  // Subir imagen a la webStore
  it('Debería subir una imagen a la webStore', async () => {
    const res = await request(app)
      .patch(`/api/webStore/${webStoreId}/uploadImage`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .attach('image', path.resolve(__dirname, 'testImage.jpg')) // Asegúrate de tener un archivo 'testImage.jpg' en el directorio 'test'
      .expect(200);

    expect(res.body.message).toBe('Imagen subida con éxito');
    expect(res.body.data.imagesArray.length).toBeGreaterThan(0);
  });

  // Eliminar una webStore (solo merchant propietario)
  it('Debería permitir al merchant eliminar su webStore', async () => {
    const res = await request(app)
      .delete(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .expect(200);

    expect(res.body.message).toBe('Página web eliminada');
  });

  // Limpieza: eliminar el merchant creado
  afterAll(async () => {
    // Asumiendo que tienes un endpoint para eliminar usuarios como admin
    await request(app)
      .delete(`/api/user/${merchantId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
