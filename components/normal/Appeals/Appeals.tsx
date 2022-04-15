import React, {useEffect, useRef, useState} from 'react';
import Eye from "../../../assets/svgCodes/Eye";
import {gql, useLazyQuery, useReactiveVar} from "@apollo/client";
import Link from 'next/link'
import {useRouter} from "next/router";
import {currentAd, lastAppealSubmitSuccess, lastGottenAppeals} from "../../../store/appeals";
import {getAppealsQuery} from "../../../Requests/normal/appeals";
import NewAppealButton from "../NewAppealButton/NewAppealButton";
import ThousandTomans from '../../../assets/svgs/thousandTomans.svg'
import {TailSpin} from "react-loader-spinner";
import Search from "../Search/Search";
import _ from 'lodash';
import SkeletonElement from "../../view/Skeleton/Skeleton";
import {passedTime} from "../../../helpers/passedTime";
import {toast, ToastContainer} from "react-toastify";


const Appeals = () => {
    const now = Math.floor(Date.now() / 1000);
    const [scrollingToBottom, setScrollingToBottom] = useState(false);
    const [appeals, setAppeals] = useState([]);
    const [searchedAppeals, setSearchedAppeals] = useState([]);
    const searcheText = useRef('');
    const lastCursor = useRef('');
    const reachedEnd = useRef(false);
    const [reachedEndState, setReachedEndState] = useState(false);
    const [nothingFound, setNothingFound] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const lastScrollPosition = useRef(0);


    const AppealsQuery = getAppealsQuery(['title', 'createdAt', 'details', 'priceStart', 'priceEnd', 'seen', 'id'])
    const [getAppeals, {
        data,
        loading,
        error
    }] = useLazyQuery(gql`${AppealsQuery.query}`);

    const lastGottenAppealsState = useReactiveVar(lastGottenAppeals)


    useEffect(() => {
        console.log(lastAppealSubmitSuccess())
        if (lastAppealSubmitSuccess().length) {
            toast.success('آگهی شا ثبت شد و  در انتظار بررسی است', {
                position: "bottom-center",
                autoClose: 5000,
                pauseOnHover: true,
                style: {
                    bottom: '10px'
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
        setReachedEndState(false)
        if (!reachedEnd.current && !loading) {
            if (lastCursor != appeals[appeals.length - 1]['cursor']) {
                lastCursor.current = (appeals[appeals.length - 1]['cursor'])
                getAppeals({variables: {after: lastCursor.current}}).then((e) => {
                    checkLastCursor(e)
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
    const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        _.debounce(() => {
            setNothingFound(false)

            searcheText.current = event.target.value
            searchAppeals({variables: {searchText: searcheText.current}}).then((e) => {
                if (!e.error) {
                    if (e.data.appeals.edges.length === 0)
                        setNothingFound(true)
                    setSearchedAppeals(e.data.appeals.edges)
                }
            })
        }, 900)

    }

    const dateConverter = (timestamp: number) => {
        return Math.floor((now - timestamp) / 3600) > 24 ? Math.floor((now - timestamp) / 8640) + ' روز پیش ' : Math.floor((now - timestamp) / 8640) + ' ساعت پیش '
    }
    const adOnClick = (ad: any) => {
        currentAd(ad)
    }


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
                            <span
                                style={{
                                    width: '200px',
                                    height: '40px',
                                    whiteSpace: 'break-spaces',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                // style={{height:'50px', display: 'block', overflow: 'hidden', wordWrap:'break-word', textOverflow:'ellipsis'}}

                                className={'IranSans text-textDarker mt-2 text-sm'}>{Appeal.details ? Appeal.details : "بدون توضیح"}</span>

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

    const debounceFunction = (input: any, timeout: number) => {
        return _.debounce((e = input) => {
            setNothingFound(false)
            searcheText.current = e.target.value
            searchAppeals({variables: {searchText: searcheText.current}}).then((e) => {
                if (!e.error) {
                    if (e.data.appeals.edges.length === 0)
                        setNothingFound(true)
                    setSearchedAppeals(e.data.appeals.edges)
                }
            })
        }, timeout)
    }


    let searchInput = (e: React.BaseSyntheticEvent) => {
        setNothingFound(false)
        searcheText.current = e.target.value
        searchAppeals({variables: {searchText: searcheText.current}}).then((e) => {
            if (!e.error) {
                if (e.data.appeals.edges.length === 0)
                    setNothingFound(true)
                setSearchedAppeals(e.data.appeals.edges)
            }
        })
    }
    let searchDeb = _.debounce(searchInput, 1000)
    return (
        <div className={'h-full overflow-hidden relative '}>
            <ToastContainer/>

            <Search searchLoading={searchLoading} collapse={scrollingToBottom}
                    onInputChange={(e) => {
                        setSearchLoading(true)
                        searchDeb(e)
                    }}/>
            <section onScroll={onAdSectionScroll}
                     className={'w-full h-full overflow-scroll items-center px-4  pt-32'}>
                <NewAppealButton hidden={scrollingToBottom}/>
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

                {
                    !reachedEndState ?
                        appealsSkeleton(1)
                        : null

                }
                <div className={'h-36'}></div>
                {
                    nothingFound ?
                        <div className={'w-full flex flex-col items-center justify-center mt-20'}>
                            <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>
                        </div> : null
                }
            </section>
        </div>

    );
};

export default Appeals;