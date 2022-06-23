import React, {useEffect, useRef, useState} from 'react';
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
    images: [{ preview: string, url: string }]
}

const ImageSlider = (props: Props) => {

        let bookImages = useRef([] as Array<HTMLDivElement>);
        let trigger = useRef(null);
        const imageScroller = useRef<HTMLDivElement>(null);
        const [images, setImages] = useState(['', '', '', '', '']);

        useEffect(() => {
                let imgCopy = [] as Array<string>;
                props.images.forEach((item, index) => {
                    imgCopy.push(item.preview);
                })

                setImages(imgCopy);

            }, []
        )
        return (
            <div
                className={`overflow-auto  image-slider flex flex-row items-center ${images.length < 3 ? 'justify-center' : 'px-5'}  w-full mx-auto snap-mandatory snap-x mt-5 relative `}
                ref={imageScroller}>
                {/*<div className={'h-full w-32 bg-white right-0 fixed'}></div>*/}
                {/*<div className={'h-32 w-20 bg-transparent mx-5 snap-center'} style={{flex: '0 0 auto'}}/>*/}
                {
                    images.map((image, index) => {
                        return (
                            <div key={index + 'ed'} className={'relative contents'}>
                                <img key={'image' + index} src={"https://dl.unimun.me/" + images[index]}
                                     className={`h-44 w-32 ${true ? 'h-44 w-32' : 'h-40 w-28'} overflow-hidden  rounded-xl mx-2 mt-10 snap-center`}
                                     ref={(el) => {
                                         if (el)
                                             bookImages.current[index] = el
                                     }}
                                     style={{flex: '0 0 auto'}}/>

                                {/*<span>{index}</span>*/}
                            </div>

                        )
                    })
                }
                {/*<div className={'h-32 w-20 bg-transparent mx-5 snap-center'} style={{flex: '0 0 auto'}}/>*/}
            </div>
        );
    }
;

export default ImageSlider;