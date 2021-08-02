import React from 'react';

import "./style.css"
const Advertisement = (props) => {
    return (
        <div className={"advertisement-main-container d-flex flex-column"}>
            {props.adds.map(eAdd=> {
                let timeText = eAdd.time;
                return(
                <div className={"advertisement-section d-flex flex-column align-items-end"} key={eAdd.id}>
                    <h5 className={"mb-auto"}>{eAdd.title}</h5>
                    <span>{eAdd.price} هزار تومان</span>
                    <span>{timeText}</span>
                </div>
                )
            })}
        </div>
    );
};

export default Advertisement;