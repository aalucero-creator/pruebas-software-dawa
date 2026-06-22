// src/utils/calculadora.js
// Módulo de utilidades para cálculos de una tienda en línea
/**
* Calcula el precio con descuento
* @param {number} precio - Precio original del producto
* @param {number} porcentaje - Porcentaje de descuento (0-100)
* @returns {number} - Precio con descuento aplicado
*/
function calcularDescuento(precio, porcentaje) {
if (precio < 0) throw new Error('El precio no puede ser negativo');
if (porcentaje < 0 || porcentaje > 100) {
throw new Error('El porcentaje debe estar entre 0 y 100');
}
 return precio - (precio * porcentaje / 100);
}
/**
* Calcula el total de una lista de productos
* @param {Array} productos - Lista de {nombre, precio, cantidad}
* @returns {number} - Total a pagar
*/
function calcularTotal(productos) {
if (!Array.isArray(productos)) throw new Error('Se esperaba un arreglo');
return productos.reduce((total, prod) => {
 return total + (prod.precio * prod.cantidad);
}, 0);
}
/**
* Valida si un correo electrónico tiene formato correcto
* @param {string} email - Correo a validar
* @returns {boolean}
*/
function validarEmail(email) {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email);
}
/**
* Formatea un número como moneda (USD)
* @param {number} cantidad
* @returns {string}
*/

function formatearMoneda(cantidad) {
return `$${cantidad.toFixed(2)}`;
}
/**
 * Aplica el IVA del 15% al precio
 * @param {number} precio
 * @returns {number}
 */
function aplicarIVA(precio) {
if (precio < 0) throw new Error('El precio no puede ser negativo');

  return Number((precio * 1.15).toFixed(2));
}

module.exports = { calcularDescuento, calcularTotal, 
    validarEmail, formatearMoneda, aplicarIVA};