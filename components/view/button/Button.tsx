import React from 'react';


interface Props {
    className?: string,
    bottomCenter?: boolean,
    rippleColor?: string,
    children?: any,
    disabled?: boolean,
    onClick?: any
}

const Button = (props: Props) => {

    const rippleEffect = (e: any) => {
        let button = document.getElementById('rButton') as HTMLDivElement
        let ripple = document.createElement('div')
        ripple.className = 'ripple absolute'
        ripple.style.backgroundColor = props.rippleColor ?? '#6e6e6e'
        button.appendChild(ripple)
        ripple.style.top = e.pageY - e.currentTarget.getBoundingClientRect().top + 'px'
        ripple.style.left = e.pageX - e.currentTarget.getBoundingClientRect().left + 'px'
        setTimeout(() => {
            button.removeChild(ripple)
        }, 600)
    }
    return (
        <button disabled={props.disabled} id={'rButton'} onClick={(e) => {
            if (!props.disabled)
                rippleEffect(e)
            if (props.onClick) {
                props.onClick(e)
            }
        }}
                className={`${props.className} ${props.disabled ? 'pointer-events-none' : ''} relative outline-0 overflow-hidden`}>
            {props.children}
        </button>
    );
};

export default Button;