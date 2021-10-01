import React from 'react';
import {BrowserRouter,Route} from "react-router-dom";

//css
import "./assets/cssReset/cssReset_v1.css"
import "./assets/fonts/fonts.css"
import './assets/bootstrap/css/bootstrap.css'


// import Navbar from "./components/Navbar/Navbar";
// import SearchBar from "./components/SearchBar/SearchBar";
import MainPage from "./components/_Pages/MainPage/MainPage";
import NewAdvertisement from "./components/_Pages/NewAdvertisement/NewAdvertisement";
import SearchPage from "./components/_Pages/SearchPage/SearchPage";

function App() {
  return (
      <>
          <BrowserRouter>
              <Route exact path='/' component={SearchPage}/>
          </BrowserRouter>
      </>
  );
}

export default App;
