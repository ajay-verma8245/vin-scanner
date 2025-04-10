import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";

const app = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(app);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
