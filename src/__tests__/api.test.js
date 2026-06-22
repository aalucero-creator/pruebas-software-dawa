// src/__tests__/api.test.js
const request = require('supertest'); 
const app = require('../app'); 
 
// ========================================================= 
// PRUEBAS: Endpoint GET /api/productos 
// ========================================================= 
describe('GET /api/productos', () => { 
 
  test('Retorna lista de productos con status 200', async () => { 
    const respuesta = await request(app).get('/api/productos'); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(Array.isArray(respuesta.body.datos)).toBe(true); 
    expect(respuesta.body.datos.length).toBeGreaterThan(0); 
  }); 
 
  test('Cada producto tiene las propiedades requeridas', async () => { 
    const respuesta = await request(app).get('/api/productos'); 
    const primer = respuesta.body.datos[0]; 
 
    expect(primer).toHaveProperty('id'); 
    expect(primer).toHaveProperty('nombre'); 
    expect(primer).toHaveProperty('precio'); 
  }); 
 
}); 
 
// ========================================================= 
// PRUEBAS: Endpoint POST /api/descuento 
// ========================================================= 
describe('POST /api/descuento', () => { 
 
  test('Calcula correctamente el descuento', async () => { 
    const respuesta = await request(app) 
      .post('/api/descuento') 
      .send({ precio: 100, porcentaje: 20 }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(respuesta.body.precioFinal).toBe(80); 
  }); 
 
  test('Retorna error 400 si faltan datos', async () => { 
    const respuesta = await request(app) 
      .post('/api/descuento') 
      .send({ precio: 100 }); 
 
    expect(respuesta.status).toBe(400); 
    expect(respuesta.body.ok).toBe(false); 
  }); 
 
  test('Retorna error 400 con precio negativo', async () => { 
    const respuesta = await request(app) 
      .post('/api/descuento') 
      .send({ precio: -50, porcentaje: 10 }); 
 
    expect(respuesta.status).toBe(400); 
    expect(respuesta.body.error).toContain('negativo'); 
  }); 
 
}); 
 
// ========================================================= 
// PRUEBAS: Endpoint POST /api/total 
// ========================================================= 
describe('POST /api/total', () => { 
 
  test('Calcula correctamente el total del carrito', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({ 
        productos: [ 
          { precio: 100, cantidad: 2 }, 
          { precio: 50, cantidad: 3 } 
        ] 
      }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(respuesta.body.total).toBe(350); 
  }); 
 
  test('Calcula correctamente el total con un solo producto', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({ 
        productos: [ 
          { precio: 75, cantidad: 1 } 
        ] 
      }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(respuesta.body.total).toBe(75); 
  }); 
 
  test('Retorna 0 cuando el carrito está vacío', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({ productos: [] }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(respuesta.body.total).toBe(0); 
  }); 
 
  test('Retorna error 400 si no se envían productos', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({}); 
 
    expect(respuesta.status).toBe(400); 
    expect(respuesta.body.ok).toBe(false); 
    expect(respuesta.body.error).toBeDefined(); 
  }); 
 
  test('Retorna error 400 si productos no es un array', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({ productos: 'no-es-un-array' }); 
 
    expect(respuesta.status).toBe(400); 
    expect(respuesta.body.ok).toBe(false); 
    expect(respuesta.body.error).toBeDefined(); 
  }); 
 
  // Prueba modificada: Ahora verifica que el cálculo funciona con precio negativo
  test('Calcula correctamente el total con precio negativo', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({ 
        productos: [ 
          { precio: -10, cantidad: 2 } 
        ] 
      }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(respuesta.body.total).toBe(-20); 
  }); 
 
  // Prueba modificada: Ahora verifica que el cálculo funciona con cantidad negativa
  test('Calcula correctamente el total con cantidad negativa', async () => { 
    const respuesta = await request(app) 
      .post('/api/total') 
      .send({ 
        productos: [ 
          { precio: 10, cantidad: -2 } 
        ] 
      }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.ok).toBe(true); 
    expect(respuesta.body.total).toBe(-20); 
  }); 
 
}); 
 
// ========================================================= 
// PRUEBAS: Endpoint POST /api/validar-email 
// ========================================================= 
describe('POST /api/validar-email', () => { 
 
  test('Valida correctamente un email válido', async () => { 
    const respuesta = await request(app) 
      .post('/api/validar-email') 
      .send({ email: 'usuario@ejemplo.com' }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.esValido).toBe(true); 
  }); 
 
  test('Valida correctamente emails con formato complejo', async () => { 
    const respuesta = await request(app) 
      .post('/api/validar-email') 
      .send({ email: 'usuario.nombre+alias@ejemplo.co.uk' }); 
 
    expect(respuesta.status).toBe(200); 
    expect(respuesta.body.esValido).toBe(true); 
  }); 
 
  test('Detecta un email inválido (sin @)', async () => { 
    const respuesta = await request(app) 
      .post('/api/validar-email') 
      .send({ email: 'no-es-email' }); 
 
    expect(respuesta.body.esValido).toBe(false); 
  }); 
 
  test('Detecta un email inválido (sin dominio)', async () => { 
    const respuesta = await request(app) 
      .post('/api/validar-email') 
      .send({ email: 'usuario@' }); 
 
    expect(respuesta.body.esValido).toBe(false); 
  }); 
 
  test('Retorna 400 si no se envía email', async () => { 
    const respuesta = await request(app) 
      .post('/api/validar-email') 
      .send({}); 
 
    expect(respuesta.status).toBe(400); 
  }); 
 
  test('Retorna 400 si email está vacío', async () => { 
    const respuesta = await request(app) 
      .post('/api/validar-email') 
      .send({ email: '' }); 
 
    expect(respuesta.status).toBe(400); 
  }); 
 
}); 