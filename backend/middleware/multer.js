const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  projectId: 'merngram-425309',
  keyFilename: path.join(__dirname, '../key.json'),
});

const bucket = storage.bucket('mernbucket1');

const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject('No file provided');
    }

    const blob = bucket.file(Date.now() + path.extname(file.originalname));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', async () => {
      try {
        const signedUrl = await blob.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Set an appropriate expiration date
        });
        resolve(signedUrl[0]);
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { upload, uploadToGCS };
