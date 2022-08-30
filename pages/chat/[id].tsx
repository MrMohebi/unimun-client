import React, {useEffect, useRef, useState} from 'react';
import Back from '../../assets/svgs/back.svg'
import Header from "../../components/common/Header/Header";
import Button from "../../components/view/Button/Button";
import {useReactiveVar} from "@apollo/client";
import {Messages} from "../../store/chat";
import {useRouter} from "next/router";
import produce from 'immer'

const ChatScreen = () => {

    const chatBoxRef = useRef<HTMLDivElement>(null)


    const [messages, setMessages] = useState([{
        id: '20',
        text: "سلام امید وارم که خوب باشید\n" +
            "اگهی بنده رو میتونید انجام بدید ؟",
        sender: 'me',
        time: '10:10',
        seen: false,
        inReplyOf: ''
    },]);

    const reactiveMessages = useReactiveVar(Messages)

    useEffect(() => {


        if (chatBoxRef.current!.classList.contains('scroll-auto')) {
            chatBoxRef.current!.classList.remove('scroll-auto')
        }
        chatBoxRef.current!.scrollTo(0, chatBoxRef.current!.scrollHeight)


    }, []);


    const AddMessage = () => {

    }

    const addMessage = (text: string) => {
        setMessages(
            produce((draft) => {
                draft.push({
                    id: '20',
                    text: text,
                    sender: 'me',
                    time: '10:10',
                    seen: false,
                    inReplyOf: ''
                });
            })
        )
    }

    const router = useRouter();


    return (
        <div ref={chatBoxRef} className={'w-full h-full overflow-scroll scroll-auto pb-12'}>
            <div id={'chat header'}
                 className={'w-full h-20 px-4 bg-white/70 backdrop-blur shadow flex flex-row justify-between items-center fixed top-0 left-0 '}>
                <div className={'flex flex-row justify-start items-center'}>
                    <div className={'w-8 h-8 rotate-180'} onClick={() => {
                        router.push('/chat')
                    }}><Back/></div>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cameronavatar.jpg/1200px-Cameronavatar.jpg"
                        alt="" className={'w-10 mr-2  h-10 rounded-lg '}/>
                    <div className={'flex flex-col justify-center items-start mr-4'}>
                        <span className={'IranSansMedium'}>آرمین</span>
                        <span className={'IranSansMedium text-textDark text-[0.7rem]'}>20 دقیقه پیش</span>
                    </div>
                </div>
                <Button id={'chat-more'} rippleColor={'rgba(0,0,0,0.18)'} className={'h-7 w-7 rounded-lg'}>
                    <img src={'/assets/svgs/more.svg'} alt={'unimun more chat'} className={'h-7 w-7'}/>

                </Button>
            </div>


            <div className={'chat-box w-full h-full flex flex-col justify-end items-center pt-24'}>

                {
                    messages.map((item, index) => {
                        return (
                            <div key={'chat-bubble-' + index}
                                 className={`w-full h-auto flex-row items-center shrink-0 py-2 px-3 ${item.sender === "me" ? "justify-start" : "justify-end"} chat-bubble-animation `}>
                                <div style={{
                                    animationDelay: index * 50 + 'ms'
                                }}
                                     className={'flex IranSansMedium px-3 py-3 flex-col justify-start items-start bg-primary text-white rounded-xl max-w-[80%] '}>
                                    <p>{item.text}</p>
                                    <div className={'flex mt-3 flex-row justify-start items-center w-full'}>
                                        <img src="/assets/svgs/check.svg" className={'w-2 h-2'} alt=""/>
                                        <span className={'IranSansMedium text-[0.7rem] mr-2'}>10:10</span>
                                    </div>

                                </div>

                            </div>

                        )
                    })
                }


            </div>
            <div className={'bottom-0 fixed left-0 w-full bg-white shadow grid grid-cols-12 h-14 px-3'}>
                <div className={'send-and-voice col-span-2 flex flex-row justify-start items-center'}>
                    <img src={'/assets/svgs/send.svg'} className={'text-primary IranSansMedium text-sm h-5 w-5'}
                         onClick={() => {
                             addMessage((document.getElementById('text-chat') as HTMLInputElement)!.value);
                             (document.getElementById('text-chat') as HTMLInputElement)!.value = ""
                         }}/>
                    <img src="/assets/svgs/microphone.svg" alt="Unimun chat microphone svg" className={'w-6 h-6 mr-2'}/>
                </div>
                <div className={'send-and-voice col-span-9 flex flex-row justify-start items-center mr-2 pr-2'}>
                    <input id={'text-chat'} type="text" dir={'rtl'} placeholder={'بنویس'}
                           className={'w-full IranSansMedium'}/>
                </div>
                <div className={'send-and-voice col-span-1 flex flex-row justify-center items-center  '}>
                    <img src="/assets/svgs/emoji-happy.svg" alt="Unimun chat microphone svg"
                         className={'w-5 h-5 mr-2'}/>
                </div>


            </div>

            <div id={'bottom-of-chat fixed bottom-0 '}></div>

        </div>
    );
};

export default ChatScreen;