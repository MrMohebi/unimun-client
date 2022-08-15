import React from 'react';
import Phone from '../../../assets/svgs/contact-toast-phone.svg'
import Telegram from '../../../assets/svgs/contact-toast-telegram.svg'
import Button from "../Button/Button";
import Copy from '../../../assets/svgs/copy-icon.svg'
// @ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';


const ContactToast = (props: {
    show: boolean,
    value: string,
    buttonOnClick: Function,
    type: string,
    onClose: Function
}) => {


    const types = {
        "telegram": {
            icon: <Telegram/>,
            title: 'لینک به ایدی تلگرام',
            description: 'میتونین ایدی تلگرام رو کپی کنید یا با فیلتر شکن روشن دکمه زیر رو بزنین',
            command: 'copyTel',
            buttonText: 'باز کردن در تلگرام'
        },
        "phone": {
            icon: <Phone/>,
            title: 'شماره تلفن کاربر',
            description: 'میتونین ایدی تلگرام رو کپی کنید یا با فیلتر شکن روشن دکمه زیر رو بزنین',
            command: 'copyPhone',
            buttonText: 'تماس با شماره'
        }
    } as any

    const makeNumberPretty = (number: string) => {

        let prettyNumber = "";
        for (let i = 0; i < number.length; i++) {
            if (i === 4 || i === 7) {
                prettyNumber += " " + number[i]
            } else
                prettyNumber += number[i]
        }

        return prettyNumber

    }

    return (
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    props.onClose()
                }
            }}
            className={` h-full w-full ${props.show ? " bg-black/[.4]" : "bg-black/[0] pointer-events-none"}  ease-in-out transition-all fixed z-50 top-0 left-0`}>
            <div
                className={` pointer-events-none w-[95%] h-32 bg-white  ${props.show ? "" : "translate-y-40"} duration-500 transition-all ease-in-out absolute bottom-5 overflow-hidden  left-1/2 -translate-x-1/2 rounded-2xl shadow flex flex-col justify-between items-center `}>
                <div className={'flex flex-row justify-start w-full '}>
                    <div className={'w-7 h-7 mt-2 mr-3 '}>
                        {
                            types[props.type].icon
                        }

                    </div>
                    <span className={'IranSansMedium mr-2 mt-2'}>{types[props.type].title}</span>
                </div>
                <p className={'w-full text-[0.6rem] IranSansMedium whitespace-nowrap mx-auto text-center'}>{types[props.type].description}  </p>
                <div className={'w-full flex flex-row justify-between items-center px-2'}>
                    <div className={'w-1/2 pointer-events-auto'}>
                        <Button className={'w-11/12 flex flex-row justify-center rounded-xl mb-2 h-10 items-center'}
                                id={'oncallbtn'} rippleColor={"rgba(0,0,0,0.09) "}
                                onClick={() => {
                                    if (props.type === 'phone')
                                        window.open(`tel:${props.value}`, '_blank');
                                    else if (props.type === 'telegram')
                                        window.open('https://t.me/' + (props.value).replaceAll("@", ""), '_blank');
                                }}
                        >
                            <span className={'text-primary IranSansMedium '}>{types[props.type].buttonText}</span>
                        </Button>
                    </div>


                    <div className={'w-1/2 px-1 rounded-xl h-10 flex flex-row justify-end  items-center bg-[#E1E8ED] '}>
                        <div className={'w-full text-center'}>
                            <span dir={'ltr'} className={'IranSansMedium '}>
                                {
                                    props.type === 'phone' ?
                                        makeNumberPretty(props.value)
                                        :
                                        props.value
                                }
                            </span>

                        </div>


                        <CopyToClipboard text={props.value}
                                         onCopy={() => {

                                             if (props.type === 'telegram')
                                                 props.onClose("copyTel")
                                             else if (props.type === 'phone')
                                                 props.onClose('copyPhone')
                                         }}>
                            <span className={'contents pointer-events-auto'}>
                                <Button id={'copy-call'} rippleColor={'rgba(0,0,0,0.16)'} onClick={(e: any) => {
                                }}
                                        className={'w-8 h-8 bg-white  rounded-lg flex flex-col items-center justify-center p-2'}>

                                    <Copy/></Button>
                            </span>
                        </CopyToClipboard>


                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactToast;