import React, { useState, useEffect } from "react";
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { updateSong } from '../graphql/mutations';
import { Paper, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReactPlayer from 'react-player';

Amplify.configure(awsconfig);

const SongList = ({ songs, setSongs, fetchSongs }) => {
  const [songPlaying, setSongPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => {
    fetchSongs();
  }, []);

  const toggleSong = async idx => {
    if (songPlaying === idx) {
      setSongPlaying('');
      return;
    }

    const songFilePath = songs[idx].filePath;
    try {
      const fileAccessURL = await Storage.get(songFilePath, { expires: 60 });
      console.log("access url: ", fileAccessURL);
      setSongPlaying(idx);
      setAudioURL(fileAccessURL);
      return;
    } catch (error) {
      console.error('Error accessing file from S3: ', error);
      setAudioURL("");
      setSongPlaying("");
    }
  }

  const addLike = async idx => {
    try {
      const song = songs[idx];
      song.likes = song.likes + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(graphqlOperation(updateSong, { input: song }));
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);
    } catch (error) {
      console.log("addLike error: ", error)
    }
  }


  return (
    <div className="songList">
      {songs.map((song, idx) => (
        <Paper variant="outlined" elevation={2} key={`song${idx}`}>
          <div className="songCard">
            <IconButton aria-label="play" onClick={() => toggleSong(idx)}>
              {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
              <div>
                <div className="songTitle">{song.title}</div>
                <div className="songOwner">{song.owner}</div>
              </div>
              <div>
                <IconButton aria-label="like" onClick={() => addLike(idx)}>
                  <FavoriteIcon />
                </IconButton>
                {song.likes}
              </div>
              <div className="songDescription">{song.description}</div>
          </div>
          {songPlaying === idx ? (
            <div className="ourAudioPlayer">
              <ReactPlayer
                url={audioURL}
                controls
                playing
                height="50px"
                onPause={() => toggleSong(idx)}
              />
            </div>
          ) : null}
        </Paper>
      ))}
    </div>
  );
}

export default SongList;