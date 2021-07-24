import React, {useState} from 'react';
import {LocationCity} from '@material-ui/icons';

import "./style.css"

const SelectUni = () => {
    let [uni, setUni] = useState("uk");
    return (
        <div className={"select-uni-container"}>
            <div className="preview d-flex flex-row align-items-start">
                <LocationCity/>
                <span>{uni}</span>
            </div>
        </div>
    );
};

export default SelectUni;