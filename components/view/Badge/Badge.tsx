import React from 'react';

interface Props {
    children: any
    className?: string
    text?:string,
    color?:string
}

const Badge = (props: Props) => {
    return (
        <div className={'relative ' + props.className ?? ""}>
            {props.children}
            <div className={`absolute -top-0.5 -right-0.5 border border-2 white rounded-2xl ${props.text?'':'h-3 w-3'}`} style={{background:props.color??'red'}}/>
        </div>
    );
};

export default Badge;