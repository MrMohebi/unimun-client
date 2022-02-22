import React from 'react';

interface Props {
    id: string,
    borderSize: string,
    borderColor: string,
    wrapperClassname?: string,
    dir?: string,
    numOnly: boolean,
    labelText?: string,
    maxLength?: number,
    onChange?: any
}

const Input = ({id, wrapperClassname, dir, numOnly, labelText, maxLength, onChange,borderColor,borderSize}: Props) => {


    return (
        <div className={wrapperClassname ?? ''}>
            <input onChange={(e) => {
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
                   className={` bg-transparent h-full w-full IranSans rounded-md  border-${borderSize} border-${borderColor} h-12 outline-0 px-3`}/>
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