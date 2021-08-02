import React from 'react';

import Advertisement from "../../Advertisement/Advertisement";

import "./style.css"

const MainPage = () => {
    let dummyAdd = [{id:"1",title:"انتخاب واحد",price:20, time:1627803006},{id:"3",title:"درخواست مهمان",price:50, time:16278020010}]
    return (
        <div className={"main-page-container"}>
            <Advertisement adds={dummyAdd}/>
        </div>
    );
};

export default MainPage;