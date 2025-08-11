const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CSV writer setup
const csvWriter = createCsvWriter({
  path: 'customers.csv',
  header: [
    {id: 'name',              title: 'name'},
    {id: 'email',             title: 'email'},
    {id: 'password_hash',     title: 'password_hash'},
    {id: 'registration_date', title: 'registration_date'}
  ]
});

// Helper: random date in the past year
function randomDateInPastYear() {
  const past = faker.date.past(1);
  return past.toISOString().split('T')[0];  // YYYY-MM-DD
}

async function generate(n = 5000) {
  const records = [];
  for (let i = 0; i < n; i++) {
    records.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password_hash: faker.internet.password(16),
      registration_date: randomDateInPastYear()
    });
  }
   
  console.log('Generated ' + records.length + ' customers. Writing to CSV...');

  await csvWriter.writeRecords(records);
  console.log('Done. File: customers.csv');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
