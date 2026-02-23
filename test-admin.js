const admin = require('firebase-admin');
admin.initializeApp({
  projectId: 'ac-ai-lab-digital-skills'
});
console.log('Firebase Admin initialized successfully');
admin.auth().listUsers(1).then(result => {
  console.log('Successfully fetched 1 user');
  process.exit(0);
}).catch(err => {
  console.error('Failed to fetch users:', err);
  process.exit(1);
});
