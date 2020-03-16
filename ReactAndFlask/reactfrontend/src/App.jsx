import React from 'react';

import {
	Provider
} from "react-redux";
import store from "./javascript/store/store";

import PageSelector from './javascript/PageSelector';

function App() {
  return (
    <Provider store={store}>
		<PageSelector redirected={document.referrer}/>
    </Provider>
  );
}

export default App;
