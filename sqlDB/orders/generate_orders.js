// generate_orders.js

const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CONFIGURATION
const NUM_ORDERS = 14000;  // total number of orders to generate
const CUSTOMER_COUNT = 4996;   // should match your customer table size
const START_DATE = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // one year ago
const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'RETURNED'];

// CSV writer for orders.csv
const ordersWriter = createCsvWriter({
    path: 'orders.csv',
    header: [
        { id: 'order_id', title: 'order_id' },
        { id: 'customer_id', title: 'customer_id' },
        { id: 'order_date', title: 'order_date' },
        { id: 'status', title: 'status' }
    ]
});

// Helper: generate a random date between START_DATE and today
function randomOrderDate() {
    return faker
        .date
        .between({ from: START_DATE, to: new Date() })
        .toISOString()
        .split('T')[0];  // format as YYYY-MM-DD
}

async function generateOrders() {
    const records = [];
    for (let id = 1; id <= NUM_ORDERS; id++) {
        records.push({
            order_id: id,
            customer_id: faker.number.int({ min: 1, max: CUSTOMER_COUNT }),
            order_date: randomOrderDate(),
            status: STATUSES[faker.number.int({ min: 0, max: STATUSES.length - 1 })]
        });
    }

    console.log('Writing', records.length, 'orders to orders.csv...');
    await ordersWriter.writeRecords(records);
    console.log('Done! File created: orders.csv');
}

generateOrders().catch(err => {
    console.error('Error generating orders:', err);
    process.exit(1);
});
