import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Tab from "../../components/view/Tab/Tab";
import {passedTime} from "../../helpers/passedTime";
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {ApolloClient, createHttpLink, gql, InMemoryCache, useLazyQuery} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {UserToken} from "../../store/user";


let uri = 'https://tttchat.unimun.me/graphql'
const httpLink = createHttpLink({
    uri: uri,
});


const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = UserToken()
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            "user-agent": "JS GraphQL",
            "content-type": 'application/json',
            ...headers,
            token: token ? `${token}` : "",
        }
    }
});


const cl = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
const Index = () => {

    const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
    const [activeChats, setActiveChats] = useState([
        {
            name: 'آرمین',
            profile: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Cameronavatar.jpg/1200px-Cameronavatar.jpg',
            lastMessageTimeStamp: 252555555,
            status: 'آخرین پیام دیده شده',
        },

        {
            name: 'Mohammad',
            profile: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZHaYvXKBwsed_8BhTy1PBDv1lLHTYAl3Wg&usqp=CAU',
            lastMessageTimeStamp: 252555555,
            status: 'آخرین پیام دیده شده',
        },

        {
            name: 'کیان',
            profile: 'https://assets.popbuzz.com/2021/03/danny-griffin-12-facts-about-the-fate-the-winx-saga-actor-you-need-to-know-1611246134-list-handheld-0.jpg',
            lastMessageTimeStamp: 252555555,
            status: 'آخرین پیام دیده شده',
        },

        {
            name: 'Mr Mokafela',
            profile: 'https://www.nikiwinterson.com/wp-content/uploads/2017/01/Screenshot-2021-01-18-at-17.00.14.png',
            lastMessageTimeStamp: 252555555,
            status: 'آخرین پیام دیده شده',
        },


    ]);
    const router = useRouter();

    const chatsQuery = gql`
        query{
            chats{
                id
                isPrivate
                profile
                memberIDs
                lastMessage{

                    userID
                    text
                    request{
                        creatorID
                    }
                }
            }
        }
    `

    const [getChats, getChatsResult] = useLazyQuery(chatsQuery, {client: cl})

    useEffect(() => {
        getChats().then((value) => {
            console.log(value)
        })
    }, []);

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

                <Button rippleColor={"rgba(0,0,0,0.14)"} id={'chat-item-notifications'}
                        className={'w-full  overflow-y-scroll flex flex-col justify-start items-center px-3 pt-1'}>
                    <div className={'w-full  grid grid-cols-[4.5rem,auto,auto,auto,auto,auto] grid-rows-1 h-20'}>
                        <div
                            className={'col-span-1 h-20 w-20 row-span-1 flex flex-row justify-start items-center'}>
                            <img src={'/assets/svgs/chat-notifs.svg'} alt={"chat unimun"}
                                 className={'col-span-1 h-16 w-16 row-span-1 rounded-2xl'}/>
                        </div>
                        <div
                            className={'col-span-5 border-b-2 flex flex-col justify-start items-start pt-3 mr-3'}>
                            <div id={'name'} className={'flex flex-row justify-start items-center'}>
                                <span className={"IranSansMedium text-black"}> اعلان ها</span>
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


                {
                    activeChats.map((item, index) => {
                        return (
                            <div key={index}>

                                <Button rippleColor={"rgba(0,0,0,0.14)"} id={'chat-item' + index}
                                        className={'w-full  overflow-y-scroll flex flex-col justify-start items-center px-3 pt-1'}>
                                    <div
                                        className={'w-full  grid grid-cols-[4.5rem,auto,auto,auto,auto,auto] grid-rows-1 h-20'}>
                                        <div
                                            className={'col-span-1 h-20 w-20 row-span-1 flex flex-row justify-start items-center'}>
                                            <img src={item.profile} alt={"chat unimun"}
                                                 className={'col-span-1 h-16 w-16 row-span-1 rounded-2xl object-cover'}/>
                                        </div>
                                        <div
                                            className={'col-span-5 border-b-2 flex flex-col justify-start items-start pt-3 mr-3'}>
                                            <div id={'name'} className={'flex flex-row justify-start items-center'}>
                                                <span className={"IranSansMedium text-black"}>{item.name}</span>
                                            </div>
                                            <div id={'status'}
                                                 className={'flex flex-row justify-between items-center mt-2 w-full'}>
                                                <div
                                                    className={"IranSansMedium text-textDarker text-[0.7rem]  flex flex-row justify-start items-center"}>
                                                    <div className={'h-1 w-1 bg-primary rounded-full '}></div>
                                                    <span className={'mr-2'}>{item.status}</span>
                                                </div>

                                                <span
                                                    className={'text-textDark IranSansMedium text-[0.7rem]'}>{passedTime(item.lastMessageTimeStamp)}</span>
                                            </div>

                                        </div>
                                    </div>
                                </Button>
                            </div>


                        )

                    })
                }


            </div>


        </div>
    );
};

export default Index;