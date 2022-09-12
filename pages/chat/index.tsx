import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Tab from "../../components/view/Tab/Tab";
import {passedTime} from "../../helpers/passedTime";
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import {clientChat} from "../../apollo-client"
import {UserId, UserToken} from "../../store/user";
import Login from "../profile/login";
import CircularProgressBar from "../../components/view/CircularProgressBar/CircularProgressBar";
import {InfinitySpin, TailSpin} from "react-loader-spinner";
import {UnimunID} from "../../store/GLOBAL_VARIABLES";
import {CurrentChatUserData} from "../../store/chat";


const Index = () => {

    const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
    const [render, setRender] = useState(false);
    const [chats, setChats] = useState([]);
    const [chatsArrived, setChatsArrived] = useState(false);

    const router = useRouter();

    const chatsQuery = gql`
        query{
            chats{
                id
                isPrivate
                members{
                    id
                    bio
                    name
                    profiles
                }
                lastMessage{
                    sentAt
                    userID
                    text
                    request{
                        creatorID
                    }
                }
            }
        }
    `

    const [getChats, getChatsResult] = useLazyQuery(chatsQuery, {client: clientChat})

    useEffect(() => {
        if (!UserToken() || !UserId()) {
            router.push('/')
            setRender(true)
        } else {
            getChats().then((value) => {
                console.log(value)
                try {
                    setChats(value.data.chats)
                    setChatsArrived(true)
                } catch (e) {

                }
            })
        }

    }, []);

    function chatOnCLick(id: string) {
        router.push(`/chat/${id}`)
    }

    return (
        <div className={'h-full w-full '}>
            <Header noShadow={true} title={'چت ها'} backOnClick={() => {
                router.push('/')
            }} back={true} blurBackground={true}/>

            <div className={'px-10 bg-white shadow IranSansMedium text-md'}>
                <div className={'w-full IranSans h-12 pt-4  bg-white z-50 -mt-2 '}>
                    <Tab indicatorSizeDivider={3} activeIndex={currentActiveIndex} indicatorAtBottom={true}>
                        <div onClick={item => setCurrentActiveIndex(0)}
                             className={`ease-in-out ${currentActiveIndex === 0 ? "text-primary" : ""} transition-all `}>فعال
                        </div>
                        <div onClick={item => setCurrentActiveIndex(1)}
                             className={`ease-in-out ${currentActiveIndex === 1 ? "text-primary" : ""} transition-all `}>غیر
                            فعال
                        </div>
                        <div onClick={item => setCurrentActiveIndex(2)}
                             className={`ease-in-out ${currentActiveIndex === 2 ? "text-primary" : ""} transition-all `}>درخواست
                            ها
                        </div>

                    </Tab>
                </div>
            </div>


            <div className={'h-full overflow-scroll '}>

                {
                    !chats.length && !chatsArrived ?
                        <div className={'w-full flex flex-col justify-center items-center'}>
                            <TailSpin width={50} color={'rgba(12,170,255,0.85)'}/>

                        </div>
                        :
                        null

                }

                {chats.map((chat: {
                    id: string
                    members: any
                    lastMessage: {
                        text: string
                        sentAt: number
                    }

                }, index) => {
                    console.log(chat)

                    if (chat.id !== UnimunID())
                        return (

                            <div key={index}>

                                <Button rippleColor={"rgba(0,0,0,0.14)"} id={'chat-item' + index}
                                        className={'w-full  overflow-y-scroll flex flex-col justify-start items-center px-3 pt-1'}
                                        onClick={() => {
                                            CurrentChatUserData(chat)
                                            chatOnCLick((chat as any).id as string)

                                        }}>
                                    <div
                                        className={'w-full  grid grid-cols-[4.5rem,auto,auto,auto,auto,auto] grid-rows-1 h-20'}>
                                        <div
                                            className={'col-span-1 h-20 w-20 row-span-1 flex flex-row justify-start items-center'}>
                                            <div
                                                className={'col-span-1 h-16 w-16 border-2 border-textDark row-span-1 rounded-2xl object-cover flex flex-col justify-center items-center'}>
                                            <span
                                                className={'IranSansMedium text-2xl pt-2 text-textDark'}> {chat.members[1].name[0]} </span>
                                            </div>
                                            {/*<img src={""} alt={"chat unimun"}*/}
                                            {/*     className={'col-span-1 h-16 w-16 row-span-1 rounded-2xl object-cover'}/>*/}
                                        </div>
                                        <div
                                            className={'col-span-5 border-b-2 flex flex-col justify-start items-start pt-3 mr-3'}>
                                            <div id={'name'} className={'flex flex-row justify-start items-center'}>
                                                <span
                                                    className={"IranSansMedium text-black"}>{chat.members[1].name}</span>
                                            </div>
                                            <div id={'status'}
                                                 className={'flex flex-row justify-between items-center mt-2 w-full'}>
                                                <div
                                                    className={"IranSansMedium text-textDarker text-[0.7rem]  flex flex-row justify-start items-center"}>
                                                    <div className={'h-1 w-1 bg-primary rounded-full '}></div>
                                                    <span className={'mr-2'}>{chat.lastMessage.text}</span>
                                                </div>

                                                <span
                                                    className={'text-textDark IranSansMedium text-[0.7rem]'}>{passedTime(chat.lastMessage.sentAt)}</span>
                                            </div>

                                        </div>
                                    </div>
                                </Button>
                            </div>

                        )
                    else {
                        return (

                            <Button onClick={() => {
                                CurrentChatUserData(chat)
                                chatOnCLick((chat as any).id as string)
                            }} rippleColor={"rgba(0,0,0,0.14)"} id={'chat-item-notifications'}
                                    className={'w-full  overflow-y-scroll flex flex-col justify-start items-center px-3 pt-1'}>
                                <div
                                    className={'w-full  grid grid-cols-[4.5rem,auto,auto,auto,auto,auto] grid-rows-1 h-20'}>
                                    <div
                                        className={'col-span-1 h-20 w-20 row-span-1 flex flex-row justify-start items-center'}>
                                        <img src={'/assets/svgs/chat-notifs.svg'} alt={"chat unimun"}
                                             className={'col-span-1 h-16 w-16 row-span-1 rounded-2xl'}/>
                                    </div>
                                    <div
                                        className={'col-span-5 border-b-2 flex flex-col justify-start items-start pt-3 mr-3'}>
                                        <div id={'name'} className={'flex flex-row justify-start items-center'}>
                                            <span className={"IranSansMedium text-black"}>یونیمون</span>
                                        </div>
                                        <div id={'status'}
                                             className={'flex flex-row justify-between items-center mt-2 w-full'}>
                                            <div
                                                className={"IranSansMedium text-textDarker text-[0.7rem]  flex flex-row justify-start items-center"}>
                                                <div className={'h-1 w-1 bg-primary rounded-full '}></div>
                                                <span className={'mr-2'}> متن پیام آخر سین نشده</span>
                                            </div>

                                            <span
                                                className={'text-textDark IranSansMedium text-[0.7rem]'}>{passedTime(25252525)}</span>
                                        </div>

                                    </div>
                                </div>
                            </Button>
                        )
                    }
                })}


            </div>


        </div>
    );

};

export default Index;