const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'chuckit-xyz',
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
    },
});

module.exports = { db };