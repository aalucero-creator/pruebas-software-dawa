const express = require('express'); 
const { calcularDescuento, calcularTotal, validarEmail } = 
require('./utils/calculadora'); 
const app = express(); 
 
app.use(express.json()); 
 
// GET /api/productos - Lista de productos 
app.get('/api/productos', (req, res) => { 
  const productos = [ 
    { id: 1, nombre: 'Laptop', precio: 850.00, stock: 5 }, 
    { id: 2, nombre: 'Mouse', precio: 25.00, stock: 20 }, 
    { id: 3, nombre: 'Teclado', precio: 45.00, stock: 15 } 
  ]; 
  res.json({ ok: true, datos: productos }); 
}); 
 
// POST /api/descuento - Calcula precio con descuento 
app.post('/api/descuento', (req, res) => { 
  const { precio, porcentaje } = req.body; 
  if (precio === undefined || porcentaje === undefined) { 
    return res.status(400).json({ ok: false, error: 'Faltan datos' }); 
  } 
  try { 
    const precioFinal = calcularDescuento(precio, porcentaje); 
    res.json({ ok: true, precioFinal }); 
  } catch (error) { 
    res.status(400).json({ ok: false, error: error.message }); 
  } 
}); 
 
// POST /api/total - Calcula el total del carrito 
app.post('/api/total', (req, res) => { 
  const { productos } = req.body; 
  try { 
    const total = calcularTotal(productos); 
    res.json({ ok: true, total }); 
  } catch (error) { 
    res.status(400).json({ ok: false, error: error.message }); 
  } 
}); 
 
// POST /api/validar-email 
app.post('/api/validar-email', (req, res) => { 
  const { email } = req.body; 
  if (!email) return res.status(400).json({ ok: false, error: 'Email requerido' }); 
  const esValido = validarEmail(email); 
  res.json({ ok: true, esValido }); 
}); 
 
module.exports = app;