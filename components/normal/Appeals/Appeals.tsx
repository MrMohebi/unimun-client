import React, {UIEvent, useEffect, useRef, useState} from 'react';
import Eye from "../../../assets/svgCodes/Eye";
import {gql, useLazyQuery, useQuery, useReactiveVar} from "@apollo/client";
import {
    cameFromAppeal,
    lastAppealSubmitSuccess,
    AppealsStore,
    EndCursor,
    LastAppealsScrollPosition
} from "../../../store/appeals";
import {getAppealsQuery} from "../../../Requests/normal/appeals";
import NewAppealButton from "../NewAppealButton/NewAppealButton";
import ThousandTomans from '../../../assets/svgs/thousandTomans.svg';
import CheckCircle from '../../../assets/svgs/check-circle.svg';
import Search from "../Search/Search";
import _ from 'lodash';
import SkeletonElement from "../../view/Skeleton/Skeleton";
import {passedTime} from "../../../helpers/passedTime";
import {ToastContainer} from "react-toastify";
import {Slide} from 'react-toastify';
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import Toast from "../Toast/Toast";
import {useRouter} from "next/router";
import {useDebouncedCallback} from "use-debounce";

import Guide from "../Guide/Guide";


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
    const lastScrollPosition = useRef(0);
    const scrollerRef = useRef(null);
    const [seenTick, _seenTick] = useState(0);
    const visibleAppealsList = useRef([] as any);
    const [refreshLoading, _refreshLoading] = useState(false)
    const [endCursor, setEndCursor] = useState('');
    const dragPos = useRef({top: 0, left: 0, x: 0, y: 0});
    const router = useRouter();
    const AppealsQuery = getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen', 'id', 'hashtags', 'status'])


    const _getAppealsQuery = gql`
        query getAppeals($after:String){
            appeals(after: $after first:10){
                pageInfo {
                    endCursor
                    hasNextPage
                }
                edges {
                    node {
                        title
                        createdAt
                        publishedAt
                        details
                        priceStart
                        priceEnd
                        seen
                        id
                        hashtags
                        status
                    }
                }
            }
        }
    `
    // const [gtAppeals, appealsResult] = useLazyQuery(_getAppealsQuery)

    const gtAppeals = useQuery(_getAppealsQuery)

    // useEffect(() => {
    //     gtAppeals().then((value) => {
    //         console.log(value)
    //
    //     })
    // }, [])

    const reactiveAppeals = useReactiveVar(AppealsStore)

    useEffect(() => {
        if (lastAppealSubmitSuccess().length) {
            //todo change test
            Toast('آگهی شما ثبت شد و  در انتظار بررسی است', 'test', null, <div className={'w-7 h-7 shrink-0 pt-1'}>
                <CheckCircle/></div>)
            lastAppealSubmitSuccess('')
        }
    }, [])

    // check if element is in viewport
    const isInViewport = (el: any) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    const firstCatch = useRef(true);
    useEffect(() => {


        if (AppealsStore().length > 0 && firstCatch.current) {

        } else {
            if (gtAppeals.data) {
                try {

                    if (gtAppeals.data && gtAppeals.data.hasOwnProperty('appeals') && gtAppeals.data.appeals.hasOwnProperty('edges')) {

                        let apls = reactiveAppeals.concat(gtAppeals.data.appeals.edges)
                        EndCursor(gtAppeals.data.appeals.pageInfo.endCursor)
                        setAppeals(apls)
                        AppealsStore(apls)
                        reachedEnd.current = true;
                        setReachedEndState(true)

                        if (!gtAppeals.data.appeals.pageInfo.hasNextPage)
                            ShasMore(false)
                    }

                } catch (e) {

                }
            }
        }

        firstCatch.current = false;
    }, [gtAppeals.data]);


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
        // setReachedEndState(false)


        gtAppeals.refetch({after: EndCursor(),}).then((value) => {

        })
        // appealsResult.refetch({
        //     after: endCursor
        // }).then((e) => {
        //     if (e.data.appeals === null) {
        //     } else {
        //         if (e.error === undefined) {
        //
        //             if (e.data && e.data.hasOwnProperty('appeals') && e.data.appeals.hasOwnProperty('edges')) {
        //                 if (!e.data.appeals.pageInfo.hasNextPage)
        //                     ShasMore(false)
        //
        //
        //                 let apls = appeals.concat(e.data.appeals.edges)
        //                 setEndCursor(e.data.appeals.pageInfo.endCursor)
        //                 setAppeals(apls)
        //                 lastGottenAppeals(apls)
        //                 reachedEnd.current = true;
        //                 setReachedEndState(true)
        //
        //
        //             }
        //         } else {
        //         }
        //
        //     }
        //
        //
        // })
        // if (!loading && appeals.length > 19) {
        //     if (lastCursor != appeals[appeals.length - 1]['cursor']) {
        //         lastCursor.current = (appeals[appeals.length - 1]['cursor'])
        //
        //
        //         getAppeals({variables: {after: lastCursor.current}}).then((e) => {
        //             checkLastCursor(e)
        //             if (e.data) {
        //                 if (e.data.appeals.edges.length < 19) {
        //                     ShasMore(false)
        //                 }
        //             }
        //             console.log(e)
        //         })
        //     }
        // }
    }

    const onAdSectionScroll = (event: any) => {
        try {
            let scroll = event.target.scrollTop

            if (scroll > lastScrollPosition.current) {
                setScrollingToBottom(true)
            } else {
                setScrollingToBottom(false)

            }
            lastScrollPosition.current = scroll;
        } catch (e) {
            console.log(e)
        }
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

    const appealUI = (Appeal: any, index: number, key: string, id: string, hashtags?: any) => {
        return (
            <div key={key} onClick={() => {
                cameFromAppeal(true);
                router.push(`/appeals/appeal/${Appeal.id}`)

            }}>

                <div id={id} key={Appeal.title + index}
                     className={'item w-full bg-white rounded-2xl h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                    <div className={'item-left w-1/2 h-full items-start flex flex-col justify-between'}>


                        <div className={'flex-col flex text-right'}>
                            <span
                                className={'IranSansBold text-textBlack text-l pt-1 whitespace-nowrap'}>{Appeal.title}
                            </span>
                            <div
                                className={'IranSansMedium text-textDarker mt-2 text-sm appeal-details'}>{Appeal.details ? Appeal.details : "بدون توضیح"}
                            </div>

                        </div>
                        <div
                            className={'IranSansMedium text-textBlack whitespace-nowrap   flex flex-row items-end'}
                            style={{fontSize: '1.07rem'}}>
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

                            <div
                                className={'h-4 w-0 overflow-hidden border-primary bg-primary  sm:block border mx-2'}/>
                            <div className={'flex flex-row  items-center justify-center'}>
                                <span className={'IranSans ml-1'}>{Appeal.seen ?? 0}</span>

                                <div className={'h-4 w-4 ml-1'}>
                                    {Eye}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        )
    }


    let searchDebouncedFunction = useDebouncedCallback((e) => {
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
    }, 600)

    function onAppealScrollerScroll(event: UIEvent<HTMLDivElement>) {
        LastAppealsScrollPosition(event.currentTarget.scrollTop)
    }

    useEffect(() => {
        if (scrollerRef.current)
            (scrollerRef.current as HTMLDivElement).scrollTo(0, LastAppealsScrollPosition())
    }, []);

    return (
        <div className={'h-full relative overflow-scroll '} onScroll={onAdSectionScroll}>
            <ToastContainer transition={Slide}/>


            <Search searchLoading={searchLoading} collapse={scrollingToBottom}
                    onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.currentTarget.value.replace(/ /g, '') === '') {
                            setSearchedAppeals([])
                        }

                        setSearchLoading(true)
                        searchDebouncedFunction(e)
                    }}/>
            <NewAppealButton hidden={scrollingToBottom}/>
            <div className={'h-full overflow-scroll pb-32 pt-32'} ref={scrollerRef} id={'scrollable'}
                 onScroll={onAppealScrollerScroll}>
                {nothingFound ?
                    <div className={'w-full flex flex-col items-center justify-center mt-44'}>
                        <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>
                    </div> :
                    <InfiniteScroll
                        pullDownToRefresh={!refreshLoading}
                        releaseToRefreshContent={<div
                            className={'h-12 pb-4  w-full text-center IranSansMedium text-sm flex flex-col items-center justify-center'}>

                            رها کنید
                        </div>}
                        pullDownToRefreshContent={<div
                            className={'h-12 pb-4  w-full text-center IranSansMedium text-sm flex flex-col items-center justify-center'}>
                            بکشید
                        </div>}
                        pullDownToRefreshThreshold={60}
                        refreshFunction={() => {

                            _refreshLoading(() => {
                                return true
                            })

                            firstCatch.current = true;
                            gtAppeals.refetch().then((value) => {

                                // let tempAppeals = reactiveAppeals
                                // tempAppeals.reverse()
                                // tempAppeals.concat(_.difference(value.data.appeals.edges, reactiveAppeals))
                                // tempAppeals.reverse()
                                AppealsStore(value.data.appeals.edges)
                                _refreshLoading(false)


                            })
                            // gtAppeals().then((e) => {
                            //     _refreshLoading(() => {
                            //         return false
                            //     })
                            //     if (e.data.appeals === null) {
                            //
                            //     } else {
                            //         if (e.error === undefined) {
                            //
                            //             _refreshLoading(() => {
                            //                 return false
                            //             })
                            //
                            //             if (e.data && e.data.hasOwnProperty('appeals') && e.data.appeals.hasOwnProperty('edges')) {
                            //
                            //                 let apls = appeals.concat(e.data.appeals.edges)
                            //                 setEndCursor(e.data.appeals.pageInfo.endCursor)
                            //                 setAppeals(e.data.appeals.edges)
                            //                 lastGottenAppeals(e.data.appeals.edges)
                            //                 reachedEnd.current = true;
                            //                 setReachedEndState(true)
                            //             }
                            //         } else {
                            //         }
                            //
                            //     }
                            //
                            //
                            // })


                        }}
                        onScroll={onAdSectionScroll}
                        next={getNewerAppeals}
                        hasMore={hasMore}
                        dataLength={appeals.length}
                        loader={
                            appealsSkeleton(1)
                        }
                        scrollableTarget={'scrollable'}
                        className={'px-3'}>

                        {

                            <div
                                className={`${(refreshLoading || gtAppeals.loading) ? 'pt-3  h-8' : 'h-0 overflow-hidden '}  duration-100 eas-in-out w-full text-center IranSansMedium text-sm flex flex-row items-center justify-center `}>
                                دریافت آگهی ها
                                <LoadingDialog wrapperClassName={'w-4 h-4 mr-2'} strokeWidth={4}/>
                            </div>
                        }

                        {searchedAppeals.length ?
                            searchedAppeals.map((ad: any, index: number) => {
                                console.log('this is searched')
                                let Appeal = ad.node
                                if (Appeal.status !== "DELETED")
                                    return (appealUI(Appeal, index, index + 'i', Appeal.id))
                            })
                            :
                            reactiveAppeals.map((ad: any, index: number) => {
                                let Appeal = ad.node
                                if (Appeal.status && Appeal.status !== "DELETED")
                                    return (appealUI(Appeal, index, index + 'i', Appeal.id))
                            })
                        }

                        {
                        }
                        {/*{*/}
                        {/*    gtAppeals.data ?*/}
                        {/*        gtAppeals.data.appeals.edges.map((ad: any, index: number) => {*/}
                        {/*            let Appeal = ad.node*/}
                        {/*            if (Appeal.status && Appeal.status !== "DELETED")*/}
                        {/*                return (appealUI(Appeal, index, index + 'i', Appeal.id))*/}
                        {/*        })*/}
                        {/*        :*/}
                        {/*        <div></div>*/}
                        {/*}*/}
                        {/*{*/}
                        {/*    searchedAppeals.length ?*/}
                        {/*        searchedAppeals.map((ad: any, index: number) => {*/}
                        {/*                let Appeal = ad.node*/}
                        {/*                if (Appeal.status && Appeal.status !== "DELETED")*/}
                        {/*                    return (appealUI(Appeal, index, index + 'i', Appeal.id))*/}
                        {/*            }*/}
                        {/*        )*/}
                        {/*        :*/}
                        {/*        appeals.length && !nothingFound ?*/}
                        {/*            appeals.map((ad: any, index: number) => {*/}


                        {/*                    let Appeal = ad.node*/}
                        {/*                    if (Appeal.status && Appeal.status !== "DELETED")*/}
                        {/*                        return (appealUI(Appeal, index, index + 'i1', Appeal.id))*/}
                        {/*                }*/}
                        {/*            )*/}
                        {/*            : lastGottenAppealsState ?*/}
                        {/*                lastGottenAppealsState.map((ad: any, index: number) => {*/}
                        {/*                        let Appeal = ad.node*/}
                        {/*                        if (Appeal.status && Appeal.status !== "DELETED")*/}
                        {/*                            return (appealUI(Appeal, index, index + 'i2', Appeal.id))*/}
                        {/*                    }*/}
                        {/*                ) : null*/}

                        {/*}*/}
                        {/*{*/}
                        {/*    loading && !appeals.length ?*/}
                        {/*        appealsSkeleton(5)*/}
                        {/*        : null*/}
                        {/*}*/}
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
