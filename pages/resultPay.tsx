import React, {useEffect, useRef} from 'react';
import PaymentBaseSVG from '../assets/svgs/paymentTicket.svg'
import Button from "../components/view/Button/Button";
import {useRouter} from "next/router";
import {fixPrice} from "../helpers/fixPrice";


const ResultPay = () => {
    const router = useRouter();

    const svgRef = useRef(null)
    // const router = useRouter();

    const putCommaInNumber = (number: string) => {
        return number.split('').reverse().map((e, i) => (
            i % 3 === 0 && i !== 0 ? e + "," : e
        )).reverse().join('')
    }
    const retry = () => {

    }
    const backToUnimun = () => {
        window.open('/wallet', "_self")

    }

    const setBalance = (balance: String) => {
        const svg = svgRef && svgRef.current ? (svgRef.current as HTMLDivElement).firstChild as HTMLDivElement : document.createElement('div')
        svg.querySelector('.paymentTicket_svg__balance')!.innerHTML = balance.toString();
        let balanceHolderElement = svg.querySelector('.paymentTicket_svg__balanceHolder');
        balanceHolderElement!.setAttribute("transform", `translate(${30 - (balance.length) * 5} 0)`)
    }

    const setAmount = (amount: string) => {
        console.log('amount' + amount)
        const svg = svgRef && svgRef.current ? (svgRef.current as HTMLDivElement).firstChild as HTMLDivElement : document.createElement('div')
        svg.querySelector('.paymentTicket_svg__amount')!.innerHTML = amount.toString();
        let balanceHolderElement = svg.querySelector('.paymentTicket_svg__amountHolder');
        balanceHolderElement!.setAttribute("transform", `translate(${30 - (amount.length) * 5} 0)`)
    }

    const setPaymentStatus = (success: boolean) => {
        const svg = svgRef && svgRef.current ? (svgRef.current as HTMLDivElement).firstChild as HTMLDivElement : document.createElement('div')
        let successElement = svg.querySelector('.paymentTicket_svg__success')
        let failedElement = svg.querySelector('.paymentTicket_svg__failed')
        let failedButton = svg.querySelector('.paymentTicket_svg__failedButton')

        if (success) {
            successElement!.setAttribute('opacity', '1')
            failedElement!.setAttribute('opacity', '0.001')
            failedButton!.setAttribute('opacity', '0.001')

        } else {
            failedElement!.setAttribute('opacity', '1')
            successElement!.setAttribute('opacity', '0.001')
            failedButton!.setAttribute('opacity', '1')
            let onClick = () => {
                retry()
            }
            failedButton!.removeEventListener('click', onClick)
            failedButton!.addEventListener('click', onClick)
        }
    }


    useEffect(() => {
        // setPaymentStatus(false)
        // setBalance(putCommaInNumber("500"))
        // setAmount(putCommaInNumber("1000000000"))
    }, [])

    useEffect(() => {
        let routerLocal = router.query as {
            amount: string
            status: string
            balance: string
        }
        if ('amount' in routerLocal && 'balance' in routerLocal && 'status' in routerLocal) {
            setAmount(routerLocal.amount)
            setPaymentStatus(!!parseInt(routerLocal.status))
            setBalance(fixPrice(parseInt(routerLocal.balance)))
        }
    }, [router.query]);


    return (
        <div className={'w-100 h-100 left-1/2  top-1/2 flex flex-col items-center justify-center '}>
            <div dir={'ltr'} className={'w-full h-full max-w-md  '} ref={svgRef}>
                <PaymentBaseSVG/>
            </div>
            <div className={'w-full text-center IranSans text-textDark'}>
                <span>اگر مبلغ از حساب شما کسر شده است</span>
                <br/>
                <span>کمتر از 2 ساعت دیگر به حسابتان باز میگردد</span>

            </div>
            <div
                className={'w-full absolute -translate-x-1/2 left-1/2 bottom-4 flex flex-col justify-center items-center'}>
                <Button id={'paymentInfo-button'} onClick={() => {
                    backToUnimun()
                }}
                        className={'w-11/12 rounded-2xl mx-3 bg-primary text-white p-4 bottom-0'} rippleColor={'white'}>
                    <span className={'IranSansMedium'}>بازگشت به یونیمون</span>
                </Button>
            </div>
        </div>
    );
};

export default ResultPay;