import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {passedTime} from "../../helpers/passedTime";
import ThousandTomans from "../../assets/svgs/thousandTomans.svg";
import Button from "../../components/view/Button/Button";
import FullScreenLoading from "../../components/normal/FullScreenLoading/FullScreenLoading";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingDialog from "../../components/view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";

const MyAppeals = () => {


    const getMyAppealsQuery = gql`
        query myAppeals ($first:Int $after:String){
            appealsUserCreated(after: $after,first:$first){
                edges {
                    cursor
                    node {
                        title
                        id
                        priceStart
                        priceEnd
                        categoryID
                        createdAt
                        status
                    }
                }
            }
        }
    `

    const updateAppealQuery = gql`
        mutation updateAppeal($id:ID! $status:String){
            updateAppeal(id:$id status:$status){
                data {
                    title
                }
                message
                status
            }
        }
    `

    const [getMyAppeals, getMyAppealsResult] = useLazyQuery(getMyAppealsQuery)
    const [updateAppeal, updateAppealResult] = useMutation(updateAppealQuery)
    const [appeals, setAppeals] = useState([] as any[]);
    const router = useRouter()

    useEffect(() => {

        getMyAppeals().then((value) => {
            console.log(value)
            try {
                setAppeals(value.data.appealsUserCreated.edges)
            } catch (e) {

            }
        })

    }, [])
    return (
        <div>

            <FullScreenLoading show={getMyAppealsResult.loading || updateAppealResult.loading}/>


            <Header back={true} backOnClick={() => {
                router.push('/profile')
            }}
                    title={'آگهی های من'}
            />


            <div
                className={'m-appeals-scroller w-full flex px-4 pt-5 pb-20 rounded-2xl flex-col justify-center items-center h-full overflow-scroll'}
                id={'m-scroller'}>

                <InfiniteScroll
                    pullDownToRefresh={true}
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

                        console.log('refreshing')
                        getMyAppealsResult.refetch().then((value) => {
                            console.log('gotten')
                            setAppeals(value.data.appealsUserCreated.edges)
                        })
                    }}
                    onScroll={() => {

                        console.log('scrolling')
                    }}
                    next={() => {
                        getMyAppealsResult.refetch({after: appeals.reverse()[0].cursor}).then((value) => {
                            setAppeals(value.data.appealsUserCreated.edges)
                        })
                    }}
                    hasMore={true}
                    dataLength={appeals.length}
                    loader={
                        <h1>Loading</h1>
                    }
                    scrollableTarget={'m-scroller'}
                    className={'w-full'}>
                    {

                        <div
                            className={`${(getMyAppealsResult.loading) ? 'pt-3' : 'h-0 overflow-hidden '}  duration-100 eas-in-out w-full text-center IranSansMedium text-sm h-8 flex flex-row items-center justify-center `}>
                            دریافت آگهی ها
                            <LoadingDialog wrapperClassName={'w-4 h-4 mr-2'} strokeWidth={4}/>
                        </div>
                    }

                    {
                        appeals.map((appeal, index) => {
                            let _appeal = appeal.node

                            return (
                                <div key={'appeal-m-' + index}
                                     className={'each-m-appeal flex flex-col justify-start items-center w-full bg-white pb-4 '}>
                                    <div
                                        className={'w-full IranSansBold text-lg p-3 flex flex-row justify-between items-center'}>
                                        <span>{_appeal.title ?? ""}</span>
                                        <div
                                            className={'h-8 rotate-90 pb-2 w-8 text-center flex flex-col-reverse justify-center items-center bg-background rounded-lg p-1  IranSansMedium text-md tracking-tighter font-black whitespace-nowrap px-2'}>
                                            ...
                                        </div>
                                    </div>

                                    <div className={'flex text-sm w-full flex-row justify-start px-3 items-center'}>
                                    <span
                                        className={`IranSansMedium ${_appeal.status === "DELETED" ? 'text-errorRed' : ''}`}
                                        style={{
                                            fontSize: '0.8rem'
                                        }}>{_appeal.status === "DELETED" ? "حذف شده" : "در حال بررسی"}</span>
                                        <div
                                            className={'m-appeal-divider mx-2 h-3 w-0  border bg-primary border-primary'}></div>
                                        <span className={'IranSansMedium text-textDarker'} style={{
                                            fontSize: '0.8rem'
                                        }}>{passedTime(_appeal.createdAt)}</span>

                                    </div>
                                    <div className={'w-full flex flex-row justify-between items-end pt-4  px-3'}>

                                        <Button
                                            id={'appeal-action-btn-' + index}
                                            rippleColor={'rgba(0,0,0,0.08)'}
                                            onClick={() => {
                                                updateAppeal({
                                                    variables: {id: _appeal.id, status: "DELETED"}
                                                }).then((value) => {
                                                    if (value.data.updateAppeal.status === 'SUCCESS')
                                                        console.log(value)
                                                })
                                            }}
                                            className={`${_appeal.status === "DELETED" ? "grayscale pointer-events-none" : ""}  text-errorRed text-center flex flex-col-reverse justify-center items-center bg-background rounded-lg p-1  IranSans text-md tracking-tighter font-black whitespace-nowrap px-3`}>
                                        <span className={'opacity-90 scale-90 '}>
                                                                                    لغو آگهی

                                        </span>
                                        </Button>
                                        <div
                                            className={'IranSansMedium h-8 text-textBlack whitespace-nowrap flex flex-row items-center w-auto'}
                                            style={{fontSize: '1.07rem'}}>
                                            <span className={'mx-0.5  flex flex-row items-end'}>از</span>
                                            <span
                                                className={'mx-0.5  flex flex-row items-end'}>{_appeal.priceStart / 1000}</span>
                                            <span className={'mx-0.5  flex flex-row items-end'}>تا</span>
                                            <span
                                                className={'mx-0.5  flex flex-row items-end'}>{_appeal.priceEnd / 1000}</span>
                                            <div dir={'ltr'}
                                                 className={'w-10 h-10 flex flex-row mb-1.5 items-center opacity-90 '}>
                                                <ThousandTomans/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </InfiniteScroll>


            </div>
        </div>
    );
};

export default MyAppeals;
