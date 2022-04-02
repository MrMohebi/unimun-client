import React, {useEffect, useRef, useState} from 'react';

interface Props {
    children: any,
    closedHeight:number,
    openHeight?:number
}

const Drawer = (props: Props) => {

    const drawer = useRef<HTMLDivElement>(null)
    const drawerInner = useRef<HTMLDivElement>(null)
    let childrenSize = useRef(0);
    let [opened, setOpened] = useState(false);

    useEffect(() => {
        if (opened) {
            childrenSize.current = 0;
            if (drawerInner && drawerInner.current) {
                let childArray = Array.from(drawerInner.current.children);
                console.log(childArray)

                childArray.map(child => {
                    childrenSize.current += child.getBoundingClientRect().height;
                })
            }
            if (drawer && drawer.current)
                drawer.current.style.height = childrenSize.current + 'px'
        } else {
            if (drawer && drawer.current)
                drawer.current.style.height = (props.closedHeight??170) + 'px'
        }

    }, [opened])
    return (
        <div ref={drawer}
             className={'absolute max-h-full bottom-0 left-1/2 -translate-x-1/2 h-0 bg-white w-full transition-all duration-500 overflow-hidden ease-in-out  rounded-tr-2xl  rounded-tl-2xl'}
             style={{boxShadow: "0px 0px 20px 0px #1817172b"}}>
            <div  onClick={()=>{
                setOpened(!opened)
            }} className={'absolute h-10 top-0 left-0 w-full bg-white z-10'}/>
            <div ref={drawerInner} className={'w-full h-full relative pt-10 px-4 overflow-scroll'}>
                <div  onClick={()=>{
                    setOpened(!opened)
                }}
                     className={'drawer-indicator w-10 h-1 bg-gray-400 fixed top-5 rounded-2xl left-1/2 -translate-x-1/2 z-20'}/>
                {/*<div onScroll={()=>{*/}
                {/*    setOpened(true)*/}
                {/*}} className={'w-full overflow-scroll h-full'}>*/}
                    {props.children}
                {/*</div>*/}
            </div>
        </div>

    );
};

export default Drawer;