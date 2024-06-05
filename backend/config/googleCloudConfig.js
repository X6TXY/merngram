const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  projectId: 'merngram-425309',
  keyFilename: path.join(__dirname, '../key.json'),
});

const bucket = storage.bucket('mernbucket1');

module.exports = bucket;
