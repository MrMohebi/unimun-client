import React, {useEffect} from 'react';
import Eye from "../../../../assets/svgCodes/Eye";
import Note from "../../../../assets/svgCodes/Note";
import Instantaneous from "../../../../assets/svgCodes/Instantaneous";
import {gql, useLazyQuery} from "@apollo/client";
import QueryBuilder from "../../../../QueryBuilder/QueryBuilder";
import {IsLoggedIn} from "../../../../store/user";
import Button from "../../../view/Button/Button";
import AddSvg from '../../../../assets/svgs/add.svg'
import {useRouter} from "next/router";



const Ads = () => {
    const [getAdds, {data, loading, error}] = useLazyQuery(gql`${QueryBuilder('query','getAds','ads',[{edges:[{node:['title','createdAt','details','priceStart','priceEnd']}]}])!.query}`)
    const now = Math.floor(Date.now() / 1000)

    const router = useRouter()

    useEffect(() => {
        getAdds()
    }, [])

    const dateConverter = (timestamp: number) => {
        return Math.floor((now - timestamp) / 3600) >24? Math.floor((now - timestamp) / 8640) + ' روز پیش ':Math.floor((now - timestamp) / 8640) + ' ساعت پیش '
        // return timestamp
    }

    return (
        <section className={'w-full flex flex-col items-center px-3 pb-20 pt-5 h-full'}>
            <div className={`fixed bottom-20 right-2`} onClick={()=>{
                if (IsLoggedIn()) {
                    router.push('/ads/newAd')

                } else {
                    router.push('/profile/login')

                }
            }}>
                <Button rippleColor={'rgba(0,0,0,0.26)'} className={' h-16 bg-white rounded-2xl shadow-lg flex flex-row justify-around items-center px-2 IranSansMedium'}>
                    <div className={'w-5 h-5 mx-2'}><AddSvg/></div>

                    <span>
                    افزودن آگهی
                </span>
                </Button>
            </div>



            {
                loading ?
                    <span className={'IranSans text-textDarker'}>در حال بارگزاری...</span> :
                    null
            }
            {data ?
                data.ads.edges.map((ad: any,index:number) => {
                        let Ad = ad.node
                        return (
                            <div key={Ad.title + index}
                                 className={'ad w-full bg-white rounded-2xl  h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                                <div className={'ad-left w-1/2 h-full items-start flex flex-col justify-between'}>
                                    <div className={'flex-col flex text-right'}>
                                        <span className={'IranSansBold text-textBlack text-xl pt-1'}>{Ad.title}</span>
                                        <span
                                            className={'IranSans text-textDarker mt-2 text-sm'}>{Ad.details ? Ad.details : "بدون توضیح"}</span>
                                    </div>
                                    <div className={'IranSansMedium text-textBlack whitespace-nowrap text-xl'}>
                                        <span className={'mx-1'}>از</span>
                                        <span className={'mx-1'}>{Ad.priceStart / 1000}</span>
                                        <span className={'mx-1'}>تا</span>
                                        <span className={'mx-1'}>{Ad.priceEnd / 1000}</span>
                                        <span className={'mx-1'}>هزار تومان</span>
                                    </div>
                                </div>

                                <div className={'ad-right w-1/2 h-full items-end justify-between flex flex-col'}>
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
                                    <div className={' flex flex-row-reverse items-center justify-center whitespace-nowrap text-sm'}>
                                        <span dir={'rtl'}
                                              className={' IranSans'}>{dateConverter(Ad.createdAt)}</span>

                                        <div className={'h-4 border-primary  sm:block border mx-2'}/>
                                        <div className={'flex flex-row  items-center justify-center'}>
                                            <div className={'h-4 w-4 ml-1'}>
                                                {Eye}
                                            </div>
                                            <span className={'IranSans ml-1'}>{"25"}</span>
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

export default Ads;
