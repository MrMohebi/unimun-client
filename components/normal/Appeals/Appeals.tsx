import React, {useEffect, useRef, useState} from 'react';
import Eye from "../../../assets/svgCodes/Eye";
import {gql, useLazyQuery, useReactiveVar} from "@apollo/client";
import Link from 'next/link'
import {lastAppealSubmitSuccess, lastGottenAppeals} from "../../../store/appeals";
import {getAppealsQuery} from "../../../Requests/normal/appeals";
import NewAppealButton from "../NewAppealButton/NewAppealButton";
import ThousandTomans from '../../../assets/svgs/thousandTomans.svg'
import Search from "../Search/Search";
import _ from 'lodash';
import SkeletonElement from "../../view/Skeleton/Skeleton";
import {passedTime} from "../../../helpers/passedTime";
import {toast, ToastContainer} from "react-toastify";
import {cssTransition} from 'react-toastify';
import {Slide, Zoom, Flip, Bounce} from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";


const Appeals = () => {
    const [scrollingToBottom, setScrollingToBottom] = useState(false);
    const [appeals, setAppeals] = useState([]);
    const [searchedAppeals, setSearchedAppeals] = useState([]);
    const searcheText = useRef('');
    const lastCursor = useRef('');
    const reachedEnd = useRef(false);
    const [reachedEndState, setReachedEndState] = useState(false);
    const [nothingFound, setNothingFound] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasMore, ShasMore] = useState(true);
    const [ta, sta] = useState(["", '', '', ''] as string[]);
    const lastScrollPosition = useRef(0);


    const AppealsQuery = getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen', 'id'])
    const [getAppeals, {
        data,
        loading,
        error
    }] = useLazyQuery(gql`${AppealsQuery.query}`);

    const lastGottenAppealsState = useReactiveVar(lastGottenAppeals)


    useEffect(() => {
        if (lastAppealSubmitSuccess().length) {
            toast.info('آگهی شما ثبت شد و  در انتظار بررسی است', {
                position: "bottom-center",
                autoClose: 2000,
                pauseOnHover: true,
                closeButton: <div/>,
                style: {
                    bottom: '10px',
                    width: '95%',
                    borderRadius: ' 20px',
                    padding: '10px',
                    display: 'flex',
                    flexFlow: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 'auto'
                }
            });
            lastAppealSubmitSuccess('')
        }
    }, [])

    useEffect(() => {
        if (!data && !loading) {
            getAppeals()
                .then((e) => {
                    if (e.data.appeals === null) {

                    } else {
                        if (e.error === undefined) {
                            if (e.data && e.data.hasOwnProperty('appeals') && e.data.appeals.hasOwnProperty('edges')) {
                                setAppeals(e.data.appeals.edges)
                                lastGottenAppeals(e.data.appeals.edges)
                                reachedEnd.current = true;
                                setReachedEndState(true)
                            }
                        } else {
                        }

                    }


                })
        }


        if (lastCursor) {

        }


    }, [appeals, data, loading, error, lastCursor])

    const checkLastCursor = (res: any) => {
        if (res.data.appeals.edges[res.data.appeals.edges.length - 1]['cursor'] !== lastCursor.current) {
            let updatedAppeals = appeals
            updatedAppeals = updatedAppeals.concat(res.data.appeals.edges)
            lastCursor.current = updatedAppeals[updatedAppeals.length - 1]['cursor']
            setAppeals(updatedAppeals)
        } else {
            reachedEnd.current = true;
            setReachedEndState(true)
        }

    }
    const getNewerAppeals = () => {
        console.log(appeals)
        console.log('getting more')
        // setReachedEndState(false)
        if (!loading && appeals.length > 19) {
            if (lastCursor != appeals[appeals.length - 1]['cursor']) {
                lastCursor.current = (appeals[appeals.length - 1]['cursor'])
                getAppeals({variables: {after: lastCursor.current}}).then((e) => {
                    checkLastCursor(e)
                    if (e.data) {
                        if (e.data.appeals.edges.length < 19) {
                            ShasMore(false)
                        }
                    }
                    console.log(e)
                })
            }
        }
    }
    const onAdSectionScroll = (event: any) => {

        if (event.currentTarget.scrollTop > event.currentTarget.scrollHeight - event.currentTarget.getBoundingClientRect().height - 10)
            getNewerAppeals()
        let scroll = event.currentTarget.scrollTop;

        if (scroll > lastScrollPosition.current && scroll > 40) {
            setScrollingToBottom(true);
        } else {
            setScrollingToBottom(false);
        }
        lastScrollPosition.current = scroll;
    }
    const searchQuery = getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen'], 'test')
    const [searchAppeals, searchAppealsResult] = useLazyQuery(gql`${searchQuery.query}`);


    useEffect(() => {
        setSearchLoading(searchAppealsResult.loading)
    }, [searchAppealsResult.loading])

    const appealsSkeleton = (count: number) => {
        return (
            Array(count).fill('').map((skeleton, index) => {
                return (
                    <div key={index + 'appealSkeleton'}
                         className={'item w-full bg-white rounded-2xl h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                        <div className={'item-left w-1/2 h-full items-start flex flex-col justify-between'}>
                            <div className={'flex-col flex text-right'}>
                                            <span
                                                className={'IranSansBold text-textBlack text-lg pt-1 whitespace-nowrap'}><SkeletonElement
                                                className={'w-32 mt-2 h-8'}/></span>
                                <span
                                    className={'IranSans text-textDarker mt-2 text-sm'}> <SkeletonElement
                                    className={'w-32 mt-2 h-3'}/> <SkeletonElement
                                    className={'w-32 mt-2 h-3'}/>  </span>
                            </div>
                            <SkeletonElement className={'w-32 mt-2 h-5'}/>
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
                                <SkeletonElement className={'w-32 mt-2 h-5'}/></div>
                        </div>
                    </div>
                )
            })


        )
    }

    const appealUI = (Appeal: any, index: number, key: string) => {
        return (
            <Link key={key} passHref={true} href={`/appeal/${Appeal.id}`}>

                <div key={Appeal.title + index}
                     className={'item w-full bg-white rounded-2xl h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                    <div className={'item-left w-1/2 h-full items-start flex flex-col justify-between'}>
                        <div className={'flex-col flex text-right'}>
                                            <span
                                                className={'IranSansBold text-textBlack text-l pt-1 whitespace-nowrap'}>{Appeal.title}</span>
                            <div

                                // style={{height:'50px', display: 'block', overflow: 'hidden', wordWrap:'break-word', textOverflow:'ellipsis'}}

                                className={'IranSans text-textDarker mt-2 text-sm appeal-details'}>{Appeal.details ? Appeal.details : "بدون توضیح"}</div>

                        </div>
                        <div
                            className={'IranSansMedium text-textBlack whitespace-nowrap text-lg  flex flex-row items-end'}>
                            <span className={'mx-0.5  flex flex-row items-end'}>از</span>
                            <span className={'mx-0.5  flex flex-row items-end'}>{Appeal.priceStart / 1000}</span>
                            <span className={'mx-0.5  flex flex-row items-end'}>تا</span>
                            <span className={'mx-0.5  flex flex-row items-end'}>{Appeal.priceEnd / 1000}</span>
                            <div dir={'ltr'} className={'w-10 h-10 flex flex-row mb-1.5 items-end opacity-90 '}>
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
                            <div dir={'rtl'}
                                 className={' IranSans flex flex-row justify-center items-center'}>{passedTime(Appeal.createdAt)}</div>

                            <div className={'h-4 w-0 overflow-hidden border-primary bg-primary  sm:block border mx-2'}/>
                            <div className={'flex flex-row  items-center justify-center'}>
                                <span className={'IranSans ml-1'}>{Appeal.seen ?? 0}</span>

                                <div className={'h-4 w-4 ml-1'}>
                                    {Eye}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Link>

        )
    }


    let searchInput = (e: React.BaseSyntheticEvent) => {
        setNothingFound(false)
        searcheText.current = e.target.value
        if (searcheText.current.length)
            searchAppeals({variables: {searchText: searcheText.current}}).then((e) => {
                if (!e.error) {
                    if (e.data.appeals.edges.length === 0)
                        setNothingFound(true)
                    setSearchedAppeals(e.data.appeals.edges)
                }
            })
        else {
            setSearchLoading(false)
            setNothingFound(false)
        }
    }
    let searchDeb = _.debounce(searchInput, 1000)
    return (
        <div className={'h-full relative '}>
            <ToastContainer transition={Slide}/>

            <Search searchLoading={searchLoading} collapse={scrollingToBottom}
                    onInputChange={(e) => {
                        setSearchLoading(true)
                        searchDeb(e)
                    }}/>
            <div>
                <NewAppealButton hidden={scrollingToBottom}/>

                {nothingFound ?
                    <div className={'w-full flex flex-col items-center justify-center mt-44'}>
                        <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>
                    </div> :
                    <InfiniteScroll
                        next={getNewerAppeals}
                        hasMore={hasMore}
                        dataLength={appeals.length}
                        loader={
                            appealsSkeleton(1)
                        }
                        className={'h-full pt-32 pb-32'}>
                        {
                            searchedAppeals.length ?
                                searchedAppeals.map((ad: any, index: number) => {
                                        let Appeal = ad.node
                                        return (appealUI(Appeal, index, index + 'i')
                                        )
                                    }
                                )
                                :
                                appeals.length && !nothingFound ?
                                    appeals.map((ad: any, index: number) => {
                                            let Appeal = ad.node
                                            return (appealUI(Appeal, index, index + 'i1')
                                            )
                                        }
                                    )
                                    : lastGottenAppealsState ?
                                        lastGottenAppealsState.map((ad: any, index: number) => {
                                                let Appeal = ad.node
                                                return (appealUI(Appeal, index, index + 'i2')
                                                )
                                            }
                                        ) : null

                        }
                        {
                            loading && !appeals.length ?
                                appealsSkeleton(5)
                                : null
                        }

                    </InfiniteScroll>
                }
                {/*{*/}
                {/*    nothingFound ?*/}
                {/*        <div className={'w-full flex flex-col items-center justify-center mt-20'}>*/}
                {/*            <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>*/}
                {/*        </div> : null*/}
                {/*}*/}
            </div>

        </div>

    );
};

export default Appeals;
