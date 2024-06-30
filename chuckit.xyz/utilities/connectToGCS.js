const { Storage } = require('@google-cloud/storage');

const BUCKET_NAME = process.env.NODE_ENV === 'production' ? process.env.PROD_BUCKET_NAME : process.env.TEST_BUCKET_NAME;

const storage = new Storage({
    projectId: 'chuckit-xyz',
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
    },
});

const bucket = storage.bucket(BUCKET_NAME);

module.exports = {
    bucket,
};