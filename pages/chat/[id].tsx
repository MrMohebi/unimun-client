import React, {useEffect, useRef, useState} from 'react';
import Back from '../../assets/svgs/back.svg'
import Button from "../../components/view/Button/Button";
import {gql, useLazyQuery, useMutation, useSubscription} from "@apollo/client";
import {CurrentChatUserData} from "../../store/chat";
import {useRouter} from "next/router";
import produce from 'immer'
import {clientChat} from "../../apollo-client";
import moment from "jalali-moment";
import {UserId} from "../../store/user";
import {DOWNLOAD_HOST} from "../../store/GLOBAL_VARIABLES";
import FullScreenLoading from "../../components/normal/FullScreenLoading/FullScreenLoading";
import BottomSheet from "../../components/view/BottomSheet/BottomSheet";
import Input from "../../components/view/Input/Input";
import Toast from "../../components/normal/Toast/Toast";
import {ToastContainer} from "react-toastify";
import LoadingDialog from "../../components/view/LoadingDialog/LoadingDialog";
import dynamic from "next/dynamic";


const DynamicMap = dynamic(() => {
    return import('../../components/normal/LocationBottomSheet/LocationBottomSheet')
}, {
    ssr: false
})
const MapMessage = dynamic(() => {
    return import('../../components/view/MapMessage/MapMessage')
}, {
    ssr: false
})


// const Map = dynamic(
//     () => import('./MapMessage'), // replace '@components/map' with your component's location
//     {ssr: false} // This line is important. It's what prevents server-side render
// )


// const DynamicMessageMap = dynamic(() => import("../chat/MapMessage"), { ssr:false })


