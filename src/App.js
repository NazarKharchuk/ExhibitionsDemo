import s from "./App.module.css";
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Header from "./Components/Header/Header";
import Content from "./Components/Content/Content";

function App() {
  return (
    <BrowserRouter>
      <div className={s.App}>
        <Header>
          <Content />
        </Header>
      </div>
    </BrowserRouter>
  );
}

export default App;
