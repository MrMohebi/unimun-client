import React, {useEffect, useRef, useState} from 'react';
import Back from '../../assets/svgs/back.svg'
import Header from "../../components/common/Header/Header";
import Button from "../../components/view/Button/Button";
import {gql, useLazyQuery, useMutation, useReactiveVar, useSubscription} from "@apollo/client";
import {CurrentChatUserData, Messages} from "../../store/chat";
import {useRouter} from "next/router";
import produce, {castDraft} from 'immer'
import {clientChat} from "../../apollo-client";
import {route} from "next/dist/server/router";
import moment from "jalali-moment";
import chat from "./index";
import {UserId} from "../../store/user";
import {verifyAndLint} from "next/dist/lib/verifyAndLint";
import {setToken} from "../../helpers/TokenHelper";
import {UnimunID} from "../../store/GLOBAL_VARIABLES";

const ChatScreen = () => {

    const chatBoxRef = useRef<HTMLDivElement>(null)
    const router = useRouter();
    const id = router.query.id
    const chatScrollerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState([] as any);
    const [myId, setMyId] = useState('');
    const [render, setRender] = useState(false);


    useEffect(() => {
        if (Object.keys(CurrentChatUserData()).length) {
            if (chatBoxRef.current!.classList.contains('scroll-auto')) {
                chatBoxRef.current!.classList.remove('scroll-auto')
            }
            scrollToBottom()
        } else {
            router.push('/chat')
        }
    }, [])


    const chatsSubscriptionRequest = gql`

        subscription onNewMessage {
            newMessage{
                id
                userID
                chatID
                sentAt
                type
                text
            }
        }`

    const chatsSubscription = useSubscription(chatsSubscriptionRequest, {client: clientChat})

    useEffect(() => {
        if (chatsSubscription.data) {
            let arr = [chatsSubscription.data.newMessage]
            setMessages(
                produce((draft) => {
                    (draft as [any]).push(chatsSubscription.data.newMessage)
                    return draft
                })
            );
            scrollToBottom()
        }
    }, [chatsSubscription.data]);


    const chatMessagesQuery = gql`
        query($chatID:ID!){
            chatMessages(chatID: $chatID, limit: 100){
                text
                id
                sentAt
                userID
                type
            }
        }
    `
    const [chatMessages, chatMessagesResult] = useLazyQuery(chatMessagesQuery, {client: clientChat})


    const firstCatch = useRef(true)

    const getMessages = () => {
        let id = location.pathname.split('/')[2]
        if (id) {
            chatMessages({
                variables: {
                    chatID: id
                }
            }).then((value) => {
                try {
                    setMessages(
                        produce((draft) => {
                            draft = [...value.data.chatMessages];
                            (draft as any).reverse()
                            return draft
                        })
                    )

                } catch (e) {
                    console.log('failed')
                }
            })
        }
    }
    useEffect(() => {
        try {
            getMessages()
        } catch (e) {
            setTimeout(() => {
                getMessages()
            }, 500)
        }
        console.log(CurrentChatUserData())
    }, []);

    useEffect(() => {
        if (firstCatch.current) {
            scrollToBottom()
        }

    }, [messages]);


    const newMessageMutation = gql`
        mutation($chatID:ID! $text:String) {
            sendMessage(chatID: $chatID text:$text){
                text
                sentAt
                id
            }
        }
    `
    const [newMessage, newMessageResult] = useMutation(newMessageMutation, {client: clientChat})
    const sendMessageBtn = useRef<HTMLImageElement>(null);


    const scrollToBottom = () => {
        if (chatBoxRef && chatBoxRef.current && chatScrollerRef && chatScrollerRef.current) {
            chatBoxRef.current.scrollTo(0, chatScrollerRef.current.getBoundingClientRect().height)
        }
    }


    function moreOnClick() {
        scrollToBottom()
    }

    return (
        <div ref={chatBoxRef} className={'w-full h-full overflow-scroll scroll-auto pb-12'}>
            <div id={'chat header'}
                 className={'w-full h-20 px-4 bg-white/70 backdrop-blur shadow flex flex-row justify-between items-center fixed top-0 left-0 z-20'}>
                <div className={'flex flex-row justify-start items-center'}>
                    <div className={'w-8 h-8 rotate-180'} onClick={() => {
                        router.push('/chat')
                    }}><Back/></div>
                    {
                        CurrentChatUserData().id === UnimunID() ?
                            <img
                                src="/assets/svgs/chat-notifs.svg"
                                alt="" className={'w-10 mr-2  h-10 rounded-lg '}/>
                            :
                            <div
                                className={'w-10 mr-2  h-10 rounded-lg flex flex-col justify-center items-center '}>
                                    <span
                                        className={'IranSansMedium text-lg'}>
                                        {/*@ts-ignore*/}
                                        {CurrentChatUserData().id === UnimunID() ? "یونیمون" : CurrentChatUserData() ? CurrentChatUserData().members ? CurrentChatUserData().members[1]!.name[0] : "" : ""}</span>
                            </div>
                    }

                    <div className={'flex flex-col justify-center items-start mr-4'}>

                        <span className={'IranSansMedium'}>
                            {/*@ts-ignore*/}
                            {CurrentChatUserData().id === UnimunID() ? "یونیمون" : CurrentChatUserData() ? CurrentChatUserData().members ? CurrentChatUserData().members[1]!.name : "" : ""}</span>
                        <span className={'IranSansMedium text-textDark text-[0.7rem]'}>20 دقیقه پیش</span>
                    </div>
                </div>
                <Button id={'chat-more'} rippleColor={'rgba(0,0,0,0.18)'} className={'h-7 w-7 rounded-lg'}
                        onClick={moreOnClick}>
                    <img src={'/assets/svgs/more.svg'} alt={'unimun more chat'} className={'h-7 w-7'}/>

                </Button>
            </div>


            <div className={'chat-box w-full overflow-scroll flex flex-col justify-end items-center pt-20 pb-2'}
                 ref={chatScrollerRef}>

                {
                    messages.map((item: any, index: number) => {
                        let sentByMe = item.userID === UserId()
                        if (item.type === 'TEXT')
                            return (
                                <div key={'chat-bubble-' + index}
                                     className={`w-full h-auto flex-row items-center shrink-0 py-1 px-3 ${sentByMe ? "justify-start" : "justify-end"} `}>
                                    <div style={{
                                        animationDelay: index * 50 + 'ms'
                                    }}
                                         className={`flex IranSansMedium px-3 py-3 flex-col justify-start items-start ${sentByMe ? "bg-primary" : "bg-white ml-0 mr-auto"} text-white rounded-xl w-full max-w-[80%] `}>
                                        <p className={`${!sentByMe ? "text-textBlack" : "white"}`}>{item.text}</p>
                                        <div className={'flex mt-3 flex-row justify-start items-center w-full'}>
                                            <img src="/assets/svgs/check.svg"
                                                 className={`w-2 z-10 h-2 ${sentByMe ? '' : "invert-[0.5]"}`}
                                                 alt=""/>
                                            <span
                                                className={`IranSansMedium text-[0.7rem] mr-2 ${!sentByMe ? "text-textBlack" : "white"}`}>{moment(item.sentAt).format('MM:SS')}</span>
                                        </div>

                                    </div>

                                </div>

                            )
                    })
                }


            </div>
            <div
                className={'bottom-0 fixed left-0 w-full bg-white/90 backdrop-blur z-20 shadow grid grid-cols-12 h-14 px-3'}>
                <div className={'send-and-voice col-span-2 flex flex-row justify-start items-center'}>
                    <img src={'/assets/svgs/send.svg'} className={'text-primary IranSansMedium text-sm h-5 w-5'}
                         onClick={() => {
                             let messageText = (document.getElementById('text-chat') as HTMLInputElement)!.value


                             newMessage({
                                 variables: {
                                     chatID: id,
                                     text: messageText
                                 }
                             }).then((value) => {
                                 console.log(value)
                             });
                             //     // addMessage((document.getElementById('text-chat') as HTMLInputElement)!.value);
                             (document.getElementById('text-chat') as HTMLInputElement)!.value = ""
                         }} ref={sendMessageBtn}/>
                    <img src="/assets/svgs/microphone.svg" alt="Unimun chat microphone svg"
                         className={'w-6 h-6 mr-2'}/>
                </div>
                <div className={'send-and-voice col-span-9 flex flex-row justify-start items-center mr-2 pr-2'}>
                    <input onKeyPress={(event) => {
                        if (event.key == 'Enter') {
                            event.preventDefault()
                            sendMessageBtn.current!.click()
                        }
                    }} id={'text-chat'} type="text" dir={'rtl'} placeholder={'بنویس'}
                           className={'w-full IranSansMedium bg-transparent'}/>
                </div>
                <div className={'send-and-voice col-span-1 flex flex-row justify-center items-center  '}>
                    <img src="/assets/svgs/emoji-happy.svg" alt="Unimun chat microphone svg"
                         className={'w-5 h-5 mr-2'}/>
                </div>


            </div>

            <div id={'bottom-of-chat fixed bottom-0 '}></div>

        </div>

    )
        ;
};

export default ChatScreen;