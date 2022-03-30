import React, {useState} from 'react';
import Header from "../../components/common/Header/Header";
import Input from "../../components/view/Input/Input";
import Divider from "../../components/view/Divider/Divider";
import ThousandTomans from '../../assets/svgs/thousandTomans.svg'
import DoubleSlider from "../../components/view/DoubleSlider/DoubleSlider";
import StepperFragment from "../../components/view/StepperFtagment/StepperFragment";
import Step from "../../components/view/StepperFtagment/Step/Step";
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {useMutation} from "@apollo/client";
import {gql} from "@apollo/client";
import {Token} from "../../store/user";
import {newItemQuery} from "../../queries/withAuthentication/items";
import GallerySVG from '../../assets/svgs/gallery.svg'
import NewPhotoSVG from '../../assets/svgs/newPhoto.svg'


const Index = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [lowerPrice, setLower] = useState(10)
    const [upperPrice, setUpper] = useState(300)
    const [hashtags, setHashtags] = useState([] as string[])
    const [currentStep, setCurrentStep] = useState(0)

    let query = newItemQuery(title, lowerPrice, upperPrice, description, hashtags)

    const [createAd, {data, loading, error}] = useMutation(gql`${query.query}`, {
        variables: query.variables, context: {
            headers: {
                "token": Token()
            }
        }
    })

    const router = useRouter()

    return (
        <div className={'h-full'}>
            <Header backOnClick={() => {
                if (currentStep > 0)
                    setCurrentStep(currentStep - 1)
                else
                    router.push('/')

            }} back={true} alignment={'rtl'} title={'ثبت آگهی'}>
                <div className={'absolute left-2'}>
                </div>
            </Header>
            <StepperFragment step={currentStep}>

                <Step step={0}>
                    <section className={'pb-20'}>
                        <div className={'w-full h-40 bg-white mt-1 px-4 pt-3 new-section'}>
                            <span className={'text-textDark text-lg IranSansMedium  '}>عنوان آگهی</span>
                            <div className={'w-full flex items-center justify-center mt-4'}>
                                <Input id={'title'} numOnly={false} wrapperClassName={'w-11/12 h-12'}
                                       onChange={(e: any) => {
                                           setTitle(e.currentTarget.value)
                                       }}
                                       labelText={'در عنوان اگهی به موارد مهم اشاره کنید'}/>
                            </div>
                            <Divider type={'horizontal'} color={'#d7d7d7'} className={'mt-10'}/>
                        </div>
                        <div className={'w-full bg-white px-4 pt-3 new-section'}>
                            <div className={'w-full flex flex-row justify-between'}>
                                <span className={'text-textDark text-lg IranSansMedium  '}>بودجه</span>
                                <div className={'IranSansMedium flex flex-row items-center justify-center'}>
                                    <span className={'mx-0.5'}>از</span>
                                    <span className={'mx-0.5'}>{lowerPrice}</span>
                                    <span className={'mx-0.5'}>تا</span>
                                    <span className={'mx-0.5'}>{upperPrice}</span>
                                    <div dir={'ltr'} className={'w-10 h-10'}>
                                        <ThousandTomans/>
                                    </div>
                                </div>
                            </div>
                            <div className={'w-full flex items-center justify-center'}>
                                <div dir={'rtl'} className={'w-10/12'}>
                                    <DoubleSlider sliderColor={'#E1E8ED'} sliderSize={'5px'} defaultLower={lowerPrice}
                                                  defaultUpper={upperPrice} max={500} min={10}
                                                  steps={10} onChange={(lower: number, upper: number) => {
                                        setLower(lower)
                                        setUpper(upper)
                                    }}/>
                                </div>
                            </div>

                        </div>


                        <div className={'IranSans text-textDark text-sm mx-4 my-2'}>
                            <span>کاربران مجاز خواهند بود در این بازه قیمت به شما پیشنهاد دهند</span>
                        </div>

                        <div className={'w-full bg-white px-4 pt-3 new-section pb-5'}>
                            <div className={'w-full flex flex-row justify-between'}>
                        <span className={'text-textDark text-lg IranSansMedium  '}>هَشـ <span
                            className={'text-primary'}>#</span>تگ ها</span>
                                <div className={'IranSansMedium flex flex-row items-center justify-center'}>
                                    <span className={'mx-0.5 text-primary text-xl'}>{hashtags.length}/{5}</span>
                                </div>
                            </div>


                            <div className={'flex flex-wrap justify-start items-center mt-4'}>
                                {
                                    Array(hashtags.length).fill('').map((hashtag: string, index) => (
                                        <div key={hashtag + index} id={'hashtag-' + index}
                                             className={`IranSansMedium text-primary text-sm w-auto h-9 border border-gray-300 rounded-xl flex flex-row justify-center items-center mx-1 cursor-pointer mt-2 px-2 transition-all`}>
                                            <span id={'hashtag-tag-' + index}>#</span>
                                            <input autoFocus={true} maxLength={20} onChange={(e) => {
                                                let updatedHashtags = hashtags
                                                updatedHashtags[index] = e.currentTarget.value
                                                setHashtags([...updatedHashtags])
                                                e.currentTarget.style.width = e.currentTarget.value.length + 2 + "ch"
                                            }} defaultValue={hashtag}
                                                   className={'mr-1 w-5 outline-0 transition-all focus:outline-4'}/>
                                        </div>
                                    ))
                                }
                                {
                                    hashtags.length < 5 ?
                                        <div onClick={() => {
                                            let updateHashtags;
                                            if (!hashtags.length || hashtags[hashtags.length - 1] && hashtags[hashtags.length - 1].length) {
                                                updateHashtags = [...hashtags, '']
                                                setHashtags(updateHashtags)
                                            } else {
                                                let lastHashtag = document.getElementById('hashtag-' + (hashtags.length - 1)) ?? document.createElement('div');
                                                lastHashtag!.style.borderColor = 'red';
                                                lastHashtag!.style.transform = 'scale(1.1)';
                                                setTimeout(() => {
                                                    lastHashtag!.style.borderColor = '';
                                                    lastHashtag!.style.transform = 'scale(1)';
                                                }, 100)
                                            }

                                        }}
                                             className={'IranSansMedium mt-2 text-white bg-primary text-sm w-20 h-9 border border-primary rounded-xl flex flex-row justify-center items-center mx-1 cursor-pointer'}>
                                            <span>+</span>
                                            <span className={'mr-1'}>افزودن</span>
                                        </div>
                                        :
                                        null
                                }


                            </div>
                        </div>
                        <div className={'IranSans text-textDark text-sm mx-4 my-2'}>
                            <span>با اضافه کردن حداقل 1 تا 5 هشتگ به آکهی خود به فرآیند انجام شدن اگهی سرعت ببخشید.</span>
                        </div>

                        <div className={'w-full h-40 bg-white mt-1 px-4 pt-3 new-section'}>
                            <span
                                className={'text-textDark text-md IranSansMedium text-primary '}>اطلاعات اختیاری</span>
                            <div className={'w-full flex flex-row justify-between px-4 IranSans mt-5'}>
                                <span>دانشگاه</span>
                                <span>نام دانشگاه</span>
                            </div>
                            <Divider type={'horizontal'} color={'#d7d7d7'} className={'mt-4 mb-4'}/>
                            <div className={'w-full flex flex-row justify-between px-4 IranSans'}>
                                <span>دانشگاه</span>
                                <span>نام دانشگاه</span>
                            </div>
                        </div>
                    </section>
                </Step>


                <Step step={1}>
                    <div className={'w-full bg-white mt-1 px-4 pb-10 pt-3 new-section'}>
                        <span className={'text-textDark text-lg IranSansMedium  '}>توضیحات اضافه</span>
                        <div className={'w-full flex items-center justify-center mt-4 h-40'}>
                            <Input onChange={(e: any) => {
                                setDescription(e.currentTarget.value)
                            }} multiLine={true} id={'title'} numOnly={false}
                                   inputClassName={'bg-transparent h-full w-full IranSans border-2 border-primary rounded-lg bg-pri h-26  outline-0 px-3 py-4 '}
                                   wrapperClassName={'w-11/12 h-full'}
                                   labelText={'توضیحات تکمیلی اگهی خود را بنویسید'}/>
                        </div>
                    </div>


                    <div className={'w-full bg-white px-5 pt-3 new-section pb-5 mt-4'}>
                        <div className={'w-full flex flex-row justify-between'}>
                            <span className={' text-lg IranSansMedium text-primary '}>آپلود</span>
                        </div>
                        <div className={'flex flex-row justify-between items-center'}>
                            <div className={'flex flex-row items-center justify-start mt-3'}>
                                <div className={'h-6 w-6'}>
                                    <GallerySVG/>
                                </div>
                                <span className={'IranSans mr-2'}>عکس</span>
                            </div>

                            <span className={'text-primary IranSansMedium text-md'}>{"1/5"}</span>
                        </div>

                        <div className={'new-photos w-full flex flex-wrap justify-center mt-3'}>

                            <div className={'new-photo h-24 w-24 flex flex-col justify-center items-center rounded-2xl border-2 mx-3 relative'}>
                                <div className={'flex flex-col items-center justify-center'}>
                                    <div className={'h-7 w-7'}><NewPhotoSVG/></div>
                                    <span className={'text-sm IranSansMedium'}>افزودن عکس</span>
                                </div>
                            </div>

                               <div className={'loaded-photo h-24 w-24 flex flex-col justify-center items-center rounded-2xl border-2 mx-3 relative'}>
                                <div className={'flex flex-col items-center justify-center'}>
                                    <div className={'h-7 w-7'}><NewPhotoSVG/></div>
                                    <span className={'text-sm IranSansMedium'}>افزودن عکس</span>
                                </div>
                            </div>

                        </div>




                    </div>

                </Step>


            </StepperFragment>

            <div className={'w-full bottom-2 fixed flex flex-row items-center justify-center po'}>
                <Button
                    className={'w-11/12 h-14  bg-primary rounded-xl flex flex-row justify-between items-center px-4'}
                    rippleColor={'rgba(255,255,255,0.49)'} onClick={() => {
                    if (currentStep !== 1)
                        setCurrentStep(currentStep + 1)
                    else {

                        createAd()
                    }
                }}>
                    <div className={'text-white IranSans w-8 '}/>
                    <div className={'text-white IranSans  '}>{`${currentStep == 1 ? 'ثبت' : 'بعدی'}`}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"
                         opacity={currentStep == 1 ? 0 : 1}>
                        <g id="arrow-left" transform="translate(-363.5 -251.5)">
                            <g id="Vector" transform="translate(371.155 255.333)" fill="#fff">
                                <path
                                    d="M 7.84499979019165 17.58749961853027 C 7.578320026397705 17.58749961853027 7.327309608459473 17.48336029052734 7.138219833374023 17.29427909851074 L 0.618219792842865 10.77427959442139 C -0.5434601902961731 9.61259937286377 -0.5434601902961731 7.722399711608887 0.618219792842865 6.56071949005127 L 7.138219833374023 0.04071969538927078 C 7.325699806213379 -0.1467503011226654 7.576699733734131 -0.2500002980232239 7.84499979019165 -0.2500002980232239 C 8.113299369812012 -0.2500002980232239 8.364299774169922 -0.1467503011226654 8.551779747009277 0.04071969538927078 C 8.941490173339844 0.430439680814743 8.941490173339844 1.064559698104858 8.551779747009277 1.454279661178589 L 2.031779766082764 7.974279880523682 C 1.649529814720154 8.35651969909668 1.649529814720154 8.978479385375977 2.031779766082764 9.360719680786133 L 8.551779747009277 15.8807201385498 C 8.941490173339844 16.27043914794922 8.941490173339844 16.90456008911133 8.551779747009277 17.29427909851074 L 8.54872989654541 17.29731941223145 L 8.54557991027832 17.30026054382324 C 8.34712028503418 17.48548889160156 8.098320007324219 17.58749961853027 7.84499979019165 17.58749961853027 Z"
                                    stroke="none"/>
                                <path
                                    d="M 7.84499979019165 17.33749961853027 C 8.034999847412109 17.33749961853027 8.22499942779541 17.25749969482422 8.375 17.11750030517578 C 8.664999961853027 16.82749938964844 8.664999961853027 16.34749984741211 8.375 16.05749893188477 L 1.854999780654907 9.53749942779541 C 1.374999761581421 9.057499885559082 1.374999761581421 8.277500152587891 1.854999780654907 7.797499656677246 L 8.375 1.277499675750732 C 8.664999961853027 0.9874997138977051 8.664999961853027 0.5074996948242188 8.375 0.2174996882677078 C 8.08499813079834 -0.07250067591667175 7.604999542236328 -0.07249993830919266 7.314999580383301 0.2174996882677078 L 0.7949998378753662 6.737499713897705 C -0.265000194311142 7.797499656677246 -0.265000194311142 9.53749942779541 0.7949998378753662 10.59749984741211 L 7.314999580383301 17.11750030517578 C 7.464999675750732 17.26749992370605 7.654999732971191 17.33749961853027 7.84499979019165 17.33749961853027 M 7.84499979019165 17.83749961853027 C 7.511539936065674 17.83749961853027 7.197749614715576 17.70735931396484 6.96144962310791 17.47105026245117 L 0.4414498209953308 10.9510498046875 C -0.8177101612091064 9.691899299621582 -0.8177101612091064 7.643099784851074 0.4414498209953308 6.383949756622314 L 6.96144962310791 -0.1360502988100052 C 7.196139812469482 -0.3707503080368042 7.509929656982422 -0.5000002980232239 7.84499979019165 -0.5000002980232239 C 8.180069923400879 -0.5000002980232239 8.493860244750977 -0.3707503080368042 8.728549957275391 -0.1360502988100052 C 9.215749740600586 0.3511396944522858 9.215749740600586 1.14385974407196 8.728549957275391 1.631049752235413 L 2.208549737930298 8.151049613952637 C 1.923779845237732 8.435819625854492 1.923779845237732 8.899179458618164 2.208549737930298 9.18394947052002 L 8.728549957275391 15.70394992828369 C 9.215749740600586 16.19113922119141 9.215749740600586 16.98386001586914 8.728549957275391 17.47105026245117 L 8.716159820556641 17.48303031921387 C 8.471249580383301 17.71160888671875 8.161859512329102 17.83749961853027 7.84499979019165 17.83749961853027 Z"
                                    stroke="none" fill="#fff"/>
                            </g>
                            <g id="Vector-2" data-name="Vector" transform="translate(364 252)" fill="none" opacity="0">
                                <path d="M0,0H24V24H0Z" stroke="none"/>
                                <path
                                    d="M 0 0 L 0 24 L 24 24 L 24 0 L 0 0 M -0.5 -0.5 L 24.5 -0.5 L 24.5 24.5 L -0.5 24.5 L -0.5 -0.5 Z"
                                    stroke="none" fill="#fff"/>
                            </g>
                        </g>
                    </svg>
                </Button>
            </div>

        </div>
    );
};

export default Index;