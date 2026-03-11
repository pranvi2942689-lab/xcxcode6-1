const crypto = require('crypto');

function generateOrderId() {
  return crypto.randomUUID();
}

function generateOrderNo() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const randomPart = Math.floor(Math.random() * 9000 + 1000);
  return `CG${datePart}${timePart}${randomPart}`;
}

function calculateTotalAmount(items) {
  return Number(
    items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  );
}

module.exports = {
  generateOrderId,
  generateOrderNo,
  calculateTotalAmount
};