const ChatScreen = () => {


    const lastMessageGroupDate = useRef('')
    const chatBoxRef = useRef<HTMLDivElement>(null)
    const router = useRouter();
    const id = router.query.id
    const chatScrollerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState([] as any);
    const [currentChatStat, setCurrentChatStat] = useState('default');
    const [payRequestOpen, setPayRequestOpen] = useState(false);
    const [payRequestPrice, setPayRequestPrice] = useState(0);
    const [holdingShift, setHoldingShift] = useState(false);
    const [payRequestLoading, setPayRequestLoading] = useState(false);
    const [loadingButtonIds, setLoadingButtonIds] = useState([""]);
    const [scrollToBottomBtn, setScrollToBottomBtn] = useState(false);
    const getMessagesLimit = useRef(1000);
    const [userData, setUserData] = useState({});

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

    useEffect(() => {


        setUserData(CurrentChatUserData())
    }, []);


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

    const GET_CHAT_QUERY = gql`
        query($chatID:ID!) {
            __typename
            chat(id: $chatID) {
                title
                profiles {
                    thumbnail
                }
            }
        }

    `

    const [getChat] = useLazyQuery(GET_CHAT_QUERY, {client: clientChat})

    useEffect(() => {
        getChat({
            variables: {
                chatID: id,
            }
        }).then((result) => {
        })
    }, []);


    const [sendMoneyRequest] = useMutation(CREATE_REQUEST_MUTATION, {client: clientChat})
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
                tempId
                chatID
                editedAt
                location {
                    text
                    lat
                    lon
                }
                inlineKeyboard {
                    text
                    action
                    data
                    url
                }
            }
        }`

    const chatsSubscription = useSubscription(chatsSubscriptionRequest, {client: clientChat})

    useEffect(() => {
        if (chatsSubscription.data) {
            if (chatsSubscription.data.newMessage.chatID === id)
                setMessages(
                    produce((draft) => {
                        (draft as [any]).push(chatsSubscription.data.newMessage)
                        return draft
                    })
                );
            if (chatScrollerRef.current) {
                chatScrollerRef.current.scrollTo(0, chatScrollerRef.current.scrollHeight)

            }
            setTimeout(() => {
                scrollToBottom()

            }, 300)
        }
    }, [chatsSubscription.data]);

    const EDIT_PRICE_MUTATION = gql`
        mutation ($price: Int,$tempId:String $id: ID!, $description: String,$isAccepted:Boolean,$isCanceled:Boolean) {
            editMessage(
                payRequest: {price: $price, description: $description, isCanceled: $isCanceled, isAccepted: $isAccepted}
                id: $id,
                tempId:$tempId
            ) {
                id
                tempId
                payRequest {
                    status
                    description
                    price
                }
            }
        }


    `
    const [editPrice] = useMutation(EDIT_PRICE_MUTATION, {
        client: clientChat, onError: () => {
            Toast("موجودی کافی نمیباشد", '', 3000, '', 70)
            removeAllBtnLoadings()
        }
    })

    const EDIT_MESSAGE_SUBSCRIPTION = gql`

        subscription {
            editedMessage {
                chatID
                text
                id
                tempId
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
                try {
                    messages.forEach((item: any, index: number) => {
                        if (editMessagesSubscription.data.editedMessage.id === item.id || editMessagesSubscription.data.editedMessage.tempId === item.tempId) {
                            try {
                                setMessages(produce((draft: any) => {
                                    draft[index] = editMessagesSubscription.data.editedMessage
                                    return draft;
                                }))
                            } catch (e) {
                            }
                        }
                    })
                } catch (e) {

                }


            }, [editMessagesSubscription.data]
        )
        ;


        const chatMessagesQuery = gql`
            query($chatID:ID!){
                chatMessages(chatID: $chatID, limit: ${getMessagesLimit.current}){
                    userID
                    text
                    type
                    sentAt
                    tempId
                    inlineKeyboard {
                        action
                        data
                        text
                        url
                    }
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
                    location {
                        text
                        lat
                        lon
                    }
                    id
                    chatID
                    editedAt
                }
            }
        `
        const [chatMessages] = useLazyQuery(chatMessagesQuery, {client: clientChat})

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
    const [newMessage] = useMutation(newMessageMutation, {client: clientChat})
    const locationMessageMutation = gql`
        mutation($chatID:ID! $lat:String! $lon:String! $text:String) {
            sendMessage(chatID: $chatID location: {lat: $lat, lon: $lon, text: $text}){
                text
                sentAt
                id
                location {
                    lat
                    lon
                    text
                }
            }
        }
    `
    const [locationMessage] = useMutation(locationMessageMutation, {client: clientChat})
    const sendMessageBtn = useRef<HTMLImageElement>(null);


    const [chatLoading, setChatLoading] = useState(true);
    const [currentEditPayRequestData, setCurrentEditPayRequestData] = useState({
        price: "",
        description: "",
        id: '',
        tempId: ''
    });
    const scrollToBottom = () => {

        if (chatScrollerRef.current) {
            chatScrollerRef.current.scrollTo(0, chatScrollerRef.current.scrollHeight)

        }
        // if (chatBoxRef && chatBoxRef.current && chatScrollerRef && chatScrollerRef.current) {
        //     chatBoxRef.current.scrollTo({
        //         top: chatScrollerRef.current.getBoundingClientRect().height,
        //         behavior: 'auto'
        //     })
        // }
    }

    const removeAllBtnLoadings = () => {
        setLoadingButtonIds([])
    }
    const removeLoadingButton = (item: any) => {
        setLoadingButtonIds(produce((draft) => {
            draft.filter((id) => {
                return id !== item.id;
            })
        }))
    }


    const locationMessageValues = useRef({
        lat: '',
        lon: '',
        text: ''
    });
    const [showMap, setShowMap] = useState(false);
    // let myIcon = L.icon({
    //     iconUrl: '/marker.png',
    //     iconSize: [55, 55],
    //     iconAnchor: [32, 55],
    //     popupAnchor: [-3, -76],
    //     // shadowUrl: 'my-icon-shadow.png',
    //     shadowSize: [68, 95],
    //     shadowAnchor: [22, 94]
    // });


    return (
        <div ref={chatBoxRef} className={'w-full h-full overflow-scroll  pb-12 scroll-smooth'}>


            {showMap ?
                <DynamicMap onSubmit={() => {

                    setChatLoading(true)
                    setShowMap(false)

                    if (locationMessageValues.current.text && locationMessageValues.current.lat && locationMessageValues.current.lon) {
                        locationMessage({
                            variables: {
                                chatID: id,
                                text: locationMessageValues.current.text,
                                lat: locationMessageValues.current.lat.toString(),
                                lon: locationMessageValues.current.lon.toString(),
                            }
                        }).then((value) => {
                            setChatLoading(false)

                        })
                    } else {
                        Toast("لطفا فیلد آدرس را پر کنید", '', 2000, '', 50)

                    }


                }} onLatChanged={(value: string) => {
                    locationMessageValues.current.lat = value;
                }} onLngChanged={(value: string) => {
                    locationMessageValues.current.lon = value;
                }} onTextChanged={(value: string) => {
                    locationMessageValues.current.text = value;
                }} onClose={() => {

                    setShowMap(false)

                }}></DynamicMap>
                :
                null
            }


            <img src="/assets/svgs/chat-back.svg"
                 className={'w-full h-full fixed top-0 left-0 pointer-events-none opacity-20 object-cover'} alt=""/>

            {/*<Badge color={'#ff1a1a'}>*/}
            <div className={'fixed bottom-16 z-50 right-3  flex flex-row justify-center items-center'}>
                {/*<Badge className={`${scrollToBottomBtn && currentChatStat !== 'more' ? "opacity-100" : "opacity-0"}`}*/}
                {/*       color={`#1aafff`}>*/}
                <img
                    onClick={() => {
                        if (chatScrollerRef.current) {
                            chatScrollerRef.current.scrollTo(0, chatScrollerRef.current.scrollHeight)

                        }
                    }}
                    src="/assets/svgs/scroll-to-bottom.svg"
                    className={` transition-all drop-shadow ${scrollToBottomBtn && currentChatStat !== 'more' ? "opacity-100 " : 'opacity-0 pointer-events-none'}`}
                    alt=""/>
                {/*</Badge>*/}

            </div>

            {/*</Badge>*/}

            <ToastContainer/>

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
                            if (el.value.replaceAll(',', '') > 999999)
                                el.value = el.value.substring(0, el.value.length - 1)
                            el.value = el.value.split('').reverse().join('').replace(/,/g, '').replace(/(\d{3}(?!$))/g, "$1,").split('').reverse().join('').replace(/[^\d,]/g, '')
                            setPayRequestPrice(parseInt(el.value.replaceAll(',', '')))

                        }} id={'pay-req-input'} dir={'ltr'} numOnly={false}
                               inputClassName={'pl-12 text-black IranSansMedium'}
                               wrapperClassName={"w-11/12 h-12 m-auto "}/>

                    </div>
                    <div className={'w-full bg-background mt-3'}>
                        <span className={'IranSansMedium text-[0.7rem] py-2 block pr-4 text-textDarker'}>سقف مبلغ قابل درخواست یک میلیون تومان میباشد</span>
                    </div>

                    <div className={'h-20'}></div>
                </div>

                </BottomSheet>


                <FullScreenLoading dim={false} show={chatLoading}/>
                {
                    currentChatStat === 'more' ?
                        <div id={'test-pay'}
                             className={' z-20   bottom-16 overflow-hidden bg-white rounded-xl right-4 shadow-md   fixed'}>
                            <Button onClick={() => {
                                setPayRequestOpen(true)
                                setCurrentChatStat('payRequest');
                            }} className={'w-full h-full flex flex-row justify-center px-3 py-3'}>
                                <img className={'invert'} src="/assets/svgs/moneys.svg" alt=""/>
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
                                     src={CurrentChatUserData().profiles ? DOWNLOAD_HOST() + CurrentChatUserData().profiles[0].thumbnail : "/assets/image/no-prof.png"}
                                     alt=""/>

                            </div>
                        }

                        <div className={'flex flex-col justify-center items-start mr-4'}>

                        <span className={'IranSansMedium'}>
                            {/*@ts-ignore*/}
                            {CurrentChatUserData().title ?? ""}</span>
                            <span
                                className={'IranSansMedium text-textDark text-[0.7rem]'}>{CurrentChatUserData().title === "یونیمون" ? "پشتیبانی" : 'آخرین بازدید اخیرا'}</span>
                        </div>
                    </div>
                </div>


            <div
                className={'chat-box z-10 w-full scroll-smooth  h-full overflow-scroll flex flex-col-reverse  pt-20 pb-2'}
                ref={chatScrollerRef}
                onScroll={(event) => {
                    if (Math.abs(event.currentTarget.scrollTop) > 100) {
                        setScrollToBottomBtn(true)
                    } else {
                        setScrollToBottomBtn(false)
                    }
                }}
            >


                <div className={' bottom-0 h-auto  z-10'}>
                    {
                        messages.map((item: any, index: number) => {

                            let sentByMe = item.userID === UserId()

                            let itemText = item.text;
                            let toBeRenderedElements = [];
                            let textWithLink = <div key={index + 'keyOfLink'} className={'contents'}>
                                <a target={'_blank'} rel={'noreferrer'} className={'text-primary underline '}
                                   href="http://google.co">this is a text with
                                    link</a>
                            </div>;

                            let hasInlineKeyboard = false;
                            if (item.inlineKeyboard && item.inlineKeyboard.length)
                                hasInlineKeyboard = true

                            let inlineKeyboard = null;

                            if (!lastMessageGroupDate) {
                                (lastMessageGroupDate as any).current = moment(item.sentAt * 1000).format('jDD/jMM');
                            } else {
                                if (lastMessageGroupDate.current !== moment(item.sentAt * 1000).format('jDD/jMM')) {
                                    lastMessageGroupDate.current = moment(item.sentAt * 1000).format('jDD/jMM');

                                    try {

                                        toBeRenderedElements.push(
                                            <div
                                                className={'w-full h-12 text-sm flex flex-col justify-center items-center IranSansMedium '}>
                                                <div
                                                    className={'bg-glassButtonColor text-white px-4 py-1 rounded-2xl'}>{


                                                    moment(messages[index + 1].sentAt * 1000).format('jYYYY/jMM/jDD') === moment().format('jYYYY/jMM/jDD') ?
                                                        "امروز" :
                                                        moment(messages[index + 1].sentAt * 1000).format('jYYYY/jMM/jDD')


                                                }
                                                </div>
                                            </div>
                                        )

                                    } catch (e) {

                                    }

                                }
                            }

                            let unix_timestamp = item.sentAt
                            let date = new Date(unix_timestamp * 1000);
                            let hours = date.getHours();
                            let minutes = "0" + date.getMinutes();
                            let formattedTime = hours + ':' + minutes.substr(-2)

                            if (hasInlineKeyboard)
                                inlineKeyboard =
                                    <div
                                        className={`w-full flex flex-row ${sentByMe ? "justify-start" : 'justify-end'}`}>
                                        <div style={{}}
                                             className={'w-full flex flex-col h-auto justify-between items-center max-w-[80%] '}>
                                            {hasInlineKeyboard ?
                                                item.inlineKeyboard.map((inlineButton: any, index: number) => {


                                                    return <div key={'inline-' + index + Math.random() * 999}
                                                                className={'w-full h-auto'}>
                                                        <Button loading={loadingButtonIds.includes(item.id)}
                                                                onClick={() => {
                                                                    // setLoadingButtonIds(produce((draft) => {
                                                                    //     draft.push(item.id)
                                                                    // }))
                                                                    //
                                                                    // try {
                                                                    //
                                                                    //
                                                                    //     editPrice({
                                                                    //         variables: {
                                                                    //             isAccepted: true,
                                                                    //             id: item.id ?? "",
                                                                    //             tempId: item.tempId ?? ""
                                                                    //         }
                                                                    //     }).then((value) => {
                                                                    //         removeLoadingButton(item)
                                                                    //     })
                                                                    //
                                                                    //
                                                                    // } catch (e) {
                                                                    //     console.log('failde to change the price or desc')
                                                                    // }



                                                                    if (inlineButton.action === "CHOOSE_ADDRESS") {
                                                                        setShowMap(true)
                                                                        return;
                                                                    }
                                                                    newMessage({
                                                                        variables: {
                                                                            chatID: id,
                                                                            text: inlineButton.text
                                                                        }
                                                                    }).then(() => {
                                                                    });
                                                                }} id={'pay-btn'}
                                                                className={'bg-glassButtonColor mt-2 w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl'}>
                                                                <span
                                                                    className={'IranSansMedium '}>{inlineButton.text}</span>
                                                        </Button>
                                                    </div>
                                                })
                                                :
                                                null
                                            }
                                        </div>
                                    </div>


                            if (itemText)
                                try {


                                    let textSplit = itemText.split(' ');

                                    textWithLink = <div className={'contents'}>
                                        {
                                            (textSplit as [string]).map((phrase) => {
                                                if (phrase) {
                                                    if (phrase.includes('http://') || phrase.includes('https://')) {
                                                        return <a target={'_blank'} rel={'noreferrer'}
                                                                  className={'text-linkColor underline text-left '}
                                                                  href={phrase}>{phrase}</a>
                                                    } else {
                                                        return <span
                                                            className={'inline-block mx-[1px] text-right'}>{phrase}</span>
                                                    }

                                                }

                                            })
                                        }

                                    </div>

                                    (textSplit as [string]).forEach((word) => {
                                        if (word.includes('http://') || word.includes('https://')) {
                                            itemText = itemText.replace(word,)
                                        }
                                    })


                                } catch (e) {

                                }


                            // if (index === messages.length - 3)

                            if (item.type === "LOCATION") {
                                return toBeRenderedElements.concat(
                                    <div key={'chat-bubble-' + index}
                                         className={` w-full h-auto flex flex-col items-start shrink-0 py-1 px-3 ${sentByMe ? "justify-start" : "justify-end"} `}>
                                        {/*<div style={{*/}
                                        {/*    // animationDelay: index * 50 + 'ms'*/}
                                        {/*}}*/}
                                        {/*     className={` ${hasInlineKeyboard ? 'w-full' : ''}  flex IranSansMedium px-3 pt-2 pb-1 flex-col text-sm shrink-0 justify-start items-start ${sentByMe ? "bg-primary" : "bg-white ml-0 mr-auto"} text-white rounded-xl max-w-[80%]   `}>*/}
                                        {/*    <p style={{*/}
                                        {/*        wordBreak: 'break-word',*/}
                                        {/*        whiteSpace: 'pre-line'*/}
                                        {/*    }}*/}
                                        {/*       className={` ${!sentByMe ? "text-textBlack" : "text-white"} `}>*/}

                                        {/*        /!*<a href="/route">this is a test route</a>*!/*/}
                                        {/*        {textWithLink}*/}
                                        {/*    </p>*/}
                                        {/*    <div className={'flex mt-1 flex-row justify-start items-center '}>*/}
                                        {/*        <img src="/assets/svgs/check.svg"*/}
                                        {/*             className={`w-2  h-2 ${sentByMe ? '' : "invert-[0.5]"}`}*/}
                                        {/*             alt=""/>*/}
                                        {/*        <span*/}
                                        {/*            className={`IranSansMedium text-[0.75rem] mr-2 ${!sentByMe ? "text-textDark" : "white"}`}>{formattedTime}</span>*/}
                                        {/*    </div>*/}

                                        {/*</div>*/}
                                        {/*<DynamicMessageMap item={item}/>*/}

                                        {/*<Map/>*/}
                                        {/*<NoSSR>*/}
                                        {/*    <MapMessage item={item}/>*/}
                                        {/*</NoSSR>*/}
                                        <MapMessage item={item}/>

                                        {inlineKeyboard}

                                    </div>
                                )
                            }
                            if (item.type === 'TEXT')
                                return toBeRenderedElements.concat(
                                    <div key={'chat-bubble-' + index}
                                         className={` w-full h-auto flex flex-col items-start shrink-0 py-1 px-3 ${sentByMe ? "justify-start" : "justify-end"} `}>
                                        <div style={{
                                            // animationDelay: index * 50 + 'ms'
                                        }}
                                             className={` ${hasInlineKeyboard ? 'w-full' : ''}  flex IranSansMedium px-3 pt-2 pb-1 flex-col text-sm shrink-0 justify-start items-start ${sentByMe ? "bg-primary" : "bg-white ml-0 mr-auto"} text-white rounded-xl max-w-[80%]   `}>
                                            <p style={{
                                                wordBreak: 'break-word',
                                                whiteSpace: 'normal'
                                            }}
                                               className={` ${!sentByMe ? "text-textBlack" : "text-white"} `}>

                                                {/*<a href="/route">this is a test route</a>*/}
                                                {textWithLink}
                                            </p>
                                            <div className={'flex mt-1 flex-row justify-start items-center '}>
                                                <img src="/assets/svgs/check.svg"
                                                     className={`w-2  h-2 ${sentByMe ? '' : "invert-[0.5]"}`}
                                                     alt=""/>
                                                <span
                                                    className={`IranSansMedium text-[0.75rem] mr-2 ${!sentByMe ? "text-textDark" : "white"}`}>{formattedTime}</span>
                                            </div>

                                        </div>
                                        {inlineKeyboard}

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


                                return toBeRenderedElements.concat(<div
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
                                                        className={'ml-1 text-lg'}>{(item.payRequest.price / 1000).toLocaleString()}</span>
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
                                                        className={`IranSansMedium text-[0.75rem] mr-2 ${sentByMe ? "text-white" : "text-textDarker"}`}>{formattedTime}</span>
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
                                                        payRequest.status === "ACCEPTED" ?
                                                            <Button id={'pay-btn'}
                                                                    className={'bg-textDark shadow  w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl mt-1.5'}>
                                                                    <span
                                                                        className={'IranSansMedium '}>پرداخت شده</span>
                                                            </Button>
                                                            :

                                                            <div
                                                                className={'flex flex-row justify-between items-center w-full  mt-1.5'}>
                                                                <Button loading={loadingButtonIds.includes(item.id)}
                                                                        id={'pay-btn'} onClick={() => {
                                                                    let idObject = {id: '', tempId: ''} as any
                                                                    if (item.id)
                                                                        idObject.id = item.id
                                                                    else if (item.tempId)
                                                                        idObject.tempId = item.tempId

                                                                    setLoadingButtonIds(produce((draft) => {
                                                                        draft.push(item.id)
                                                                    }))
                                                                    editPrice({
                                                                        variables: {
                                                                            ...idObject,
                                                                            tempId: item.tempId,
                                                                            isCanceled: true
                                                                        }
                                                                    }).then(() => {
                                                                        removeLoadingButton(item)
                                                                    })

                                                                }}
                                                                        className={'bg-glassButtonColor  w-[49%] flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl'}>
                                                                    <span className={'IranSansMedium '}>لغو</span>
                                                                </Button>
                                                                <Button id={'pay-btn'} onClick={() => {
                                                                    try {
                                                                        setCurrentEditPayRequestData(produce((draft) => {
                                                                            draft.description = item.payRequest.description;
                                                                            draft.price = item.payRequest.price;
                                                                            if (item.id)
                                                                                draft.id = item.id
                                                                            else if (item.tempId)
                                                                                draft.tempId = item.tempId
                                                                            return draft
                                                                        }))
                                                                        setPayRequestOpen(true)
                                                                        setCurrentChatStat('payRequest')

                                                                    } catch (e) {
                                                                        console.log('failde to change the price or desc')
                                                                    }

                                                                }}
                                                                        className={'bg-glassButtonColor  w-[49%] flex flex-row justify-center items-center h-11 text-sm text-white rounded-xl'}>
                                                                    <span className={'IranSansMedium '}>ویرایش </span>
                                                                </Button>
                                                            </div>
                                                    :
                                                    payRequest.status === "ACCEPTED" ?
                                                        <Button id={'pay-btn'}
                                                                className={'bg-textDark shadow  w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl mt-1.5'}>
                                                            <span className={'IranSansMedium '}>پرداخت شده</span>
                                                        </Button>

                                                        :

                                                        payRequest.status === "CANCELED" ?
                                                            <Button id={'pay-btn'}
                                                                    className={'bg-textDark shadow  w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl mt-1.5'}>
                                                                <span className={'IranSansMedium '}>لغو شده</span>
                                                            </Button>
                                                            :
                                                            payRequest.status === "ACCEPTED" ?
                                                                <Button id={'pay-btn'}
                                                                        className={'bg-textDark shadow  w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl mt-1.5'}>
                                                                    <span
                                                                        className={'IranSansMedium '}>پرداخت شده</span>
                                                                </Button>
                                                                :


                                                                <Button loading={loadingButtonIds.includes(item.id)}
                                                                        onClick={() => {
                                                                            setLoadingButtonIds(produce((draft) => {
                                                                                draft.push(item.id)
                                                                            }))

                                                                            try {


                                                                                editPrice({
                                                                                    variables: {
                                                                                        isAccepted: true,
                                                                                        id: item.id ?? "",
                                                                                        tempId: item.tempId ?? ""
                                                                                    }
                                                                                }).then(() => {
                                                                                    removeLoadingButton(item)
                                                                                })


                                                                            } catch (e) {
                                                                                console.log('failde to change the price or desc')
                                                                            }
                                                                        }} id={'pay-btn'}
                                                                        className={'bg-glassButtonColor  w-full flex flex-row justify-center items-center  h-11 text-sm text-white rounded-xl'}>
                                                                    <span className={'IranSansMedium '}>پرداخت</span>
                                                                </Button>
                                            }

                                    </div>
                                </div>)
                            }
                        })
                    }
                </div>


            </div>

            <div style={{
                boxShadow: "0px -1px 9px 0px #0000000f"
            }}
                 className={`bottom-0 fixed left-0 w-full bg-white  z-[60]  border grid grid-cols-12 h-14 px-3 ${showMap ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className={'send-and-voice col-span-1 flex flex-row justify-start items-center'}>


                    {
                        currentChatStat === 'write' ?
                            <img alt={'Send Message'} src={'/assets/svgs/send.svg'}
                                 className={'text-primary IranSansMedium text-sm h-6 w-6 animate__animated'}
                                 onClick={() => {
                                     let messageText = (document.getElementById('text-chat') as HTMLInputElement)!.value


                                     newMessage({
                                         variables: {
                                             chatID: id,
                                             text: messageText
                                         }
                                     }).then(() => {
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

                                            payRequestLoading ?
                                                <div className={'w-6 h-6'}>
                                                    <LoadingDialog wrapperClassName={'w-6 h-6 '} color={'#1da1f2'}/>
                                                </div>
                                                :

                                                <img alt={'Send Pay Request'} src={'/assets/svgs/send.svg'}
                                                     className={'text-primary IranSansMedium text-sm h-6 w-6  animate__animated '}
                                                     onClick={() => {
                                                         let messageText = (document.getElementById('text-chat') as HTMLInputElement)!.value

                                                         setPayRequestLoading(true)
                                                         let idObject = {
                                                             id: '',
                                                             tempId: ''
                                                         } as any
                                                         if (currentEditPayRequestData.id)
                                                             idObject['id'] = currentEditPayRequestData.id
                                                         else if (currentEditPayRequestData.tempId) {
                                                             idObject['tempId'] = currentEditPayRequestData.tempId
                                                         }

                                                         if (currentEditPayRequestData.price) {
                                                             let requestParamsObject = {
                                                                 price: payRequestPrice,
                                                                 description: messageText,
                                                             }
                                                             editPrice({
                                                                 variables: {
                                                                     ...idObject,
                                                                     ...requestParamsObject
                                                                 }
                                                             }).then(() => {
                                                                 setPayRequestOpen(false)
                                                                 setPayRequestLoading(false)
                                                             });
                                                             setCurrentEditPayRequestData(produce((draft) => {
                                                                 draft.id = "";
                                                                 draft.description = "";
                                                                 draft.tempId = '0'

                                                             }))
                                                         } else {
                                                             sendMoneyRequest({
                                                                 variables: {
                                                                     acceptorID: CurrentChatUserData().user.id,
                                                                     chatID: id,
                                                                     price: payRequestPrice,
                                                                     description: messageText

                                                                 },

                                                             }).then(() => {
                                                                 setPayRequestOpen(false)
                                                                 setPayRequestLoading(false)
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
                <div className={`send-and-voice col-span-11 flex flex-row justify-start items-center mr-2 pr-2 `}>
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
                        const style = getComputedStyle(event.currentTarget);
                        let lht = parseInt(style.lineHeight, 10)

                        if (currentChatStat !== "payRequest")
                            if (event.currentTarget.value) {
                                setCurrentChatStat('write')
                            } else {
                                setCurrentChatStat('default')
                            }


                    }} id={'text-chat'} placeholder={currentChatStat === 'payRequest' ? 'متن درخواست' : 'بنویس'}
                              className={`w-full IranSansMedium bg-transparent h-auto leading-5 `}
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
    }
;

export default ChatScreen;