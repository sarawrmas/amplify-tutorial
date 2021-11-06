import React, { useState } from "react";
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify";
import awsconfig from "../aws-exports";
import AddIcon from "@material-ui/icons/Add";
import PublishIcon from "@material-ui/icons/Public";
import { TextField, IconButton } from "@material-ui/core";
import { v4 as uuid } from "uuid";
import { createSong } from '../graphql/mutations';

Amplify.configure(awsconfig);

const AddSong = ({ fetchSongs }) => {
  const [showAddSong, setShowAddSong] = useState(false);
  const [songData, setSongData] = useState({});
  const [mp3Data, setMp3Data] = useState();

  const uploadSong = async() => {
    const { title, description, owner } = songData
    const { key } = await Storage.put(`${uuid()}.mp3`, mp3Data, { contentType: "audio/mp3" });
    const createSongInput = {
      id: uuid(),
      title,
      description,
      owner,
      filePath: key,
      like: 0
    };
    await API.graphql(graphqlOperation(createSong, { input: createSongInput }));
    await setShowAddSong(false)
    fetchSongs();
  }

  return (
    <div className="newSong">
      {showAddSong ? (
        <>
          <TextField
            label="Title"
            value={songData.title}
            onChange={e => setSongData({ ...songData, title: e.target.value})}
          />
          <TextField
            label="Artist"
            value={songData.owner}
            onChange={e => setSongData({ ...songData, owner: e.target.value})} 
          />
          <TextField
            label="Description"
            value={songData.description}
            onChange={e => setSongData({ ...songData, description: e.target.value})}
          />
          <input type="file" accept="audio/mp3" onChange={e => setMp3Data(e.target.files[0])} />
          <IconButton onClick={uploadSong}>
            <PublishIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton onClick={() => setShowAddSong(true)}>
            <AddIcon />
          </IconButton>
        </>
      )}
    </div>
  )
};

export default AddSong;