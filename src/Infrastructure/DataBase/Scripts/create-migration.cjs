const { exec } = require('child_process');
const path = require('path');

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const command = `npm run build &&  npx typeorm migration:generate src/Infrastructure/DataBase/migrations/${migrationName} -d dist/src/Infrastructure/DataBase/DataSource.js`;
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) console.error(stderr);
});