import React from 'react';

import {Add, PersonOutlineOutlined,ChatBubbleOutlineOutlined,HomeOutlined,ListOutlined} from '@material-ui/icons';

import "./style.css"
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <div className={"navbar-container d-flex flex-row-reverse justify-content-around fixed-bottom mb-2"}>
            <Link to={"/"}>
                <div><HomeOutlined/></div>
            </Link>
            <div><ListOutlined/></div>
            <Link to={"/newAd"}>
                <div className={"add-icon"} ><Add /></div>
            </Link>
            <div><ChatBubbleOutlineOutlined/></div>
            <div><PersonOutlineOutlined/></div>
        </div>
    );
};

export default Navbar;