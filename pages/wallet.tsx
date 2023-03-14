import React, {useEffect, useRef, useState} from 'react';
import lottie from "lottie-web";
import books from "../assets/animations/books.json";
import {currentNavActiveIndex} from "../store/navbar";
import Drawer from "../components/view/Drawer/Drawer";
import Button from "../components/view/Button/Button";
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
import FullScreenLoading from "../components/normal/FullScreenLoading/FullScreenLoading";
import {GET_SUPPORT_CHAT_QUERY, NEW_MESSAGE_MUTATION} from "../Requests/GlobalRequests/GlobalRequests";
import {CurrentChatUserData} from "../store/chat";
import {clientChat} from "../apollo-client";
import {useRouter} from "next/router";
import Input from "../components/view/Input/Input";
import BottomSheet from "../components/view/BottomSheet/BottomSheet";
import Toast from "../components/normal/Toast/Toast";
import {ToastContainer} from "react-toastify";
import {passedTime} from "../helpers/passedTime";
import HelpSvg from "../assets/svgs/help.svg";
import {UserToken} from "../store/user";
import {humanizeNumber} from "../helpers/humanizeNumber";

const Wallet = () => {


    const [drawerMaxHeight, setDrawerMaxHeight] = useState(400);
    const [drawerInitLimit, setDrawerInitLimit] = useState(0);
    const [balance, setBalance] = useState(0);
    const [blocked, setBlocked] = useState(0);
    const [walletID, setWalletID] = useState("");
    const [transactions, setTransactions] = useState([]);
    const divRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [bottomSheetBtnLoading, setBottomSheetBtnLoading] = useState(false);

    const lottieRef = useRef<HTMLDivElement>(null)

    const GET_WALLET_DATA_QUERY = gql`
        {
            __typename
            wallet {
                data {
                    id
                    balance
                    userID
                    blocked
                }
            }
        }
    `
    const CHARGE_WALLLET_QUERY = gql`
        mutation($amount:Int! ) {
            chargeWallet(amount: $amount) {
                data {
                    url
                }
                errors
                message
                status
            }
        }

    `
    const GET_TRANSACTIONS_QUERY = gql`
        {
            __typename
            transactions(first: 10) {
                edges {
                    node {
                        amountType
                        createdAt
                        type
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }


    `
    const getWalletDataResult = useQuery(GET_WALLET_DATA_QUERY)
    const getTransactions = useQuery(GET_TRANSACTIONS_QUERY)
    const [chargeWallet] = useMutation(CHARGE_WALLLET_QUERY)
    const [getSupportChat] = useLazyQuery(GET_SUPPORT_CHAT_QUERY, {client: clientChat})
    const [newMessage] = useMutation(NEW_MESSAGE_MUTATION, {client: clientChat})
    const [chargeWalletOpen, setChargeWalletOpen] = useState(false);
    const [chargeWalletAmount, setChargeWalletAmount] = useState(0);
    const router = useRouter()


    const [payRequestPrice, setPayRequestPrice] = useState(0);
    const [payRequestOpen, setPayRequestOpen] = useState(false);

    useEffect(() => {
        getWalletDataResult.refetch()
        getTransactions.refetch()
    }, []);

    useEffect(() => {

        if (!UserToken())
            router.push('/profile/login')
        if (lottieRef.current)
            lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                animationData: books,
                loop: true,
                autoplay: true
            })
        currentNavActiveIndex(3)


    }, [])

    useEffect(() => {
        if (getWalletDataResult.data) {
            if (!UserToken())
                router.push('/profile/login')
            else
                try {
                    setBalance(getWalletDataResult.data.wallet.data.balance)
                    setBlocked(getWalletDataResult.data.wallet.data.blocked)
                    setWalletID(getWalletDataResult.data.wallet.data.id)

                    setLoading(false)
                } catch (e) {
                    // alert('bad request')
                }
        }

    }, [getWalletDataResult]);
    useEffect(() => {

        if (getTransactions.data) {

            setTransactions(getTransactions.data.transactions.edges)

        }

    }, [getTransactions.data]);
    const [cardNumber, setCardNumber] = useState("");


    return (
        <div className={'h-full w-full'} onLoad={() => {
            try {
                if (divRef.current && containerRef.current) {
                    setDrawerInitLimit(divRef.current.getBoundingClientRect().bottom)
                    setDrawerMaxHeight((containerRef.current.getBoundingClientRect().height - divRef.current.getBoundingClientRect().bottom) + 50)

                }

            } catch (e) {

            }

        }} ref={containerRef}>
            <div className={'w-full px-4  flex flex-row justify-between'}>
                <div className={'IranSansBold text-[1rem] pt-4'}>
                    <span>یونیـ<span className={'text-primary -mr-1'}>جیب</span></span>
                </div>
                <div className={'h-6 w-6 opacity-0'} onClick={() => {
                    //help on click
                }}>
                    <HelpSvg/>
                </div>
            </div>
            <ToastContainer/>

            <FullScreenLoading whiteBack={true} show={loading}/>
            <BottomSheet open={payRequestOpen}
                         onClose={() => {
                             setPayRequestOpen(false)
                         }}>

                <div className={' w-full bg-transparent flex flex-col justify-start items-center pt-4 '}>

                    <span
                        className={'IranSansMedium text-black text-right w-full text-md  pr-4 text-textDarker block'}>درخواست برداشت وجه</span>
                    <div className={'relative w-full flex-col justify-center items-center mt-5'}>

                        <div
                            className={'absolute left-5  px-2 h-6 -mt-3  top-1/2 -translate-y-1/2 flex flex-col justify-center border-r-2 items-center'}>
                            <img src="/assets/svgs/toman.svg" className={'invert scale-90'} alt=""/>
                        </div>
                        <Input
                            onChange={(e: any) => {
                                let el = e.currentTarget
                                el.value = el.value.split('').reverse().join('').replace(/,/g, '').replace(/(\d{3}(?!$))/g, "$1,").split('').reverse().join('').replace(/[^\d,]/g, '')
                                console.log(parseInt(el.value.replaceAll(',', '')));
                                setPayRequestPrice(parseInt(el.value.replaceAll(',', '')))

                            }} id={'pay-req-input'} dir={'ltr'} numOnly={false}
                            inputClassName={'pl-12 text-black IranSansMedium'}
                            wrapperClassName={"w-11/12 h-12 m-auto "}/>
                        <span
                            className={`mr-4 IranSans text-sm text-textDark transition-all ${payRequestPrice ? "opacity-100" : "opacity-0"}`}>{"معادل " + humanizeNumber(payRequestPrice) + " تومان"}</span>

                    </div>
                    <div className={'w-full bg-background mt-3'}>
                        <span className={'IranSans text-[0.7rem] py-2 block pr-4 text-textDarker'}>
                            سقف قابل برداشت از حساب شما
                            <span className={'text-black mx-1 inline-block IranSansMedium'}>
                                {balance - (balance / 10) + " "}
                                تومان
                            </span>

                            میباشد
                        </span>
                    </div>
                    <span
                        className={'IranSansMedium text-black text-right w-full text-md  pr-4 text-textDarker block mt-3'}>شماره کارت</span>

                    <div className={'relative w-full flex-col justify-center items-center mt-5'}>

                        <Input pattern={'\d*'}
                               onChange={(e: any) => {

                                   setCardNumber(e.currentTarget.value)

                               }} id={'pay-req-input'} dir={'ltr'} numOnly={false}
                               inputClassName={'px-3 text-black IranSansMedium'}
                               wrapperClassName={"w-11/12 h-12 m-auto "}/>
                        <span
                            className={`mr-4 IranSans text-sm text-textDark transition-all ${payRequestPrice ? "opacity-100" : "opacity-0"}`}>{"معادل " + humanizeNumber(payRequestPrice) + " تومان"}</span>

                    </div>
                    <Button loading={bottomSheetBtnLoading} onClick={() => {
                        if (cardNumber.length < 16) {
                            Toast("شماره کارت وارد شده معتبر نمیباشد", 'test', 1000)
                            return;
                        }

                        if (payRequestPrice !== 0 && payRequestPrice <= (balance - (balance / 10))) {

                            setBottomSheetBtnLoading(true)
                            getSupportChat().then((e) => {
                                setBottomSheetBtnLoading(false)
                                if (e.data && e.data.supportChat.id) {
                                    newMessage({
                                        variables: {
                                            chatID: e.data.supportChat.id,
                                            text:
                                                `درخواست برداشت این مبلغ رو دارم:    
                                                ${" " + payRequestPrice.toLocaleString() + " "}تومان
                                            `
                                        }
                                    }).then(() => {
                                        CurrentChatUserData(e.data.supportChat)
                                        router.push('/chat/' + e.data.supportChat.id)
                                    })
                                }
                            })
                        } else {
                            Toast('مقدار اشتباه', '', 2000, '', 18)
                        }


                    }} className={'w-11/12 bg-primary h-14 text-white rounded-2xl mt-5'}>
                        <span className={'IranSansMedium'}>درخواست وجه</span>
                    </Button>

                    <div className={'h-4'}></div>
                </div>

            </BottomSheet>
            {/*Charge wallet bottom sheet*/}

            <BottomSheet open={chargeWalletOpen} onClose={() => {
                setChargeWalletOpen(false)
            }}>
                <div className={' w-full bg-transparent flex flex-col justify-start items-center pt-4 '}>
                    <span
                        className={'IranSansMedium text-textDarker text-right w-full text-md  pr-4 text-textDarker block'}>افزایش موجودی</span>
                    <div className={'relative w-full flex-col justify-center items-center mt-5'}>

                        <div
                            className={'absolute left-5  px-2 h-6  top-1/2 -translate-y-1/2 flex flex-col justify-center border-r-2 items-center'}>
                            <img src="/assets/svgs/toman.svg" className={'invert scale-90'} alt=""/>
                        </div>
                        <Input onChange={(e: any) => {
                            let el = e.currentTarget
                            el.value = el.value.split('').reverse().join('').replace(/,/g, '').replace(/(\d{3}(?!$))/g, "$1,").split('').reverse().join('').replace(/[^\d,]/g, '')
                            setChargeWalletAmount(parseInt(el.value.replace(',', '')))

                        }} id={'pay-req-input'} dir={'ltr'} numOnly={false}
                               inputClassName={'pl-12 text-black IranSansMedium'}
                               wrapperClassName={"w-11/12 h-12 m-auto "}/>

                    </div>
                    {/*<div className={'w-full bg-background mt-3'}>*/}
                    {/*    <span className={'IranSansMedium text-[0.7rem] py-2 block pr-4 text-textDarker'}>سقف مبلغ قابل درخواست یک میلیون تومان میباشد</span>*/}
                    {/*</div>*/}
                    <Button loading={bottomSheetBtnLoading} onClick={() => {

                        if (chargeWalletAmount) {
                            setBottomSheetBtnLoading(true)
                            chargeWallet({
                                variables: {
                                    amount: chargeWalletAmount,
                                }
                            }).then((value) => {
                                setBottomSheetBtnLoading(false)

                                try {
                                    // Toast("خطا هنگام درخواست واریز")

                                    if (value.data.chargeWallet.data.url) {
                                        window.open(value.data.chargeWallet.data.url, "_self")
                                        setChargeWalletOpen(false)
                                    } else {
                                        Toast("خطا هنگام درخواست واریز")

                                    }
                                } catch (e) {
                                    setChargeWalletOpen(false);
                                    Toast("خطا هنگام درخواست واریز")
                                }

                            })


                            //
                        }


                    }} className={'w-11/12 bg-primary h-14 text-white rounded-2xl mt-5'}>
                        <span className={'IranSansMedium'}>واریز وجه</span>
                    </Button>

                    <div className={'h-4'}></div>
                </div>

            </BottomSheet>


            <Drawer initScroll={900} initHeight={drawerInitLimit} minHeight={700} wrap={
                <div className={'w-full grid grid-cols-3 px-3 pt-10'} ref={divRef}>
                    <div className={'col-span-2 p-2 relative'}>
                        <img className={'relative rounded-2xl overflow-hidden w-full  '} src="/assets/svgs/jib-back.png"
                             alt=""/>
                        <div
                            className={'absolute top-0 left-0 w-full h-full px-4 pt-2 pb-5 flex flex-col justify-between items-center'}>
                            <div className={'w-full '}>
                                <span className={'IranSansMedium text-white text-sm'}>یـونی کارت</span>
                            </div>

                            <div className={'flex flex-col justify-center items-center '}>
                                <div className={'flex flex-row justify-center items-center'}>
                                    <span
                                        className={'IranSansMedium text-white text-3xl'}>{balance.toLocaleString()}</span>
                                    <div className={'flex flex-col justify-between items-center'}>
                                        <img src="/assets/svgs/toman.svg" className={'mr-2'} alt=""/>

                                    </div>
                                </div>
                                <span className={'IranSansMedium text-white/70 text-sm -mt-2'}>موجودی</span>
                            </div>

                            <div
                                className={'bg-white/20 w-11/12  rounded-xl  m-0 flex flex-col justify-start items-center'}>

                                <div
                                    className={'flex w-full flex-row justify-start items-center h-8 pl-2 border-b border-white/40'}>
                                    <div
                                        className={'w-10 h-5 flex flex-col justify-center items-center border-l border-white'}>
                                        <img src="/assets/svgs/money-usable.svg" alt=""/>
                                        <span className={'IranSans text-[0.3rem] whitespace-nowrap text-white'}> قابل استفاده</span>
                                    </div>
                                    <div className={'w-full flex flex-row  justify-end items-center'}>
                                        <span
                                            className={'IranSansMedium text-white text-sm'}>{balance.toLocaleString()}</span>
                                        <img src="/assets/svgs/toman.svg" className={'-mr-0.5 w-5 h-3'} alt=""/>
                                    </div>
                                </div>
                                <div className={'flex w-full flex-row justify-start items-center h-8 pl-2 '}>
                                    <div
                                        className={'w-10 h-5 flex flex-col justify-center items-center  border-l border-white'}>
                                        <img src="/assets/svgs/money-blocked.svg" alt=""/>
                                        <span
                                            className={'IranSans text-[0.3rem] whitespace-nowrap text-white'}>بلوکه</span>

                                    </div>
                                    <div className={'w-full flex flex-row  justify-end items-center'}>
                                        <span
                                            className={'IranSansMedium text-white text-sm'}>{blocked.toLocaleString()}</span>
                                        <img src="/assets/svgs/toman.svg" className={'-mr-0.5 w-5 h-3'} alt=""/>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>

                    <div className={'col-span-1 flex flex-col-reverse justify-center items-center'}>
                        <img className={' rounded-2xl overflow-hidden w-full h-full py-2  '}
                             src="/assets/svgs/unicoin.png" alt=""/>

                    </div>


                </div>
            }>
                <div style={{
                    height: drawerMaxHeight + "px"
                }} className={'w-full bg-white flex flex-col justify-start items-center'}>
                    <div className={'w-full flex flex-row justify-around items-center px-4'}>
                        <Button onClick={() => {
                            setChargeWalletOpen(true)
                        }} className={' h-12 rounded-xl bg-background flex flex-row justify-between items-center'}
                                id={'withdraw'} rippleColor={'rgba(0,0,0,0.14)'}>
                            <div
                                className={'h-12 w-12 rounded-xl bg-primary flex flex-col justify-center items-center'}>
                                <img src="/assets/svgs/deposit.svg" alt=""/></div>
                            <span className={"IranSansMedium text-primary text-sm mr-4 ml-4"}>واریــز وجه</span>
                        </Button>
                        <Button onClick={() => {
                            setPayRequestOpen(true)
                        }} className={' h-12 rounded-xl bg-background flex flex-row justify-between items-center'}
                                id={'withdraw'} rippleColor={'rgba(0,0,0,0.14)'}

                        >
                            <div
                                className={'h-12 w-12 rounded-xl bg-primary flex flex-col justify-center items-center'}>
                                <img src="/assets/svgs/withdraw.svg" alt=""/></div>
                            <span className={"IranSansMedium text-primary text-sm mr-4 ml-4"}>برداشت وجه</span>
                        </Button>
                    </div>


                    <div className={'w-full text-right mt-4 mb-2'}>
                        <span className={'text-primary IranSansMedium pr-4 pt-4 mt-2 text-sm mt-2 '}> تراکنش ها</span>
                    </div>
                    <div className={'w-full h-full overflow-scroll'}>
                        {transactions.map((item: any, index) => {
                            let transaction = item.node;
                            let deposit = false;
                            if (transaction.toWallet === walletID)
                                deposit = true;

                            return (
                                <div key={'in' + index} className={'contents'}>
                                    <Button className={"w-full flex flex-row justify-between items-center px-3"}>

                                        <div className={'flex flex-row justify-start items-center h-14 IranSans'}>
                                            <img className={'rotate-180'}
                                                 src={`/assets/svgs/${deposit ? 'deposit-transaction.svg' : 'withdraw-transaction.svg'}`}
                                                 alt=""/>
                                            <span>{deposit ? 'واریز به حساب' : 'برداشت از حساب'}</span>
                                            <span
                                                className={'text-gray-400 text-sm mr-2'}>{passedTime(transaction.createdAt)}</span>
                                        </div>

                                        <div className={'flex flex-row justify-end items-center'}>
                                <span
                                    className={'IranSans ml-2'}>{transaction.amountToman ? transaction.amountToman.toLocaleString() : 0}</span>
                                            <img className={'invert-[0.8]'} src="/assets/svgs/toman.svg" alt=""/>
                                        </div>
                                    </Button>
                                </div>
                            )
                        })}
                        {
                            !transactions.length ?
                                <div className={'flex flex-col justify-center items-center mt-20'}>
                                    <img src={"/assets/image/no-transactions.png"} className={'w-14'} alt=""/>
                                    <span
                                        className={'IranSansMedium text-textDarker mt-2 text-[0.8rem]'}>تراکنشی انجام نداده اید</span>
                                </div>
                                :
                                null
                        }


                    </div>


                </div>
            </Drawer>
        </div>

    );
};

export default Wallet;