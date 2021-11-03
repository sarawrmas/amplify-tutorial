import React, { useState, useEffect } from "react";
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { listSongs } from './graphql/queries';

Amplify.configure(awsconfig);

function App() {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log("Song list: ", songList);
      setSongs(songList);
    } catch (error) {
      console.log("Error on fetching songs: ", error)
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <h2>My App Content</h2>
      </header>
    </div>
  );
}

export default withAuthenticator(App);