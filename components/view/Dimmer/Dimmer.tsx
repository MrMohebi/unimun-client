import React from 'react';

interface Props {
    show: boolean
    onClose: Function
}

const Dimmer = (props: Props) => {
    return (
        <div id={'dimmer-component'} onClick={(e) => {
            let el = e.target as HTMLElement
            if (el.id === 'dimmer-component') {
                props.onClose()
            }
        }}
             className={`z-50 fixed top-0 left-0 w-full h-full bg-black transition-all ${props.show ? ' opacity-30' : 'opacity-0 pointer-events-none'} `}>
        </div>
    );
};

export default Dimmer;