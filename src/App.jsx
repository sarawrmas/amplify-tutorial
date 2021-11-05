import React from "react";
import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import SongList from "./components/SongList";

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Songs</h1>
        <AmplifySignOut />
      </header>
      <SongList />
    </div>
  );
}

export default withAuthenticator(App);