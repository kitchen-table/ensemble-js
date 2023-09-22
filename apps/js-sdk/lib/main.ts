import KitchenTable from './core';

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('KitchenTable init');
  KitchenTable.init('http://localhost:3000').catch(console.error);
});
