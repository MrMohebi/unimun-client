import React, {useState} from 'react';

const DropDown = (props: any) => {

    const [open, setOpen] = useState(false);
    return (
        <div className={'dropdown relative ' + props.className} onClick={() => {
            setOpen(!open)
        }}>
            {props.dropDownContent}
            <div style={{
                background: "rgba(255,255,255,0.26)"
            }}
                 className={`dropdown-content-container absolute top-6 right-0 ${open ? 'block' : 'hidden'} ${props.containerClassName}`}>
                {props.children}
            </div>
        </div>
    );
};

export default DropDown;
