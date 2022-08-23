import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Button from "../../components/view/Button/Button";
import Toman from "../../assets/svgs/toman.svg";
import Input from "../../components/view/Input/Input";
import {fixPrice} from "../../helpers/fixPrice";
import Header from "../../components/common/Header/Header";

const Preview = () => {


    const router = useRouter()

    const [name, setName] = useState('');
    const [writer, setWriter] = useState('');
    const [publisher, setPublisher] = useState('');
    const [language, setLanguage] = useState('');
    const [price, setPrice] = useState(0);
    const [appereance, setAppereance] = useState("");
    const [category, setCategory] = useState("");


    useEffect(() => {

        let filteredarr = decodeURI(router.asPath).split('&').filter((item) => {

            return item.includes('bookTemplate')
        })

        console.log(filteredarr)

        setName(filteredarr.filter((item) => {
            return item.includes('title')
        })[0].split(']')[1].replaceAll("+", ' ').replaceAll("=", ""))
        setPublisher(filteredarr.filter((item) => {
            return item.includes('publisher')
        })[0].split(']')[1].replaceAll("+", ' ').replaceAll("=", ""))
        setAppereance(filteredarr.filter((item) => {
            return item.includes('[appearance][title]')
        })[0].split('[appearance][title]')[1].replaceAll("+", ' ').replaceAll("=", ""))

        setWriter((filteredarr.filter((item) => {
                return item.includes('bookTemplate[writer]')
            })[0].split('bookTemplate[writer]')[1].replaceAll("+", ' ').replaceAll("=", ""))
        )
        setCategory(filteredarr.filter((item) => {
            return item.includes('[category][title]')
        })[0].split('[category][title]')[1].replaceAll("+", ' ').replaceAll("=", ""))

    }, []);
    return (
        <div className={'h-full overflow-scroll'}>
            <Header blurBackground={true} back={true}
                    backOnClick={() => {
                        router.push('/qr/scan')
                    }}/>

            <div className={'w-full h-full flex flex-col justify-start items-center'}>


                <div className={'flex flex-col justify-center items-center w-full mt-20 '}>
                    <img src="/assets/image/noBookImage.png" className={'h-auto w-32'} alt=""/>
                    <div
                        className={'w-11/12 bg-white shadow-md rounded-2xl pb-2 -translate-y-1/3 mx-2 flex flex-col justify-start items-center'}>
                        <span
                            className={'text-textDarker text-[0.7rem] IranSansMedium mt-2 '}>{writer.length ? writer : "-----"}</span>
                        <span
                            className={'text-black text-[0.9rem] IranSansMedium mt-2 '}>{name.length ? name : "-----"}</span>

                        <div id={'right-aligner'} dir={''}
                             className={'flex flex-col w-full px-4 mt-3 justify-start items-start'}>
                            <div className={'IranSansMedium text-sm mt-2 whitespace-nowrap'}><span
                                className={'text-textDark'}> وضعیت ظاهری: </span>
                                <span>{appereance.length ? appereance : "-"}</span>
                            </div>
                            <div className={'IranSansMedium text-sm mt-2 whitespace-nowrap'}><span
                                className={'text-textDark'}> ناشر: </span>
                                <span>{publisher.length ? publisher : "-"}</span>
                            </div>
                            <div className={'IranSansMedium text-sm mt-2 whitespace-nowrap'}><span
                                className={'text-textDark'}> دسته بندی: </span>
                                <span>{category.length ? category : "-"}</span>
                            </div>
                        </div>

                        <Button className={'w-11/12 rounded-2xl h-14 mt-4 bg-[#F6F8FA] '} id={'edit-book'}
                                rippleColor={'rgba(0,0,0,0.08)'}>
                            <span className={'text-black IranSansBold text-sm'}>ویرایش اطلاعات کتاب</span>
                        </Button>
                    </div>


                    <div className={'w-full  flex flex-col justify-center items-start px-4'}>
                        <div
                            className={'flex IranSansMedium text-textDarker w-full flex-row justify-between items-center'}>
                            <span>فروش به قیمت</span>
                            {/*<div className={'flex flex-row justify-center items-center'}>*/}
                            {/*    <input className={'w-5 h-5 ml-3'} type="checkbox"/>*/}
                            {/*    <span className={'text-black'}>رایگان</span>*/}
                            {/*</div>*/}


                            <div
                                className={' IranSansMedium h-10 w-24 px-2 flex flex-row justify-around items-center bg-background rounded-lg'}>
                                <input id={'free-book'}
                                       className={'free-checkbox h-5 w-5 rounded border-2 border-primary'}
                                       type={'checkbox'}
                                    // defaultValue={BookData.price}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {

                                       }}/>
                                <label htmlFor={'free-book'}> رایگان</label>
                            </div>
                        </div>


                        <div
                            className={`${price ? 'opacity-70 grayscale pointer-events-none' : ''} border-primary border-2 w-11/12 mx-auto h-14  rounded-xl mt-5 flex flex-row-reverse justify-start items-center`}>
                            <div className={'w-10 h-10 mx-2 p-2'}>
                                <Toman/>
                            </div>
                            {/*todo theres a bug when user wants to edit its always 20000*/}

                            <div className={'h-3/5 bg-gray-400 w-0 border'}/>
                            <Input id={'book-price'} dir={'ltr'}
                                   numOnly={false}

                                   inputClassName={'border-0 border-transparent text-left text-lg IranSansBold rounded-xl'}
                                   wrapperClassName={'w-full h-full '}
                                   onChange={(e: InputEvent) => {
                                       let el = e.currentTarget as HTMLInputElement
                                       el.value = el.value.split('').reverse().join('').replace(/,/g, '').replace(/(\d{3}(?!$))/g, "$1,").split('').reverse().join('').replace(/[^\d,]/g, '')
                                   }}
                            />
                        </div>
                        <p className={' IranSansMedium text-textDarker w-full text-center text-[0.7rem] mt-5'}>کتاب که
                            الان تو دستاته به همین سادگی میره تو یونیمون به فروش برسه

                            <br/>
                            فقط
                            کافیه دکمه زیر رو بزنی
                        </p>
                    </div>
                    <Button className={'w-11/12 rounded-2xl h-14 mt-4 bg-primary '} id={'resell-book'}
                            rippleColor={'rgba(255,255,255,0.39)'}>
                        <span className={'text-white IranSansBold text-sm -pt-10'}>فروش در یونیمون</span>
                    </Button>

                    <div className={'h-20'}></div>
                </div>

            </div>

        </div>
    );
};

export default Preview;