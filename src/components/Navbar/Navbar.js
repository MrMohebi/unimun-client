import React from 'react';

import {Add, PersonOutlineOutlined,ChatBubbleOutlineOutlined,HomeOutlined,ListOutlined} from '@material-ui/icons';

import "./style.css"

const Navbar = () => {
    return (
        <div className={"navbar-container d-flex flex-row-reverse justify-content-around fixed-bottom mb-2"}>
            <div><HomeOutlined/></div>
            <div><ListOutlined/></div>
            <div className={"add-icon"} ><Add /></div>
            <div><ChatBubbleOutlineOutlined/></div>
            <div><PersonOutlineOutlined/></div>
        </div>
    );
};

export default Navbar;