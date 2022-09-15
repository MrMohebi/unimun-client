import React, {useRef} from 'react';
import {InfinitySpin, TailSpin} from 'react-loader-spinner'
import LoadingDialog from "../LoadingDialog/LoadingDialog";


interface Props {
    className?: string,
    bottomCenter?: boolean,
    rippleColor?: string,
    children?: any,
    disabled?: boolean,
    onClick?: any
    loading?: boolean
    id?: string
}

const Button = (props: Props) => {

    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleEffect = (e: any) => {
        if (buttonRef.current) {
            let button = buttonRef.current as HTMLButtonElement
            let ripple = document.createElement('div')
            ripple.className = 'ripple absolute'
            ripple.style.backgroundColor = props.rippleColor ?? 'rgba(0,0,0,0.22)'
            button.appendChild(ripple)
            ripple.style.top = e.clientY - e.currentTarget.getBoundingClientRect().y + 'px'
            ripple.style.left = e.clientX - e.currentTarget.getBoundingClientRect().left + 'px'
            setTimeout(() => {
                button.removeChild(ripple)
            }, 600)
        }

    }

    return (
        <button disabled={props.disabled || props.loading} id={props.id ?? ""} onClick={(e) => {
            e.preventDefault()
            if (!props.disabled)
                rippleEffect(e)
            if (props.onClick) {
                props.onClick(e)
            }
        }}
                className={`${props.loading ? 'relative ' : ''}${props.className}  ${props.disabled ? 'pointer-events-none' : ''} relative outline-0 overflow-hidden select-none   outline-0`}
                ref={buttonRef}>
            {props.loading ?
                <div className={'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'}>
                    <LoadingDialog color={'white'} wrapperClassName={'w-10 h-10'}/>
                </div>

                :
                props.children
            }

        </button>
    );
};

export default Button;