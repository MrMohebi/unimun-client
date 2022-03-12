import React, {useEffect} from 'react';
import Eye from "../../../../assets/svgCodes/Eye";
import Note from "../../../../assets/svgCodes/Note";
import Instantaneous from "../../../../assets/svgCodes/Instantaneous";
import {gql, useLazyQuery} from "@apollo/client";


const Ads = () => {
    const [getAdds, {data, loading, error}] = useLazyQuery(gql`query {
        ads{
            edges{
                node{
                   title
                }
            }
            pageInfo{
                currentPage
            }
        }
    }`)
    const now = Math.floor(Date.now() / 1000)

    useEffect(() => {
        getAdds()
    }, [])

    const dateConverter = (timestamp: number) => {
        return Math.floor((now - timestamp) / 3600) > 23 ? ((now - timestamp) / 3600 * 24) : 0
    }

    if (data)
        console.log(data.ads.edges)
    return (
        <section className={'w-full flex flex-col items-center px-3 pt-5 h-full'}>

            {
                loading ?
                    <span className={'IranSans text-textDarker'}>در حال بارگزاری...</span> :
                    null
            }
            {data ?
                data.ads.edges.map((ad: any) => {
                        let Ad = ad.node
                        return (
                            <div key={Math.random()}
                                 className={'ad w-full bg-white rounded-2xl shadow h-40 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>
                                <div className={'ad-left w-1/2 h-full items-start justify-between flex flex-col'}>
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
                                    <div className={' flex flex-row items-center justify-center whitespace-nowrap text-sm'}>
                                        <span dir={'rtl'}
                                              className={' IranSans'}> {dateConverter(Ad.createdAt00)} ساعت پیش   </span>

                                        <div className={'h-4 border-primary  sm:block border mx-2'}/>
                                        <div className={'flex flex-row  items-center justify-center'}>
                                            <div className={'h-4 w-4'}>
                                                {Eye}
                                            </div>
                                            <span className={'IranSans ml-1'}>{"25"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={'ad-right w-1/2 h-full items-end flex flex-col justify-between'}>
                                    <div className={'flex-col flex text-right'}>
                                        <span className={'IranSansBold text-textBlack text-xl pt-1'}>{Ad.title}</span>
                                        <span
                                            className={'IranSans text-textDarker mt-2 text-sm'}>{Ad.details ? Ad.details : "بدون توضیح"}</span>
                                    </div>
                                    <div className={'IranSansMedium text-textBlack whitespace-nowrap text-sm'}>
                                        <span className={'mx-1'}>از</span>
                                        <span className={'mx-1'}>{Ad.priceStart / 1000}</span>
                                        <span className={'mx-1'}>تا</span>
                                        <span className={'mx-1'}>{Ad.priceEnd / 1000}</span>
                                        <span className={'mx-1'}>هزار تومان</span>
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
