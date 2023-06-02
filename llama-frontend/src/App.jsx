import axios from 'axios';
import { useState, useEffect } from "react";
import "./App.css";
import lens from "./assets/lens.png";
import loadingGif from "./assets/loading.gif";

const proprties = {
  n: null,
  temperature: null,
  top_p: null,
  top_k: null,
  stop: null,
  presence_penalty: null,
  frequency_penalty: null,
  repeat_penalty: null
}

function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(undefined);

  const [settings, setSettings] = useState(false);
  const settingsText = ">";

  const [defaults, setDefaults] = useState(false);

  const [enter, setEnter] = useState(false);

  const defaultRole = "You are a helpful assistant. Provide helpful and informative responses in a concise and complete manner. Please avoid using conversational tags and only reply in full sentences. Ensure that your answers are presented directly and without the use of 'Human:' or '###'. Thank you for your cooperation!";
  const [roleState, setRoleState] = useState(null);

  const [maxTokState, setMaxTokState] = useState(null);
  const [nState, setNState] = useState(null);
  const [tempState, setTempState] = useState(null);
  const [topPState, setPState] = useState(null);
  const [topKState, setKState] = useState(null);
  const [stopState, setStopState] = useState(null);
  const [ppenState, setPPenState] = useState(null);
  const [freqpenState, setFreqPenState] = useState(null);
  const [repeatpenState, setRepeatPenState] = useState(null);

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer(undefined);
    }
  }, [prompt]);

  const enterHandler = () => {
    setEnter(true);
    sendPrompt(new KeyboardEvent('keydown', {key: 'Enter'}));
  }

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      // "content": `\n\n### Instructions:\n${JSON.stringify({prompt})}\n\n### Response:\n`,

      const data = {
        messages: [
          {
            "role": "system",
            ...(roleState ? {"content" : roleState} : {"content": defaultRole})
          },
          {
            "role": "user",
            "content": `${JSON.stringify({prompt})}`,
          }
        ],
        ...(maxTokState ? {max_tokens : maxTokState} : {max_tokens: 64}),
        ...(nState && { n: nState }),
        ...(tempState && { temperature: tempState }),
        ...(topPState && { top_p: topPState }),
        ...(topKState && { top_k: topKState }),
        ...(stopState && { stop: stopState }),
        ...(ppenState && { presence_penalty: ppenState }),
        ...(freqpenState && { frequency_penalty: freqpenState }),
        ...(repeatpenState && { repeat_penalty: repeatpenState })
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

  const resetDefaults = () => {
    setDefaults(true);
    
    setRoleState(null);
    setMaxTokState(null);
    setNState(null);
    setTempState(null);
    setPState(null);
    setKState(null);
    setStopState(null);
    setPPenState(null);
    setFreqPenState(null);
    setRepeatPenState(null);

    document.querySelectorAll(".settings_panel .settings_input").forEach((input) => (input.value = ""));
  }

  const openSettings = () => {
    setSettings(true);
  };

  const closeSettings = () => {
    setSettings(false);
  };

  return (
    <div className="app">
      <div className="settings_panel"
        style = {{display: settings ? 'block' : 'none'}}
      >
        {/* add display css, inputfields, mouseover explanations */}
        <button class="closebtn" onMouseDown={closeSettings}>x</button>
        <h1
          className="settings-header1"
        >
          *Defaults used for unfilled fields
        </h1>

        <h2
          className="settings-header2"
        >
          Role:
        </h2>

        <input
          type="text"
          className="settings_input"
          placeholder="default is &quot;helpful assistant&quot;"
          onChange={(e) => setRoleState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Max tokens to predict:
        </h2>

        <input
          type="number"
          placeholder="default is 64"
          className="settings_input"
          onChange={(e) => setMaxTokState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Tokens in contex window (currently unsupported):
        </h2>

        <input
          type="number"
          placeholder="default is 1, ignored"
          className="settings_input"
          onChange={(e) => setNState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Temperature:
        </h2>

        <input
          type="number"
          className="settings_input"
          placeholder="default is 0.8"
          onChange={(e) => setTempState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Top p sample value:
        </h2>

        <input
          type="number"
          placeholder="default is 0.95"
          className="settings_input"
          onChange={(e) => setPState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Top k sample value:
        </h2>

        <input
          type="number"
          placeholder="default is 40"
          className="settings_input"
          onChange={(e) => setKState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Stop keywords:
        </h2>

        <input
          type="text"
          placeholder="default is to use no stop tokens"
          className="settings_input"
          onChange={(e) => setStopState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Presence penalty:
        </h2>

        <input
          type="number"
          placeholder="default is 0"
          className="settings_input"
          onChange={(e) => setPPenState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Frequency penalty:
        </h2>

        <input
          type="number"
          placeholder="default is 0"
          className="settings_input"
          onChange={(e) => setFreqPenState(e.target.value)}
        >
        </input>

        <h2
          className="settings-header2"
        >
          Repeat Penalty:
        </h2>

        <input
          type="number"
          placeholder="default is 1.1"
          className="settings_input"
          onChange={(e) => setRepeatPenState(e.target.value)}
        >
        </input>

        <button
          className="update-settings"
          style={{ opacity: defaults ? 0.5 : 1, transition: 'opacity 300ms ease' }}
          onMouseDown={resetDefaults}
          onMouseUp={() => setDefaults(false)}
        >
          Reset to defaults
        </button>
      </div>

      <div className="app-container">
        <button
          className="settings_button"
          style={{ display: settings ? 'none' : 'block'}}
          onMouseDown={openSettings}
        >
          {settingsText}
        </button>

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

        <button 
          className="enter_button"
          style={{ opacity: enter ? 0.5 : 1, transition: 'opacity 300ms ease' }}
          onMouseDown={enterHandler}
          onMouseUp={() => setEnter(false)}      
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default App;
