import React, {useEffect, useRef, useState} from 'react';

interface Props {
    children: any,
    closedHeight: number,
    openHeight?: number
    initHeight?: number
    minHeight?: number
}

const Drawer = (props: Props) => {

    const drawer = useRef<HTMLDivElement>(null)
    const drawerInner = useRef<HTMLDivElement>(null)
    let childrenSize = useRef(0);
    let [opened, setOpened] = useState(false);
    let startPoint = useRef(170)
    let touchStart = useRef(170)
    let grabbed = useRef(false)

    useEffect(() => {
        document.addEventListener('touchmove', (e) => {
            if (e.targetTouches[0].clientY > (e.target as HTMLDivElement).getBoundingClientRect().top) {
                if (drawer.current)
                    drawer.current.style.height = (window.innerHeight - e.targetTouches[0].clientY + touchStart.current) + 'px'
            }
        })
        document.addEventListener('touchstart', (e) => {
            if (e.targetTouches[0].clientY > (e.target as HTMLDivElement).getBoundingClientRect().top) {
                if (drawer.current)
                    touchStart.current = e.targetTouches[0].clientY + 1 - drawer.current.getBoundingClientRect().top
            }
        })
        document.addEventListener('pointerup', (e) => {
            document.body.style.overflow = 'scroll'
            if (drawer.current) {
                drawer.current.style.transition = 'none'
                if (drawer.current) {
                    // drawer.current.style.transition = 'all .3s ease'
                }
                if (parseInt(drawer.current.style.height.split('px')[0]) > (props.initHeight ?? 0)) {
                    childrenSize.current = 0;
                    if (drawerInner && drawerInner.current) {
                        let childArray = Array.from(drawerInner.current.children);
                        childArray.map(child => {
                            childrenSize.current += child.getBoundingClientRect().height;
                        })
                    }

                }
            }
        })

        // if (opened) {
        if (drawer.current)
            drawer.current.style.height = (props.initHeight ?? 170) + 'px'

        //     if (drawer && drawer.current)
        //         drawer.current.style.height = childrenSize.current  + 'px'
        // } else {
        //     if (drawer && drawer.current)
        //         drawer.current.style.height = (props.closedHeight ?? 170) + 'px'
        // }

    }, [props.initHeight])
    return (
        <div ref={drawer}
             className={' absolute max-h-full bottom-0 left-1/2 -translate-x-1/2 h-0 bg-white w-full  d overflow-hidden  rounded-tr-2xl rounded-tl-2xl'}
             style={{boxShadow: "0px 0px 20px 0px #1817172b", minHeight: `${props.minHeight ?? '0'}px`}}>
            <div id={'drawer-header'} onClick={() => {
                // setOpened(!opened)
            }}
                 onPointerDown={(e) => {
                     if (drawerInner.current) {
                         drawerInner.current.scrollTop = 0
                     }
                     if (drawer.current) {
                         drawer.current.style.transition = 'none'
                     }

                     grabbed.current = true
                     startPoint.current = e.clientY
                     document.body.style.overflow = 'hidden'

                 }}
                 onPointerUp={() => {


                 }}

                 className={'absolute drawer-drag h-10 top-0 left-0 w-full bg-white z-10'}/>
            <div ref={drawerInner} className={'w-full  h-full relative pt-10 px-4 overflow-hidden scroll-smooth'}>
                <div onClick={() => {
                    // setOpened(!opened)
                }}
                     className={'drawer-indicator pointer-events-none w-10 h-1 bg-gray-400 fixed top-5 rounded-2xl left-1/2 -translate-x-1/2 z-20'}/>
                {/*<div onScroll={()=>{*/}
                {/*    setOpened(true)*/}
                {/*}} className={'w-full overflow-scroll h-full'}>*/}
                <div className={'relative'}>
                    {/*<div className={'absolute drawer-drag z-30 w-full h-full top-0 left-0'}></div>*/}
                    {props.children}

                </div>
                {/*</div>*/}
            </div>
        </div>

    );
};

export default Drawer;