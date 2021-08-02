import React from 'react';
import {BrowserRouter,Route} from "react-router-dom";

//css
import "./assets/cssReset/cssReset_v1.css"
import "./assets/fonts/fonts.css"
import './assets/bootstrap/css/bootstrap.css'


import Navbar from "./components/Navbar/Navbar";
import SearchBar from "./components/SerachBar/SearchBar";
import MainPage from "./components/_Pages/MainPage/MainPage";

function App() {
  return (
      <>
          <BrowserRouter>
              <Route exact path='/' component={SearchBar}/>
              <Route exact path='/' component={Navbar}/>
              <Route exact path='/' component={MainPage}/>
          </BrowserRouter>
      </>
  );
}

export default App;
