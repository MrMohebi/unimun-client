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
import {DOWNLOAD_HOST, UnimunID} from "../../store/GLOBAL_VARIABLES";
import FullScreenLoading from "../../components/normal/FullScreenLoading/FullScreenLoading";
import BottomSheet from "../../components/view/BottomSheet/BottomSheet";
import Input from "../../components/view/Input/Input";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatScreen = () => {

    const chatBoxRef = useRef<HTMLDivElement>(null)
    const router = useRouter();
    const id = router.query.id
    const chatScrollerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState([] as any);
    const [myId, setMyId] = useState('');
    const [render, setRender] = useState(false);
    const [currentChatStat, setCurrentChatStat] = useState('default');
    const [payRequestOpen, setPayRequestOpen] = useState(false);
    const [payRequestPrice, setPayRequestPrice] = useState(0);
    const [loadinOlderMessages, setLoadinOlderMessages] = useState(false);
    const [holdingShift, setHoldingShift] = useState(false);
    useEffect(() => {
        if (Object.keys(CurrentChatUserData()).length) {
            if (chatBoxRef.current!.classList.contains('scroll-auto')) {
                chatBoxRef.current!.classList.remove('scroll-auto')
            }
            // scrollToBottom()
        } else {
            router.push('/chat')
        }
    }, [])


    const CREATE_REQUEST_MUTATION = gql`
        mutation($chatID:ID! $acceptorID:ID! $price:Int! $description:String) {
            sendMessage(
                chatID: $chatID
                payRequest: {acceptorID: $acceptorID, price: $price, description: $description}
                text: ""
            ) {
                chatID
                editedAt
                id

            }
        }
    `
    const EDIT_REQUEST_QUERY = gql`
        mutation($id:ID! ) {
            editMessage(id: $id, payRequest: {isCanceled: false,isAccepted: true}) {
                chatID
                payRequest {
                    isAccepted

                    acceptorID
                    createdAt
                    description
                    status
                }
            }
        }
    `
    const [editRequest, editRequestResult] = useMutation(EDIT_REQUEST_QUERY, {client: clientChat})

    const [sendMoneyRequest, sendMoneyRequestResult] = useMutation(CREATE_REQUEST_MUTATION, {client: clientChat})
    const chatsSubscriptionRequest = gql`

        subscription onNewMessage {
            newMessage{
                userID
                text
                type
                sentAt
                payRequest {
                    acceptorID
                    createdAt
                    creatorID
                    description
                    id
                    isAccepted
                    paidAt
                    price
                    status
                    updatedAt
                }
                id
                chatID
                editedAt
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
            // scrollToBottom()
        }
    }, [chatsSubscription.data]);

    const EDIT_PRICE_MUTATION = gql`
        mutation ($price: Int, $id: ID!, $description: String,$isAccepted:Boolean,$isCanceled:Boolean) {
            editMessage(
                payRequest: {price: $price, description: $description, isCanceled: $isCanceled, isAccepted: $isAccepted}
                id: $id
            ) {
                id
                payRequest {
                    status
                    description
                    price
                }
            }
        }


    `
    const [editPrice] = useMutation(EDIT_PRICE_MUTATION, {client: clientChat})

    const EDIT_MESSAGE_SUBSCRIPTION = gql`

        subscription {
            editedMessage {
                chatID
                text
                id
                userID
                type
                payRequest {
                    updatedAt
                    status
                    price
                    paidAt
                    isAccepted
                    id
                    description
                    creatorID
                    createdAt
                    acceptorID
                }
                sentAt
            }
        }`

    const editMessagesSubscription = useSubscription(EDIT_MESSAGE_SUBSCRIPTION, {client: clientChat})

    useEffect(() => {
        if (editMessagesSubscription.data) {
            messages.forEach((item: any) => {
                try {
                    if (item.id === editMessagesSubscription.data.editedMessage.id) {

                        setMessages(produce((draft: any) => {
                            draft.forEach((message: any, index: any) => {
                                if (message.id === editMessagesSubscription.data.editedMessage.id) {
                                    draft[index] = editMessagesSubscription.data.editedMessage
                                }
                            })
                            return draft;
                        }))

                    }
                } catch (e) {

                }

            })
            console.log('edited ')
            console.log(editMessagesSubscription.data)
            // setMessages(
            //     produce((draft) => {
            //         (draft as [any]).push(chatsSubscription.data.newMessage)
            //         return draft
            //     })
            // );
        }
    }, [editMessagesSubscription.data]);


    const chatMessagesQuery = gql`
        query($chatID:ID!){
            chatMessages(chatID: $chatID, limit: 100){
                userID
                text
                type
                sentAt
                payRequest {
                    acceptorID
                    createdAt
                    creatorID
                    description
                    id
                    isAccepted
                    paidAt
                    price
                    status
                    updatedAt
                }
                id
                chatID
                editedAt
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
                console.log(value)

                try {
                    setChatLoading(false)
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
        if (!payRequestOpen) {
            setCurrentChatStat('default');
            (document.getElementById('pay-req-input') as HTMLInputElement).value = "";
            (document.getElementById('text-chat') as HTMLTextAreaElement).value = "";
            setCurrentEditPayRequestData(produce((draft) => {
                draft.description = "";
                draft.price = ""
                return draft
            }))
        }

        if (payRequestOpen) {


            (document.getElementById('pay-req-input') as HTMLInputElement).value = currentEditPayRequestData.price.toString().split('').reverse().join('').replace(/,/g, '').replace(/(\d{3}(?!$))/g, "$1,").split('').reverse().join('').replace(/[^\d,]/g, '');
            (document.getElementById('text-chat') as HTMLTextAreaElement).value = currentEditPayRequestData.description;
            setPayRequestPrice(parseInt(currentEditPayRequestData.price))
        }
    }, [payRequestOpen]);
    useEffect(() => {
        try {
            getMessages()
        } catch (e) {
            setTimeout(() => {
                getMessages()
            }, 500)
        }
    }, []);

    useEffect(() => {
        if (firstCatch.current) {
            // scrollToBottom()
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
    // 0, chatScrollerRef.current.getBoundingClientRect().height

    const [chatLoading, setChatLoading] = useState(true);
    const [currentEditPayRequestData, setCurrentEditPayRequestData] = useState({
        price: "",
        description: "",
        id: ''
    });
    const scrollToBottom = () => {
        if (chatBoxRef && chatBoxRef.current && chatScrollerRef && chatScrollerRef.current) {
            chatBoxRef.current.scrollTo({
                top: chatScrollerRef.current.getBoundingClientRect().height,
                behavior: 'auto'
            })
        }
    }


    function moreOnClick() {
        scrollToBottom()
    }

    return (
        <div ref={chatBoxRef} className={'w-full h-full overflow-scroll scroll-auto pb-12'}>

            <BottomSheet open={payRequestOpen} onClose={() => {
                setPayRequestOpen(false)
                setCurrentChatStat('default')
            }}>
                <div className={' w-full bg-transparent flex flex-col justify-start items-center pt-4 '}>
                    <span
                        className={'IranSansMedium text-textDarker text-right w-full text-md  pr-4 text-textDarker block'}>مبلغ درخواستی خود را وارد کنید</span>
                    <div className={'relative w-full flex-col justify-center items-center mt-5'}>

                        <div
                            className={'absolute left-5  px-2 h-6  top-1/2 -translate-y-1/2 flex flex-col justify-center border-r-2 items-center'}>
                            <img src="/assets/svgs/toman.svg" className={'invert scale-90'} alt=""/>
                        </div>
                        <Input onChange={(e: any) => {
                            let el = e.currentTarget
                            el.value = el.value.split('').reverse().join('').replace(/,/g, '').replace(/(\d{3}(?!$))/g, "$1,").split('').reverse().join('').replace(/[^\d,]/g, '')
                            setPayRequestPrice(parseInt(el.value.replaceAll(',', '')))

                        }} id={'pay-req-input'} dir={'ltr'} numOnly={false}
                               inputClassName={'pl-12 text-black IranSansMedium'}
                               wrapperClassName={"w-11/12 h-12 m-auto "}/>

                    </div>
                    <div className={'w-full bg-background mt-3'}>
                        <span className={'IranSansMedium text-[0.7rem] py-2 block pr-4 text-textDarker'}>برای راحتی بیشتر میتونی از گزینه های بالا استفاده کنی</span>
                    </div>

                    <div className={'h-20'}></div>
                </div>

            </BottomSheet>


            <FullScreenLoading dim={false} show={chatLoading}/>
            {
                currentChatStat === 'more' ?
                    <div id={'test-pay'}
                         className={' z-10   bottom-16 overflow-hidden bg-white rounded-xl right-4 shadow-md   fixed'}>
                        <Button onClick={() => {
                            setPayRequestOpen(true)
                            setCurrentChatStat('payRequest');
                        }} className={'w-full h-full flex flex-row justify-center px-3 py-3'}>
                            <img src="/assets/svgs/moneys.svg" alt=""/>
                            <span className={'IranSansMedium text-textBlack mr-4 z-30'}> درخواست وجه</span>
                        </Button>

                    </div>
                    :
                    null
            }

            <div id={'chat header'}
                 className={'w-full h-16 px-4 bg-white/70 backdrop-blur shadow flex flex-row justify-between items-center fixed top-0 left-0 z-[60]'}>
                <div className={'flex flex-row justify-start items-center'}>
                    <div className={'w-6 h-6 rotate-180'} onClick={() => {
                        router.push('/chat')
                    }}><Back/></div>
                    {

                        <div
                            className={'w-10 mr-2  h-10 rounded-lg flex flex-col justify-center items-center '}>
                            {/*@ts-ignore*/}
                            <img className={'rounded-lg'}
                                 src={CurrentChatUserData().user?.profiles ? DOWNLOAD_HOST() + CurrentChatUserData().user?.profiles[0].thumbnail : "/assets/image/no-prof.png"}
                                 alt=""/>

                        </div>
                    }

                    <div className={'flex flex-col justify-center items-start mr-4'}>

                        <span className={'IranSansMedium'}>
                            {/*@ts-ignore*/}
                            {CurrentChatUserData().user?.name}</span>
                        <span className={'IranSansMedium text-textDark text-[0.7rem]'}>چند لحظه پیش</span>
                    </div>
                </div>
            </div>


            <div className={'chat-box w-full  h-full overflow-scroll flex flex-col-reverse  pt-20 pb-2'}
                 ref={chatScrollerRef}>


                <div className={' bottom-0 h-auto '}>
                    {
                        messages.map((item: any, index: number) => {
                            let sentByMe = item.userID === UserId()
                            if (item.type === 'TEXT')
                                return (
                                    <div key={'chat-bubble-' + index}
                                         className={` w-full h-auto flex-row items-center shrink-0 py-1 px-3 ${sentByMe ? "justify-start" : "justify-end"} `}>
                                        <div style={{
                                            // animationDelay: index * 50 + 'ms'
                                        }}
                                             className={` flex IranSansMedium px-3 pt-2 pb-1 flex-col text-sm shrink-0 justify-start items-start ${sentByMe ? "bg-primary" : "bg-white ml-0 mr-auto"} text-white rounded-xl max-w-[80%]  `}>
                                            <p style={{
                                                wordBreak: 'break-word',
                                                whiteSpace: 'pre-line'
                                            }}
                                               className={` ${!sentByMe ? "text-textBlack" : "text-white"} `}>{item.text}</p>
                                            <div className={'flex mt-1 flex-row justify-start items-center '}>
                                                <img src="/assets/svgs/check.svg"
                                                     className={`w-2  h-2 ${sentByMe ? '' : "invert-[0.5]"}`}
                                                     alt=""/>
                                                <span
                                                    className={`IranSansMedium text-[0.75rem] mr-2 ${!sentByMe ? "text-textDark" : "white"}`}>{moment(item.sentAt).format('hh:mm')}</span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            else if (item.type === "PAY_REQUEST") {


                                let payRequest = item.payRequest;
                                let payRequestIcon = '';
                                switch (payRequest.status) {
                                    case "CANCELED":
                                        if (sentByMe)
                                            payRequestIcon = "/assets/svgs/pay-request-canceled.svg"
                                        else {
                                            payRequestIcon = "/assets/svgs/pay-request-canceled-sender.svg"
                                        }
                                        break;

                                    case "PENDING_ACCEPT":
                                        if (sentByMe)
                                            payRequestIcon = "/assets/svgs/pay-request.svg"
                                        else {
                                            payRequestIcon = "/assets/svgs/pay-request-sender.svg"
                                        }
                                        break;

                                    case "ACCEPTED" :
                                        if (sentByMe)
                                            payRequestIcon = "/assets/svgs/pay-request-accepted.svg"
                                        else {
                                            payRequestIcon = "/assets/svgs/pay-request-accepted-sender.svg"
                                        }
                                        break


                                }


                                return <div
                                    className={`w-full flex flex-row ${sentByMe ? "justify-start " : "justify-end"} items-center my-3`}>
                                    <div className={'w-[80%] flex flex-col justify-start items-center px-2'}>
                                        <div
                                            className={`h-auto w-full  ${sentByMe ? "bg-primary" : 'bg-white'} rounded-2xl flex flex-col justify-center items-center px-3 pb-1 pt-3`}>
                                            <div className={'flex flex-row justify-between items-center w-full'}>
                                                <img className={'w-10'}
                                                     src={payRequestIcon}
                                                     alt=""/>
                                                <span
                                                    className={`${sentByMe ? 'text-white' : 'text-black'} IranSansMedium w-full mr-3`}>درخواست</span>
                                                <div
                                                    className={`${sentByMe ? 'text-white' : 'text-black'} IranSansMedium whitespace-nowrap flex flex-row justify-center items-start`}>
                                                    <span
                                                        className={'ml-1 text-lg'}>{item.payRequest.price / 1000}</span>
                                                    <img src="/assets/svgs/thousand-tomans.svg" alt=""
                                                         className={`ml-3 w-20 ${sentByMe ? '' : 'invert'}`}/>
                                                </div>
                                            </div>
                                            <p className={`IranSansMedium ${sentByMe ? 'text-white' : 'text-black'}  mt-2 text-justify text-sm w-full text-right`}>{item.payRequest.description}</p>
                                            <div className={'w-full flex flex-row justify-between '}>
                                                <div className={'flex mt-1 flex-row justify-start items-center '}>
                                                    <img src="/assets/svgs/check.svg"
                                                         className={`w-2 z-10 h-2 ${sentByMe ? '' : 'invert-[0.5]'}`}
                                                         alt=""/>
                                                    <span
                                                        className={`IranSansMedium text-[0.75rem] mr-2 ${sentByMe ? "text-white" : "text-textDarker"}`}>{moment().format('hh:mm')}</span>
                                                </div>


                                            </div>
                                        </div>
                                        {
                                            sentByMe ?
                                                payRequest.status === "CANCELED" ?
                                                    <Button id={'pay-btn'}
                                                            className={'bg-textDark shadow  w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl mt-1.5'}>
                                                        <span className={'IranSansMedium '}>لغو شده</span>
                                                    </Button>
                                                    :

                                                    <div
                                                        className={'flex flex-row justify-between items-center w-full  mt-1.5'}>
                                                        <Button id={'pay-btn'} onClick={() => {
                                                            editPrice({
                                                                variables: {
                                                                    id: item.id,
                                                                    isCanceled: true
                                                                }
                                                            }).then((value) => {
                                                                console.log(value)

                                                            })

                                                        }}
                                                                className={'bg-primary shadow w-[49%] flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl'}>
                                                            <span className={'IranSansMedium '}>لغو</span>
                                                        </Button>
                                                        <Button id={'pay-btn'} onClick={() => {
                                                            try {
                                                                console.log(item.payRequest.description)
                                                                console.log(item.payRequest.price)
                                                                setCurrentEditPayRequestData(produce((draft) => {
                                                                    draft.description = item.payRequest.description;
                                                                    draft.price = item.payRequest.price;
                                                                    draft.id = item.id ?? item.tempID
                                                                    return draft
                                                                }))
                                                                setPayRequestOpen(true)
                                                                setCurrentChatStat('payRequest')

                                                            } catch (e) {
                                                                console.log('failde to change the price or desc')
                                                            }

                                                        }}
                                                                className={'bg-primary shadow w-[49%] flex flex-row justify-center items-center h-11 text-sm text-white rounded-xl'}>
                                                            <span className={'IranSansMedium '}>ویرایش </span>
                                                        </Button>
                                                    </div>
                                                :
                                                <Button id={'pay-btn'}
                                                        className={'bg-primary shadow w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl'}>
                                                    <span className={'IranSansMedium '}>پرداخت</span>
                                                </Button>
                                        }

                                    </div>
                                </div>
                            }
                        })
                    }
                </div>


            </div>

            <div style={{
                boxShadow: "0px -1px 9px 0px #0000000f"
            }}
                 className={'bottom-0 fixed left-0 w-full bg-white  z-[60]  border grid grid-cols-12 h-12 px-3'}>
                <div className={'send-and-voice col-span-1 flex flex-row justify-start items-center'}>


                    {
                        currentChatStat === 'write' ?
                            <img src={'/assets/svgs/send.svg'}
                                 className={'text-primary IranSansMedium text-sm h-6 w-6 animate__animated'}
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
                                     setCurrentChatStat('default');
                                     try {
                                         document.getElementById('text-chat')!.focus()

                                     } catch (e) {

                                     }
                                 }} ref={sendMessageBtn}/>
                            : currentChatStat === 'default' ?
                                <img src="/assets/svgs/chat-add.svg" alt="" onClick={() => {
                                    setCurrentChatStat('more')
                                }}/>
                                :
                                currentChatStat === 'more' ?
                                    <img src="/assets/svgs/add-collapse-chat.svg" alt="" onClick={() => {
                                        setCurrentChatStat('default')
                                    }}/>
                                    :
                                    currentChatStat === 'payRequest' ?

                                        <img src={'/assets/svgs/send.svg'}
                                             className={'text-primary IranSansMedium text-sm h-6 w-6  animate__animated '}
                                             onClick={() => {
                                                 let messageText = (document.getElementById('text-chat') as HTMLInputElement)!.value

                                                 if (currentEditPayRequestData.price) {
                                                     editPrice({
                                                         variables: {
                                                             price: payRequestPrice,
                                                             id: currentEditPayRequestData.id,
                                                             description: messageText
                                                         }
                                                     }).then((value) => {
                                                         setPayRequestOpen(false)
                                                     });
                                                 } else {
                                                     sendMoneyRequest({
                                                         variables: {
                                                             acceptorID: CurrentChatUserData().user.id,
                                                             chatID: id,
                                                             price: payRequestPrice,
                                                             description: messageText

                                                         }
                                                     }).then((value) => {
                                                         setPayRequestOpen(false)
                                                     });
                                                 }

                                                 (document.getElementById('text-chat') as HTMLTextAreaElement)!.value = ""
                                             }}/>
                                        :
                                        <div></div>
                    }

                    {/*<img src="/assets/svgs/microphone.svg" alt="Unimun chat microphone svg"*/}
                    {/*     className={'w-6 h-6 mr-2'}/>*/}
                </div>
                <div className={'send-and-voice col-span-11 flex flex-row justify-start items-center mr-2 pr-2'}>
                    <textarea onKeyDown={(event) => {
                        if (event.key === "Shift") {
                            setHoldingShift(true)
                        }
                    }} onKeyUp={(event) => {
                        if (event.key === "Shift") {
                            setHoldingShift(false)
                        }
                    }} onKeyPress={(event) => {


                        // let lht = parseInt($(event.currentTarget).css('lineHeight'), 10);


                        if (!holdingShift)
                            if (event.key == 'Enter') {
                                event.preventDefault()
                                sendMessageBtn.current!.click()
                            }
                    }} onChange={(event) => {
                        // console.log(event.currentTarget.style.lineHeight)
                        const style = getComputedStyle(event.currentTarget);
                        let lht = parseInt(style.lineHeight, 10)
                        let lines = event.currentTarget.scrollHeight / lht;
                        console.log(Math.floor(lines));


                        // console.log(event.currentTarget.value.split('\n'))
                        if (currentChatStat !== "payRequest")
                            if (event.currentTarget.value) {
                                setCurrentChatStat('write')
                            } else {
                                setCurrentChatStat('default')
                            }
                    }} id={'text-chat'} placeholder={currentChatStat === 'payRequest' ? 'متن درخواست' : 'بنویس'}
                              className={'w-full IranSansMedium bg-transparent h-auto leading-5'}
                              rows={1} name="Text1" onClick={() => {

                    }}></textarea>
                    {/*<input  id={'text-chat'} type="text" dir={'rtl'} placeholder={'بنویس'}*/}
                    {/*       className={'w-full IranSansMedium bg-transparent'}/>*/}
                </div>
                {/*<div className={'send-and-voice col-span-1 flex flex-row justify-center items-center  '}>*/}
                {/*    <div></div>*/}
                {/*    /!*<img src="/assets/svgs/emoji-happy.svg" alt="Unimun chat microphone svg"*!/*/}
                {/*    /!*     className={'w-5 h-5 mr-2'}/>*!/*/}
                {/*</div>*/}


            </div>


            <div id={'bottom-of-chat fixed bottom-0 '}></div>


        </div>

    );
};

export default ChatScreen;