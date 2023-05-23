import axios from 'axios';
import { useState, useEffect } from "react";
import "./App.css";
import lens from "./assets/lens.png";
import loadingGif from "./assets/loading.gif";

function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(undefined);
  const [send, setSend] = useState(false);

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer(undefined);
    }
  }, [prompt]);

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      const data = {
        messages: [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": `${JSON.stringify({prompt})}\n`,
          }
        ]
      }

      const requestOptions = {
        headers: { 
          "Content-Type": "application/json", 
          "Accept" : "application/json" 
        }
      };

      const res = await axios.post('http://localhost:8000/v1/chat/completions', 
      data, requestOptions).then(response => setAnswer(response.data.choices[0].message.content));

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
            type="text"
            className="spotlight__input"
            placeholder="Please type prompt..."
            disabled={loading}
            style={{
              backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
