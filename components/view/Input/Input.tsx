import React from 'react';
import {fixNumbers} from "../../../helpers/FixNumbers";

interface Props {
    id: string,
    // borderSize: string,
    // borderColor: string,
    wrapperClassName?: string,
    inputClassName?: string,
    dir?: string,
    numOnly: boolean,
    labelText?: string,
    maxLength?: number,
    onChange?: any,
    multiLine?: boolean,
    autoFocus?: boolean,
    defaultValue?: string,
    textAlignment?: string,
    onFocus?: any
    onBlur?: any
    inputRef?: React.Ref<any>
}

const Input = ({
                   id,
                   wrapperClassName,
                   inputClassName,
                   dir,
                   numOnly,
                   labelText,
                   maxLength,
                   onChange,
                   multiLine,
                   autoFocus,
                   defaultValue,
                   onFocus,
                   onBlur,
                   inputRef
               }: Props) => {


    return (
        !multiLine ?
            <div className={wrapperClassName ?? ''}>
                <input ref={inputRef ?? null} onBlur={onBlur} onFocus={onFocus} type={numOnly ? 'number' : ''}
                       defaultValue={defaultValue}
                       autoFocus={autoFocus}
                       onChange={(e) => {

                           if (numOnly) {
                               let text = fixNumbers(e.currentTarget.value);
                               text = text.replace(/\D/g, '');
                               e.currentTarget.value = text
                           }
                           if (maxLength && e.currentTarget.value.length > maxLength) {
                               e.currentTarget.value = e.currentTarget.value.slice(0, e.currentTarget.value.length - 1)
                           }
                           if (onChange) {
                               onChange(e)
                           }
                       }} dir={dir ? dir : 'rtl'} id={id}
                       className={inputClassName + ` bg-transparent h-full w-full IranSans border-2 border-primary rounded-lg bg-pri outline-0 px-3`}/>
                {labelText ?
                    <label dir={'rtl'} className={'IranSans text-textDark text-sm mr-3 mt-2'}
                           htmlFor={id}>{labelText}</label>
                    :
                    null
                }
            </div>
            :
            <div className={wrapperClassName ?? ''}>
                <textarea autoFocus={autoFocus} onChange={(e) => {
                    if (numOnly && isNaN(parseInt(e.currentTarget.value[e.currentTarget.value.length - 1]))) {
                        e.currentTarget.value = e.currentTarget.value.slice(0, e.currentTarget.value.length - 1)
                    }
                    if (maxLength && e.currentTarget.value.length > maxLength) {
                        e.currentTarget.value = e.currentTarget.value.slice(0, e.currentTarget.value.length - 1)

                    }

                    if (onChange) {
                        onChange(e)
                    }
                }} dir={dir ? dir : 'rtl'} id={id}
                          className={inputClassName ?? `bg-transparent h-full w-full IranSans border-2 border-primary rounded-lg bg-pri h-12 outline-0 px-3`}/>
                {labelText ?
                    <label dir={'rtl'} className={'IranSans text-textDark text-sm mr-3 mt-2'}
                           htmlFor={id}>{labelText}</label>
                    :
                    null
                }
            </div>
    );


};

export default Input;