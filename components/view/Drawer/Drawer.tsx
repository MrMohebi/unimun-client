import React, {useEffect, useRef, useState} from 'react';

interface Props {
    children: any,
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

                childArray.map(child => {
                    childrenSize.current += child.getBoundingClientRect().height;
                })
            }
            if (drawer && drawer.current)
                drawer.current.style.height = childrenSize.current + 'px'
        } else {
            if (drawer && drawer.current)
                drawer.current.style.height = 120 + 'px'
        }


    }, [opened])
    return (
        <div ref={drawer}
             className={'absolute bottom-0 left-1/2 -translate-x-1/2 h-0 bg-white w-full transition-all duration-500 overflow-hidden ease-in-out  rounded-tr-3xl  rounded-tl-3xl'}
             style={{boxShadow: "0px 0px 20px 0px #1817172b"}}>
            <div ref={drawerInner} className={'w-full h-full relative pt-14 px-4'}>
                <div
                    onClick={()=>{
                         setOpened(!opened)
                     }}
                     className={'drawer-indicator w-10 h-1 bg-gray-400 absolute top-5 rounded-2xl left-1/2 -translate-x-1/2'}/>
                    {props.children}

            </div>
        </div>

    );
};

export default Drawer;