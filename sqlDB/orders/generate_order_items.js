const fs           = require('fs');
const path         = require('path');
const csvParser    = require('csv-parser');
const mysql        = require('mysql2/promise');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CONFIG
const ORDERS_CSV      = 'orders.csv';
const OUTPUT_CSV      = 'order_items.csv';
const MIN_ITEMS_PER_ORDER = 1;
const MAX_ITEMS_PER_ORDER = 5;
const MIN_QTY         = 1;
const MAX_QTY         = 3;

// 1) Set up CSV writer
const writer = createCsvWriter({
  path: OUTPUT_CSV,
  header: [
    {id: 'order_id',         title: 'order_id'},
    {id: 'book_id',          title: 'book_id'},
    {id: 'quantity',         title: 'quantity'},
    {id: 'price_at_purchase',title: 'price_at_purchase'}
  ]
});

async function main() {
  // 2) Connect to MySQL
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'demo',          // adjust as needed
    password: 'demo123',
    database: 'pageturners'
  });

  // 3) Load all book IDs and current prices
  const [books] = await conn.execute('SELECT book_id, price FROM book');

  // Utility to pick N distinct random elements
  function pickRandom(arr, n) {
    const copy = arr.slice();
    const picks = [];
    for (let i = 0; i < n && copy.length; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      picks.push(copy.splice(idx, 1)[0]);
    }
    return picks;
  }

  // 4) Read orders.csv and build order_items records
  const records = [];
  fs.createReadStream(path.resolve(__dirname, ORDERS_CSV))
    .pipe(csvParser())
    .on('data', row => {
      const orderId = parseInt(row.order_id, 10);
      const itemCount = Math.floor(Math.random() * (MAX_ITEMS_PER_ORDER - MIN_ITEMS_PER_ORDER + 1))
                      + MIN_ITEMS_PER_ORDER;
      const chosen = pickRandom(books, itemCount);
      chosen.forEach(b => {
        const qty = Math.floor(Math.random() * (MAX_QTY - MIN_QTY + 1)) + MIN_QTY;
        records.push({
          order_id: orderId,
          book_id: b.book_id,
          quantity: qty,
          price_at_purchase: b.price
        });
      });
    })
    .on('end', async () => {
      console.log(`Writing ${records.length} order items to ${OUTPUT_CSV}...`);
      await writer.writeRecords(records);
      console.log('Done!');
      await conn.end();
    });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
