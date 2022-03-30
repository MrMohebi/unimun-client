import React, {useEffect, useRef, useState} from 'react';
import Eye from "../../../../assets/svgCodes/Eye";
import {gql, useLazyQuery} from "@apollo/client";
import {IsLoggedIn} from "../../../../store/user";

import {useRouter} from "next/router";
import {currentAd} from "../../../../store/ads";
import {getAppealsQuery} from "../../../../queries/normal/appeals";
import NewAppealButton from "../NewAppealButton/NewAppealButton";
import ThousandTomans from '../../../../assets/svgs/thousandTomans.svg'


const Appeals = () => {
    const [getItems, {
        data,
        loading,
        error
    }] = useLazyQuery(gql`${getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen']).query}`);
    console.log(getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen']).query)
    const now = Math.floor(Date.now() / 1000);
    const router = useRouter();
    const [newAdHidden, setNewAdHidden] = useState(false);
    const lastScrollPosition = useRef(0);

    useEffect(() => {
        getItems()
    }, [])
    const onAdSectionScroll = (event: any) => {
        let scroll = event.currentTarget.scrollTop;

        if (scroll > lastScrollPosition.current) {
            setNewAdHidden(true);
        } else {
            setNewAdHidden(false);
        }
        lastScrollPosition.current = scroll;


    }

    const dateConverter = (timestamp: number) => {
        console.log(timestamp)
        return Math.floor((now - timestamp) / 3600) > 24 ? Math.floor((now - timestamp) / 8640) + ' روز پیش ' : Math.floor((now - timestamp) / 8640) + ' ساعت پیش '
        // return timestamp
    }
    const adOnClick = (ad: any) => {
        currentAd(ad)
        console.log(currentAd())
    }

    if (data)
        console.log(data)
    if (error) {
        console.log('error')
        return <h1>Error...</h1>
    } else
        return (
            <section onScroll={onAdSectionScroll}
                     className={'w-full h-full overflow-scroll items-center px-6 pb-20 pt-5'}>
                <NewAppealButton hidden={newAdHidden}/>
                {
                    loading ?
                        <span className={'IranSans text-textDarker'}>در حال بارگزاری...</span> :
                        null
                }
                {data  && data.appeals?
                    data.appeals.edges.map((ad: any, index: number) => {
                            let Ad = ad.node
                            return (
                                <div key={Ad.title + index} onClick={() => {
                                    adOnClick(Ad)
                                }}
                                     className={'item  w-full bg-white rounded-3xl  h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                                    <div className={'item-left w-1/2 h-full items-start flex flex-col justify-between'}>
                                        <div className={'flex-col flex text-right'}>
                                            <span className={'IranSansBold text-textBlack text-xl pt-1 whitespace-nowrap'}>{Ad.title}</span>
                                            <span
                                                className={'IranSans text-textDarker mt-2 text-sm'}>{Ad.details ? Ad.details : "بدون توضیح"}</span>
                                        </div>
                                        <div className={'IranSansMedium text-textBlack whitespace-nowrap text-xl flex flex-row items-center'}>
                                            <span className={'mx-1'}>از</span>
                                            <span className={'mx-1'}>{Ad.priceStart / 1000}</span>
                                            <span className={'mx-1'}>تا</span>
                                            <span className={'mx-1'}>{Ad.priceEnd / 1000}</span>
                                            <div dir={'ltr'} className={'w-10 h-10'}>
                                                <ThousandTomans/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'item-right w-1/2 h-full items-end justify-between flex flex-col'}>
                                        <div>
                                            <div className={'w-10 h-10'}>
                                                {/*_________Note_________*/}
                                                {/*{Note}*/}
                                            </div>
                                        </div>
                                        <div>
                                            <div className={'w-auto h-16'}>
                                                {/*Instantaneous*/}

                                                {/*{Instantaneous}*/}
                                            </div>
                                        </div>
                                        <div
                                            className={' flex flex-row-reverse items-center justify-center whitespace-nowrap text-sm'}>
                                        <span dir={'rtl'}
                                              className={' IranSans'}>{dateConverter(Ad.createdAt)}</span>

                                            <div className={'h-4 border-primary  sm:block border mx-2'}/>
                                            <div className={'flex flex-row  items-center justify-center'}>
                                                <span className={'IranSans ml-1'}>{Ad.seen ?? 0}</span>

                                                <div className={'h-4 w-4 ml-1'}>
                                                    {Eye}
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            )
                        }
                    )
                    : null
                }

            </section>
        );
};

export default Appeals;
