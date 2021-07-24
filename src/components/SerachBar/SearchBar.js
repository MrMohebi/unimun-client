import React from 'react';

import "./style.css"

const SearchBar = () => {
    return (
        <div className={"search-bar-container"}>
            <input className={"search-input"} placeholder={"جستوجو"}/>
        </div>
    );
};

export default SearchBar;