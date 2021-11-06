import React, { useState } from "react";
import './App.css';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import SongList from "./components/SongList";
import AddSong from "./components/AddSong";
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Songs</h1>
        <AmplifySignOut />
      </header>
      <SongList songs={songs} setSongs={setSongs} fetchSongs={fetchSongs} />
      <AddSong fetchSongs={fetchSongs} />
    </div>
  );
}

export default withAuthenticator(App);