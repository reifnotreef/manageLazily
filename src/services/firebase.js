import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.firestore()
    this.auth = app.auth();
  }

  getOrgs = () => 
    this.db.collection('organizations')
      .get()

  getProjects= () =>
    this.db.collection('organizations/HkeHO8n1eIaJSu6mnsd5/projects')
      .get()
      
  getJobs = (project_id) =>
    this.db.collection(`organizations/HkeHO8n1eIaJSu6mnsd5/projects/${project_id}/jobs`)
      .get()

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
