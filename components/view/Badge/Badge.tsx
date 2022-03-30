import React from 'react';

interface Props {
    children: any
    className?: string
    text?:string
}

const Badge = (props: Props) => {
    return (
        <div className={'relative ' + props.className ?? ""}>
            {props.children}
            <div className={`absolute -top-0.5 -right-0.5 border border-2 white bg-red-600 rounded-2xl ${props.text?'':'h-3 w-3'}`}/>

        </div>
    );
};

export default Badge;