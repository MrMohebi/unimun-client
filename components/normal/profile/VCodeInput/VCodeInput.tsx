import React, {useEffect, useState, useRef} from 'react';
import Input from "../../../view/Input/Input";
import {useRouter} from "next/router";

interface Props{
    length:number,
    onChange?:any,
    success:boolean,
    err:boolean,
    stepBack:any,
}

const VCodeInput = (props:Props) => {
    let inputs = Array(props.length)
    inputs.fill('')
    let lastLength = React.useRef(0)
    const router = useRouter()

    const [code,setCode] = React.useState("")
    const [numbersHolder,setNumbersHolder] = React.useState("")
    const [err,setErr] = React.useState(props.err)
    const [success,setSuccess] = React.useState(props.success)
    const [allowToSendVCode, setAllowToSendVCode] = useState(false);

    const deadLine = useRef(0);
    // const [remaining, setRemaining] = useState();

    useEffect(()=>{
        if (props.onChange){
            props.onChange(code)
        }
        setSuccess(props.success)
        setErr(props.err)
    },[code,props.success, props.err])

    const resendCode = ()=>{
        let now = new Date().getTime()

        if(!deadLine.current){
            deadLine.current = now+(60*2)
            console.log('added')

        }else{
            console.log(deadLine.current - now)
        }
        // setAllowToSendVCode(true)
        // let now = new Date()
        // let remains = now.setDate(now.getMinutes()+2)
        // console.log(remains)



    }

    return (
        <div className={'w-full relative px-3 h-28'}>
            <div className={'h-full w-full  flex flex-row-reverse justify-around items-center'}>

                <Input id={'Vcode'} wrapperClassname={'w-100 h-full text-tiny absolute w-full opacity-0'}  maxLength={props.length} numOnly={true} onChange={(e:any)=>{
                    let text = e.currentTarget.value
                    setCode(text)
                    if (lastLength.current<text.length){
                        setNumbersHolder(text)
                    }
                    lastLength.current = e.currentTarget.value.length
                }}/>
                {
                    inputs.map((vInput,index)=>{
                        return(
                            <div key={index} className={`w-12 -z-10 h-16 ${err?'text-red-500':success?'text-primary':'text-textDarker'} overflow-hidden IranSansMedium flex flex-row justify-center items-center text-5xl relative`}>
                                <span className={`transition duration-200 ${code[index]===undefined?'translate-y-16':'translate-x-0'} `}>{code[index]?code[index]:numbersHolder[index]}</span>
                                <div className={`absolute bottom-0 w-full h-1  ${err?'bg-red-500':success?'bg-primary':'bg-gray-400'}   rounded-xl left-0`}>
                                </div>
                            </div>
                        )
                    })
                }

            </div>

            <div className={'h-20 w-full mt-4 flex flex-row justify-between items-center IranSans text-primary text-md'}>
                <span onClick={()=>{
                    props.stepBack()
                }}>ویرایش شماره</span>
                <span onClick={resendCode} className={`${allowToSendVCode?'text-primary':'text-gray-500'}`}>{}ارسال دوباره کد</span>
            </div>
        </div>
    );
};

export default VCodeInput;