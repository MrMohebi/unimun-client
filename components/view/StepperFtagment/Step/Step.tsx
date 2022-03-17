import React from 'react';


interface Props{
    children?:React.ReactNode,
    step:number
}

const Step = (props:Props) => {
    return (
        <div id={`stepperFragment-step-${props.step}`} className={'transition-all opacity-100 scale-100 duration-1000'}>
            {
                props.children
            }
        </div>
    );
};

export default Step;