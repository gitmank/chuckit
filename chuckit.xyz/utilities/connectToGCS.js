const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'chuckit-xyz',
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
    },
});

const bucket = storage.bucket('chuckit-bucket-main');

module.exports = {
    bucket,
};