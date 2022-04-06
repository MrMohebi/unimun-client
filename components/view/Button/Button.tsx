import React from 'react';
import {TailSpin} from 'react-loader-spinner'


interface Props {
    className?: string,
    bottomCenter?: boolean,
    rippleColor?: string,
    children?: any,
    disabled?: boolean,
    onClick?: any
    loading?: boolean
}

const Button = (props: Props) => {

    const rippleEffect = (e: any) => {
        let button = document.getElementById('rButton') as HTMLDivElement
        let ripple = document.createElement('div')
        ripple.className = 'ripple absolute'
        ripple.style.backgroundColor = props.rippleColor ?? '#6e6e6e'
        button.appendChild(ripple)
        ripple.style.top = e.clientY - e.currentTarget.getBoundingClientRect().top + 'px'
        ripple.style.left = e.clientX - e.currentTarget.getBoundingClientRect().left + 'px'
        setTimeout(() => {
            button.removeChild(ripple)
        }, 600)
    }
    return (
        <button disabled={props.disabled || props.loading} id={'rButton'} onClick={(e) => {
            e.preventDefault()
            if (!props.disabled)
                rippleEffect(e)
            if (props.onClick) {
                props.onClick(e)
            }
        }}
                className={`${props.loading ? 'relative ' : ''}${props.className}  ${props.disabled ? 'pointer-events-none' : ''} relative outline-0 overflow-hidden select-none active:border-0  outline-0`}>
            {props.loading ?
                <div className={'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'}>
                    <TailSpin color="white" height={30} width={30}/>
                </div>

                :
                props.children
            }
        </button>
    );
};

export default Button;