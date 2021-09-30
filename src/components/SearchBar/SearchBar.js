import React from 'react';

import "./style.css"
import building from "./icons/building.svg";
import searchIcon from "./icons/searchNormal.svg";
const SearchBar = () => {
    return (
        <div className={"search-bar-container"} >
            <div className={"search-bar d-flex flex-row align-items-center"}>
                <div className="select-uni-search p-1 d-flex flex-row align-items-center">
                    <span className={"pl-2 pr-2"} >همه</span>
                    <img src={building} alt='select uni'/>
                </div>

                <input placeholder={"جستجو"} dir={"rtl"}/>
                <img src={searchIcon} alt='searchButton'/>
            </div>
        </div>
    );
};

export default SearchBar;