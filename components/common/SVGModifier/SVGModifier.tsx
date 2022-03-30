import React, {useEffect, useRef} from 'react';

interface Props{
    elementSelector:string,
    value:string,
    children:string
}

const SvgModifier = (props:Props) => {

    const svgHolder = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        svgHolder.current.querySelector(props.elementSelector)
    })
    return (
        <div ref={svgHolder} id={'svgHolder'}>
            {props.children}
        </div>
    );
};

export default SvgModifier;