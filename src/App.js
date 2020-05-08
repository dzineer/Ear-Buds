import React, { useState, useEffect } from "react"
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"
import { spotfityLogin, getNewToken, getMyData } from "./spotifyLogin"
import axios from "axios"
import queryString from "querystring"

const redirectUri = "http://localhost:3000"
const clientId = "5831023fb4004d61a610f092f1e612b4"
const clientSecret = "a0174569adec4c988e845ace473ae66a"
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "app-remote-control",
]

function App() {
  const [token, setToken] = useState("")
  const [refreshToken, setRefreshToken] = useState()
  const [episodeUrl, setEpisodeUrl] = useState()
  const [mySpotifyData, setMySpotifyData] = useState()

  useEffect(() => {
    spotfityLogin(setToken, setRefreshToken)
  }, [])

  const getSampleData = async (token, episodeId) => {
    try {
      const episode = await axios.get(
        `https://api.spotify.com/v1/episodes/${episodeId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      console.log("EPISODE", episode)
      setEpisodeUrl(episode)
    } catch (err) {
      console.log(err)
    }
  }

  const buttonClick = () => {
    if (mySpotifyData && token) {
      console.log("sending data")
      createNewRoom({
        name: "room11",
        password: "123",
        users: [
          {
            name: mySpotifyData.display_name,
            accessToken: token,
            refreshToken: refreshToken,
          },
          { name: "Justin", accessToken: "token" },
        ],
        currentPodcast: { apiData: "" },
      })
    }

    getRoom("room11", "123").then((res) => getCurrentRoomData(res))
    getSampleData(token, "1oLdBqEIgphJN3O6ULyw4T")
    //getMyData(token, setMySpotifyData)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={buttonClick}>Button</button>
        {mySpotifyData && <div>Hello, {mySpotifyData.display_name}</div>}
        <a
          href={
            "https://accounts.spotify.com/authorize?" +
            queryString.stringify({
              response_type: "code",
              client_id: clientId,
              scope: scopes,
              redirect_uri: redirectUri,
            })
          }
        >
          Login to Spotify
        </a>
      </header>
    </div>
  )
}

export default App
