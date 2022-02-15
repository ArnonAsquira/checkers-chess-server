import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./css/main.css";
import axios from "axios";
import { baseUrl } from "./constants";
import getCookies from "./components/utils/getCookies";

axios
  .get(baseUrl, {
    headers: {
      Authorization: `bearer ${getCookies().jwt}`,
    },
  })
  .then(({ data }) => console.log(data))
  .catch((err) => console.log(err));

function Main() {
  return <App />;
}

ReactDOM.render(<Main />, document.getElementById("root"));
