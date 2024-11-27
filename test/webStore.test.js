process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const path = require('path');
const fs = require('fs');

let mongoServer;
let merchantToken = '';
let merchantId = '';
let storeId = '';
let webStoreId = '';

beforeAll(async () => {
  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Conectar Mongoose sin opciones obsoletas
  await mongoose.connect(uri);

  // Registrar un usuario merchant
  const registerRes = await request(app)
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

  // Actualizar rol a 'merchant'
  const User = mongoose.model('User');
  await User.updateOne(
    { email: 'comercioxyz@example.com' },
    { role: 'merchant' }
  );

  // Iniciar sesión como merchant para obtener el token
  const loginRes = await request(app)
    .post('/api/user/login')
    .send({
      email: 'comercioxyz@example.com',
      password: 'Password123',
    });

  // Verificar que el login fue exitoso y obtener el token
  expect(loginRes.statusCode).toEqual(200);
  expect(loginRes.body).toHaveProperty('token');
  merchantToken = loginRes.body.token;

  // Obtener el ID real del merchant creado
  const merchantUser = await User.findOne({ email: 'comercioxyz@example.com' });
  merchantId = merchantUser._id.toString();

  // Crear una tienda asociada al merchant
  const createStoreRes = await request(app)
    .post('/api/store')
    .set('Authorization', `Bearer ${merchantToken}`)
    .send({
      storeName: 'Tienda Animales',
      CIF: 'A23523',
      address: 'Calle Mirasuegros 33, Madrid',
      email: 'contacto@tiendaanimales.com',
      contactNumber: '+34 632 252 234',
      merchantId: merchantId, // Usar el ID real del merchant
    });

  // Verificar que la tienda se creó correctamente
  expect(createStoreRes.statusCode).toEqual(200);
  expect(createStoreRes.body.store).toHaveProperty('storeName', 'Tienda Animales');
  expect(createStoreRes.body.store).toHaveProperty('CIF', 'A23523');

  // Capturar el ID real de la tienda creada
  storeId = createStoreRes.body.store._id.toString();
});

afterAll(async () => {
  // Desconectar Mongoose y detener MongoMemoryServer
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
        storeId: storeId, // Usar el ID real de la tienda creada
      });

    // Agregar un log para depuración
    console.log('Respuesta de crear webStore:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Tienda Animales');
    
    // Capturar el ID real del webStore creado
    webStoreId = res.body._id.toString();
  });

  it('should get all web stores', async () => {
    const res = await request(app)
      .get('/api/webStore')
      .set('Authorization', `Bearer ${merchantToken}`);
    
    // Agregar un log para depuración
    console.log('Respuesta de obtener todas las webStores:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get web stores by city', async () => {
    const res = await request(app)
      .get('/api/webStore?city=Madrid')
      .set('Authorization', `Bearer ${merchantToken}`);
    
    // Agregar un log para depuración
    console.log('Respuesta de obtener webStores por ciudad:', res.body);

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
    
    // Agregar un log para depuración
    console.log('Respuesta de obtener webStores por ciudad y actividad:', res.body);

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
    
    // Agregar un log para depuración
    console.log('Respuesta de obtener una webStore específica:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', webStoreId);
  });

  it('should add a review to a web store', async () => {
    // Registrar un usuario para agregar una review
    const registerRes = await request(app)
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

    // Iniciar sesión como el usuario para obtener el token
    const loginRes = await request(app)
      .post('/api/user/login')
      .send({
        email: 'maria@gmail.com',
        password: 'password123',
      });

    // Agregar un log para depuración
    console.log('Respuesta de login de Maria:', loginRes.body);

    const userToken = loginRes.body.token;

    // Agregar una review a la webStore
    const res = await request(app)
      .patch(`/api/webStore/${webStoreId}/review`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        scoring: 4.5,
        review: 'Excelente servicio y productos de calidad.',
      });

    // Agregar un log para depuración
    console.log('Respuesta de agregar review:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reviews');
    expect(res.body.reviews.reviews).toContain('Excelente servicio y productos de calidad.');
    // Ajustar según cómo se calcule 'scoring' en tu lógica
    expect(res.body.reviews.scoring).toBeCloseTo(4.88, 1); // Por ejemplo, ((4.9 * 25) + 4.5) / 26 ≈ 4.88
  });

  it('should modify a web store by ID', async () => {
    const res = await request(app)
      .put(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        city: 'Barcelona',
        title: 'Tech Store Barcelona',
      });
    
    // Agregar un log para depuración
    console.log('Respuesta de modificar webStore:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('city', 'Barcelona');
    expect(res.body).toHaveProperty('title', 'Tech Store Barcelona');
  });

  it('should upload an image to the web store', async () => {
    const imagePath = path.resolve(__dirname, 'doraemon.jpg');
    
    // Verificar si el archivo existe
    if (!fs.existsSync(imagePath)) {
      console.warn(`Advertencia: El archivo ${imagePath} no existe. Se omite la prueba de subida de imagen.`);
      return;
    }

    const res = await request(app)
      .patch(`/api/webStore/${webStoreId}/uploadImage`)
      .set('Authorization', `Bearer ${merchantToken}`)
      .attach('image', imagePath);
    
    // Agregar un log para depuración
    console.log('Respuesta de subir imagen:', res.body);

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
    
    // Agregar un log para depuración
    console.log('Respuesta de agregar texto:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('textsArray');
    expect(res.body.textsArray).toContain('Este es un nuevo texto para mi página web.');
  });

  it('should delete a web store physically by ID', async () => {
    const res = await request(app)
      .delete(`/api/webStore/${webStoreId}`)
      .set('Authorization', `Bearer ${merchantToken}`);
    
    // Agregar un log para depuración
    console.log('Respuesta de eliminar webStore:', res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Página web eliminada');
  });
});
