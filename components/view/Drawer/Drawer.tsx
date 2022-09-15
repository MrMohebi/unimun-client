import React, {useEffect, useRef} from 'react';

interface Props {
    children: any,
    openHeight?: number
    initHeight?: number
    minHeight: number
    wrap: any,
    initScroll?: number
}

const Drawer = (props: Props) => {

    const drawer = useRef<HTMLDivElement>(null)
    const drawerInner = useRef<HTMLDivElement>(null)
    let drawerBack = useRef<HTMLDivElement>(null)
    let drawerEmptySpace = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (drawerEmptySpace.current)
            // drawerEmptySpace.current.style.height = (window.innerHeight - (props.initHeight ?? 0) + 'px')
            drawerEmptySpace.current.style.height = ((props.initHeight ?? 0) + 'px')
        // if (drawer.current)
        //     drawer.current.style.minHeight = props.minHeight + 'px'
    }, [props.initHeight, props.minHeight])

    useEffect(() => {


    }, []);
    return (
        <div ref={drawerBack} onLoad={() => {
            if (props.initScroll) {

                try {
                    drawerBack!.current!.scrollTo(0, props.initScroll)

                } catch (e) {

                }
            }
        }}
             className={'fixed z-30 hide-scrollbars pointer-events-none w-full h-full bg-transparent overflow-y-scroll top-1 left-0 pointer-events-auto '}>
            <div className={'fixed w-full h-full top-0 left-0'}>
                {
                    props.wrap
                }
            </div>
            <div ref={drawerEmptySpace} className={'pointer-events-none'}/>
            <div ref={drawer} onTouchStart={() => {

            }}

                 className={'pointer-events-auto bottom-0 relative bg-white w-full d overflow-hidden  rounded-tr-2xl rounded-tl-2xl'}
                 style={{boxShadow: "0px 0px 20px 0px #1817172b", pointerEvents: 'all'}}>

                <div ref={drawerInner}
                     className={'w-full relative h-full relative pt-10  overflow-hidden scroll-smooth'}>
                    <div
                        className={'drawer-indicator pointer-events-none w-10 h-1 bg-gray-400 absolute top-5 rounded-2xl left-1/2 -translate-x-1/2 z-20'}/>
                    <div className={'relative bg-white h-full'}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Drawer;