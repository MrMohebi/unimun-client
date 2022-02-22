import React, {useEffect} from 'react';
import Input from "../../view/Input/Input";

interface Props{
    length:number,
    onChange?:any,
    success:boolean,
    err:boolean
}

const VCodeInput = (props:Props) => {
    let inputs = Array(props.length)
    inputs.fill('')
    let lastLength = React.useRef(0)

    const [code,setCode] = React.useState("")
    const [numbersHolder,setNumbersHolder] = React.useState("")
    const [err,setErr] = React.useState(props.err)
    const [success,setSuccess] = React.useState(props.success)


    useEffect(()=>{
        if (props.onChange){
            props.onChange(code)
        }
        setSuccess(props.success)
        setErr(props.err)
    },[code,props.success, props.err])


    return (
        <div className={'w-full relative px-3 h-28  flex flex-row-reverse justify-around items-center'}>
            <Input id={'Vcode'} wrapperClassname={'w-100 h-full text-tiny absolute w-full opacity-0'} borderSize={'0'} borderColor={'transparent'} maxLength={props.length} numOnly={true} onChange={(e:any)=>{
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
    );
};

export default VCodeInput;