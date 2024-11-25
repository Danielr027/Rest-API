// test/store.test.js

const request = require('supertest');
const app = require('../app');

describe('Pruebas de Comercios', () => {
  let adminToken;
  const storeCIF = 'A23523';

  beforeAll(async () => {
    // Iniciar sesión como admin
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin1234'
      })
      .expect(200);

    adminToken = res.body.token;
  });

  // Añadir comercio (solo admin)
  it('Debería añadir un comercio como admin', async () => {
    const res = await request(app)
      .post('/api/store')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        storeName: 'Tienda Animales',
        CIF: storeCIF,
        address: 'Calle Mirasuegros 33, Madrid',
        email: 'contacto@tiendaanimales.com',
        contactNumber: '+34 632 252 234'
      })
      .expect(200);

    expect(res.body.store.CIF).toBe(storeCIF);
    expect(res.body.store.storeName).toBe('Tienda Animales');
  });

  // Obtener todos los comercios
  it('Debería obtener todos los comercios', async () => {
    const res = await request(app)
      .get('/api/store?order=true')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Obtener un comercio específico por su CIF
  it('Debería obtener un comercio por su CIF', async () => {
    const res = await request(app)
      .get(`/api/store/${storeCIF}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body[0].CIF).toBe(storeCIF);
  });

  // Modificar comercio (solo admin)
  it('Debería modificar un comercio como admin', async () => {
    const res = await request(app)
      .put(`/api/store/${storeCIF}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        address: 'Avenida del Comercio, 150, Barcelona',
        contactNumber: '+34 600 123 789'
      })
      .expect(200);

    // Dependiendo de cómo devuelvas la respuesta, ajusta las expectativas
    expect(res.body.address).toBe('Avenida del Comercio, 150, Barcelona');
    expect(res.body.contactNumber).toBe('+34 600 123 789');
  });

  // Eliminar comercio por CIF (Borrado Lógico)
  it('Debería eliminar un comercio por su CIF (borrado lógico)', async () => {
    const res = await request(app)
      .delete(`/api/store/${storeCIF}?deleteType=logical`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });
});
