import React, { useEffect } from 'react';
import { auth } from './firebase-config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import LikhAIEditor from './components/LikhAIEditor';

const App = () => {
  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User signed in:', user.uid);
      }
    });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>LikhAI</h1>
      </header>
      <LikhAIEditor />
    </div>
  );
};

export default App;
