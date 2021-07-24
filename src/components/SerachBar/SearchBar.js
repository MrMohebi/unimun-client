import React from 'react';


import SelectUni from "../SelectUni/SelectUni";

import "./style.css"

const SearchBar = () => {
    return (
        <div className={"search-bar-container"}>
            <SelectUni/>
            <input className={"search-input"} placeholder={"جستوجو"}/>
        </div>
    );
};

export default SearchBar;