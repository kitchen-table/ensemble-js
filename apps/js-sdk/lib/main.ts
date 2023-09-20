import KitchenTable from './core';

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('KitchenTable init');
  const kitchenTable = new KitchenTable({ window });
  kitchenTable.init('http://localhost:3000').catch(console.error);
});
