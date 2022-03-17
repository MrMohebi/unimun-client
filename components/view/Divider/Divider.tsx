import React from 'react';

interface Props {
    type: 'horizontal' | 'vertical',
    color:string,
    className?:string,
}

const Divider = (props: Props) => {
    return (
        <div className={'w-full flex justify-center items-center '+ props.className}>
            <div style={{
                width:props.type === 'horizontal'?'85%':'1px',
                height:props.type === 'vertical'?'85%':'1px',
                background:props.color
            } }>
            </div>
        </div>

    );
};

export default Divider;