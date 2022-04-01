import React, {useEffect, useRef, useState} from 'react';
import Eye from "../../../../assets/svgCodes/Eye";
import {gql, useLazyQuery} from "@apollo/client";
import {IsLoggedIn} from "../../../../store/user";

import {useRouter} from "next/router";
import {currentAd} from "../../../../store/ads";
import {getAppealsQuery} from "../../../../queries/normal/appeals";
import NewAppealButton from "../NewAppealButton/NewAppealButton";
import ThousandTomans from '../../../../assets/svgs/thousandTomans.svg'
import {TailSpin} from "react-loader-spinner";
import Search from "../Search/Search";
import * as _ from 'lodash';

const Appeals = () => {

    const now = Math.floor(Date.now() / 1000);
    const router = useRouter();
    const [newAdHidden, setNewAdHidden] = useState(false);
    const [appeals, setAppeals] = useState([]);
    const [searchedAppeals, setSearchedAppeals] = useState([]);
    const searcheText = useRef('');
    const lastCursor = useRef('');
    const reachedEnd = useRef(false);
    const [reachedEndState, setReachedEndState] = useState(false);
    const [nothingFound, setNothingFound] = useState(false);
    const lastScrollPosition = useRef(0);
    const scrollEnd = useRef(false)


    const AppealsQuery = getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen'])
    const [getAppeals, {
        data,
        loading,
        error
    }] = useLazyQuery(gql`${AppealsQuery.query}`);

    useEffect(() => {
        if (!data && !loading) {
            getAppeals()
                .then((e) => {
                    if (e.error === undefined) {
                        setAppeals(e.data.appeals.edges)
                    } else {
                        console.log('we have error then')
                    }

                })
        }

        if (lastCursor) {

        }


    }, [appeals, data, loading, error, lastCursor])

    const getNewerAppeals = () => {
        if (!reachedEnd.current) {
            if (lastCursor != appeals[appeals.length - 1]['cursor']) {
                lastCursor.current = (appeals[appeals.length - 1]['cursor'])
                getAppeals({variables: {after: lastCursor.current}}).then((e) => {
                    if (e.data.appeals.edges[e.data.appeals.edges.length - 1]['cursor'] !== lastCursor.current) {
                        let updatedAppeals = appeals
                        updatedAppeals = updatedAppeals.concat(e.data.appeals.edges)
                        lastCursor.current = updatedAppeals[updatedAppeals.length - 1]['cursor']
                        setAppeals(updatedAppeals)
                    } else {
                        reachedEnd.current = true;
                        setReachedEndState(true)
                    }
                })
            }
        }


    }
    const onAdSectionScroll = (event: any) => {

        console.log(event.currentTarget.scrollTop)
        console.log(event.currentTarget.scrollHeight)

        if (event.currentTarget.scrollTop > event.currentTarget.scrollHeight - event.currentTarget.getBoundingClientRect().height - 10)
            getNewerAppeals()
        let scroll = event.currentTarget.scrollTop;

        if (scroll > lastScrollPosition.current) {
            setNewAdHidden(true);
        } else {
            setNewAdHidden(false);
        }
        lastScrollPosition.current = scroll;
    }
    const searchQuery = getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen'], 'test')
    const [searchAppeals, searchAppealsResult] = useLazyQuery(gql`${searchQuery.query}`);

    const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNothingFound(false)

        console.log(event.target.value)
        searcheText.current = event.target.value

        searchAppeals({variables: {searchText: searcheText.current}}).then((e) => {
            if (!e.error) {
                if (e.data.appeals.edges.length === 0)
                    setNothingFound(true)
                setSearchedAppeals(e.data.appeals.edges)
            }
        })

    }


    const dateConverter = (timestamp: number) => {
        return Math.floor((now - timestamp) / 3600) > 24 ? Math.floor((now - timestamp) / 8640) + ' روز پیش ' : Math.floor((now - timestamp) / 8640) + ' ساعت پیش '
    }
    const adOnClick = (ad: any) => {
        currentAd(ad)
        console.log(currentAd())
    }

    if (error) {
        console.log(error)
    }

    const appealUI = (Appeal: any, index: number) => {
        return (
            <div key={Appeal.title + index} onClick={() => {
                adOnClick(Appeal)
            }}
                 className={'item  w-full bg-white rounded-3xl  h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                <div className={'item-left w-1/2 h-full items-start flex flex-col justify-between'}>
                    <div className={'flex-col flex text-right'}>
                                            <span
                                                className={'IranSansBold text-textBlack text-xl pt-1 whitespace-nowrap'}>{Appeal.title}</span>
                        <span
                            className={'IranSans text-textDarker mt-2 text-sm'}>{Appeal.details ? Appeal.details : "بدون توضیح"}</span>
                    </div>
                    <div
                        className={'IranSansMedium text-textBlack whitespace-nowrap text-xl flex flex-row items-center'}>
                        <span className={'mx-1'}>از</span>
                        <span className={'mx-1'}>{Appeal.priceStart / 1000}</span>
                        <span className={'mx-1'}>تا</span>
                        <span className={'mx-1'}>{Appeal.priceEnd / 1000}</span>
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
                                              className={' IranSans'}>{dateConverter(Appeal.createdAt)}</span>

                        <div className={'h-4 border-primary  sm:block border mx-2'}/>
                        <div className={'flex flex-row  items-center justify-center'}>
                            <span className={'IranSans ml-1'}>{Appeal.seen ?? 0}</span>

                            <div className={'h-4 w-4 ml-1'}>
                                {Eye}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
    return (
        <div className={'h-full'}>
            <Search onInputChange={_.debounce((e:React.ChangeEvent<HTMLInputElement>) => {
                onSearchInputChange(e)
            }, 900)}/>
            <section onScroll={onAdSectionScroll}
                     className={'w-full h-full overflow-scroll items-center px-6 pb-20 pt-5'}>
                <NewAppealButton hidden={newAdHidden}/>
                {

                    searchedAppeals.length ?
                        searchedAppeals.map((ad: any, index: number) => {
                                let Appeal = ad.node
                                return (appealUI(Appeal, index)
                                )
                            }
                        )
                        :
                        appeals && !nothingFound ?
                            appeals.map((ad: any, index: number) => {
                                    let Appeal = ad.node
                                    return (appealUI(Appeal, index)
                                    )
                                }
                            )
                            : null
                }
                {!reachedEndState || loading ?
                    <div className={'w-full flex flex-col items-center justify-center mt-20'}>
                        <TailSpin color="black" height={30} width={30}/>
                    </div>
                    :
                    null
                }
                {
                    nothingFound ?
                        <div className={'w-full flex flex-col items-center justify-center mt-20'}>
                            <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>
                        </div> : null}
            </section>
        </div>

    );
};

export default Appeals;
