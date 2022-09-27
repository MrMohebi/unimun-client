import React, {useEffect, useState} from 'react';
import Library from '../../assets/svgs/library.svg';
// @ts-ignore
import ImageCapture from "react-image-data-capture";
import {useRouter} from "next/router";
import {UserToken} from "../../store/user";
import dynamic from "next/dynamic";
import FullScreenLoading from "../../components/normal/FullScreenLoading/FullScreenLoading";

// @ts-ignore
const QrScan = dynamic(() => import('react-qr-reader'), {ssr: false})
const Scan = () => {
    const router = useRouter()
    const [loadingDialog, setLoadingDialog] = useState(false);

    useEffect(() => {


        setTimeout(() => {
            if (UserToken()) {

            } else {
                router.push('/profile/login')
            }


        }, 1)


    }, [])



    return (
        <div className={'h-full overflow-scroll '}>

            <FullScreenLoading show={loadingDialog}/>

            <div className={'w-full bg-transparent h-10 p-2'}>
                <img src="/assets/svgs/back.svg" onClick={() => {
                    router.push('/')
                }} className={'w-8 h-8 rotate-180'} alt=""/>
            </div>
            <img alt={'Library'} src={''} id={'dasf'}></img>
            <div className={'w-full pt-16  flex flex-col justify-center items-center  '}>
                <div className={'w-24'}>
                    <Library/>

                </div>

                <span className={'IranSans mt-10 '}> بارکـد کتاب را اسکن کنید</span>
                <p className={'text-center IranSans text-[0.75rem] block mt-3 text-textDark'}>کتاب که الان تو دستاته به
                    همین سادگی میتونه تو یونیمون به فروش برسه
                    <br/>
                    فقط کافیه اکسنش کنی
                </p>
                <div
                    className={'w-72 h-72 border-primary border-2 scan-container rounded-2xl overflow-hidden mt-5 white-scan '}>


                    <QrScan
                        // @ts-ignore
                        delay={(loadingDialog ? 2000 : 200) as any}
                        onError={(e: any) => {
                            console.log(e)
                        }}
                        onScan={(e: any) => {
                            if (e) {
                                if (e.toString().includes('qr.unimun')) {
                                    console.log(e)
                                    setLoadingDialog(true)
                                    router.push(e)
                                }


                            }

                        }}
                        style={{width: '100%'}}
                    />

                    {/*<QrScan*/}
                    {/*    delay={300}*/}
                    {/*    onError={(E:any)=>{*/}

                    {/*    }}*/}
                    {/*    onScan={()=>{*/}
                    {/*        console.log('scanned')*/}

                    {/*    }}*/}
                    {/*    style={{ height: 240, width: 320 }}*/}
                    {/*/>*/}


                </div>
                <img className={'w-24 mt-3 h-auto'} src="/assets/image/qr-sample.png" alt=""/>
                <span className={'IranSansMedium'}>یه همچین بارکـدی باید رو کتابت باشه
</span>
            </div>


        </div>
    );
};

export default Scan;