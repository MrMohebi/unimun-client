import React, {useEffect, useRef} from 'react';
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
    images: [string]
}

const ImageSlider = (props: Props) => {

    let bookImages = useRef([] as Array<HTMLDivElement>);
    let trigger = useRef(null);

    let images = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    useEffect(() => {
        setTimeout(() => {

        }, 1000)

        images.map((el, index) => {

            // let tl = gsap.timeline({
            //     scrollTrigger: {
            //         // snap: {
            //         //     snapTo:0.1,
            //         //     duration:0.1,
            //         //     // ease:'inOut'
            //         // },
            //         trigger: bookImages.current[index],
            //         scroller: trigger.current,
            //         // markers: true,
            //         start: 'top center',
            //         end: 'bottom center',
            //         scrub: 2
            //
            //     },
            // })
            // tl.to(bookImages.current[index], {
            //     scale: 1
            // }).to(bookImages.current[index], {
            //     scale: 1.5
            //
            // }).to(bookImages.current[index], {
            //     scale: 1.5
            //
            // }).to(bookImages.current[index], {
            //     scale: 1.5
            //
            // }).to(bookImages.current[index], {
            //     scale: 1
            // })
            // // trigger.current.style.transform = 'rotate(90deg)'

        })


    }, [])
    return (
        <div className={'overflow-auto  flex flex-row h-44 items-center w-full snap-mandatory snap-x  '} ref={trigger}>
            <div className={'h-32 w-20 bg-transparent mx-5 snap-center '} style={{flex: '0 0 auto'}}/>
            {
                images.map((image, index) => {
                    return (
                        <div key={'image' + index} className={'h-32 w-32 bg-primary mx-5 mt-10 snap-center'}
                             ref={(el) => {
                                 if (el)
                                     bookImages.current[index] = el
                             }}
                             style={{flex: '0 0 auto'}}/>
                    )
                })
            }
            <div className={'h-32 w-20 bg-transparent mx-5 snap-center'} style={{flex: '0 0 auto'}}/>
        </div>
    );
};

export default ImageSlider;