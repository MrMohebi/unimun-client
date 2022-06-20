import React, {useEffect, useState} from 'react';
import Header from "../components/common/Header/Header";
import {passedTime} from "../helpers/passedTime";
import {useRouter} from "next/router";
import {UserToken} from "../store/user";
import {gql, useLazyQuery} from "@apollo/client";
import {NotificationsStore} from "../store/notifications";
import LoadingDialog from "../components/view/LoadingDialog/LoadingDialog";
import InfiniteScroll from 'react-infinite-scroll-component'

const Notifications = () => {
    const router = useRouter();
    const query = gql`
        query getNotifications($after:String,$first:Int) {
            notifications(after: $after first: $first){
                edges {
                    cursor
                    node {
                        type
                        id
                        created_at
                        appeal {
                            title
                            details
                        }
                        book {
                            title
                            details
                        }
                    }
                }
            }
        }
    `

    const [getNotifications, {loading, data, error, refetch}] = useLazyQuery(query, {variables: {after: "Mw=="}})
    const [notifications, sNotifications] = useState([]);
    const [scrollEnd, sScrollEnd] = useState(false);

    useEffect(() => {

        if (NotificationsStore().length) {
            sNotifications(NotificationsStore())
        }
        if (!UserToken()) {
            router.push('/profile/login')
        } else {
            getNotifications().then(e => {
                console.log(e)
                if (e.data)
                    try {
                        sNotifications(e.data.notifications.edges)
                        NotificationsStore(e.data.notifications.edges)
                    } catch (e) {
                        console.log('bad format')
                        router.push('/')
                    }

            })
        }

    }, [])


    let fetchNew = () => {

        let lastNotification = (notifications[notifications.length - 2]) as { cursor: string }


        let vars = {after: lastNotification.cursor, first: 5}
        refetch(vars).then(e => {
            if (e.data.notifications.edges.length < 5) {
                sScrollEnd(true)
            }
            sNotifications(notifications.concat(e.data.notifications.edges))
        })

    }
    return (


        <div className={'overflow-scroll h-full'}>
            <Header title={'اعلان ها'} back={true} backOnClick={() => {
                router.back()
            }}/>


            <div className={'h-full overflow-scroll pb-16 pt-2 '} id={'notif-scroller'}>


                <InfiniteScroll
                    className={'overflow-visible'}
                    scrollableTarget={'notif-scroller'}
                    dataLength={notifications.length}
                    next={fetchNew}
                    hasMore={!scrollEnd}
                    loader={<LoadingDialog wrapperClassName={'w-10 m-auto h-10'} color={'#1da1f2'}/>}
                >
                    {notifications.map((notification, index) => {

                        try {
                            let notificationLocal = notification as { node: any }
                            let node = notificationLocal.node as any

                            let myDateArr = node.created_at.toString().split(' ')[0].split('-')
                            let newDate = new Date(parseInt(myDateArr[0]), parseInt(myDateArr[1]) - 1, parseInt(myDateArr[2]));
                            let notificationPassedTime = passedTime(newDate.getTime() / 1000);
                            let notifType = node.type === 'connectBook' ? 'book' : 'appeal'


                            return (<div key={index + 'notifications'}
                                         className={'norif -mt-1 w-full overflow-hidden relative  flex flex-row justify-start items-start pl-3 pr-5  pb-6'}>
                                <div
                                    className={'h-full w-4 absolute right-1.5 top-0  flex flex-col justify-center items-center '}>
                                    <div className={'h-full w-1 rounded bg-primary '}/>
                                    <div
                                        className={'w-4 h-4 absolute rounded-2xl border border-4 border-background top-2 left-1/2 bg-primary -translate-x-1/2'}/>
                                </div>
                                <div className={'w-full flex flex-col justify-start items-center'}>
                                    <div className={'w-full flex flex-row justify-between pt-0.5 items-center '}>
                                        <span
                                            className={'IranSansMedium text-md pr-2 '}>{(node[notifType] as { title: string }).title}</span>
                                        <span
                                            className={'IranSans text-sm pr-2 text-sm text-primary'}>{notificationPassedTime}</span>
                                    </div>
                                    <p className={'px-3 pt-5 IranSansMedium text-sm text-right w-full'}>{node[notifType].details}</p>
                                </div>
                            </div>)
                        } catch (e) {
                            console.log(e)
                        }
                    })}
                </InfiniteScroll>
            </div>

            <div className={'h-5'}/>

            {/*<div className={'h-full w-1 rounded bg-textDark absolute right-3 top-24 '}/>*/}


            {/*{*/}
            {/*    // <div className={''}></div>*/}
            {/*    loading ?*/}
            {/*        <LoadingDialog*/}
            {/*            wrapperClassName={'h-20 w-20 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-auto z-index '}*/}
            {/*            color={'blue'}/>*/}
            {/*        : null*/}
            {/*}*/}

        </div>
    );
};

export default Notifications;