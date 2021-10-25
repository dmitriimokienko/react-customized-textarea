import React from "react";
import ReactDOM from "react-dom";
import { Textarea } from "./components/Textarea";
import { Wrapper } from "./components/Wrapper";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Wrapper>
      <Textarea
        onSend={(text: string) => alert(text)}
        defaultValue={
          <div>
            <a href="#">http://localhost:3000/</a> <span>qwe qwe qwe </span>
          </div>
        }
      />
    </Wrapper>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
