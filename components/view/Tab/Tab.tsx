import React, {useEffect, useRef, useState} from 'react';


interface Props {
    children?: any,
    activeIndex: number,
    indicatorAtBottom?: boolean,
    indicatorSizeDivider?: 'full' | number
}


const Tab = ({children, activeIndex, indicatorAtBottom, indicatorSizeDivider}: Props) => {

    const indicatorRef = React.useRef(null);
    const container = React.useRef<HTMLDivElement>(null);
    const [initialized, _initialized] = useState(false)
    const componentId = useRef(Math.random() * 99999999);


    const moveIndicator = () => {
        try {
            let children = document.getElementById('children' + componentId.current)?.children;
            let child = children![activeIndex].getBoundingClientRect()
            let leftOffset = 0;
            if (container.current)
                leftOffset = container.current.getBoundingClientRect().left


            if (indicatorRef && indicatorRef.current) {
                let indicator = (indicatorRef.current as HTMLElement)
                let divideBy = 1;
                if (typeof indicatorSizeDivider === "number") {
                    divideBy = indicatorSizeDivider
                }
                let width = child.width / divideBy;
                (indicator as HTMLElement).style.width = width + 'px';
                (indicator as HTMLElement).style.left = ((child.left - leftOffset + (child.width / 2)) - (width / 2)) + 'px'
            }

        } catch (e) {

        }

    }

    useEffect(() => {
        setTimeout(() => {
            moveIndicator()
        }, 200)
        moveIndicator()
        window.addEventListener("resize", moveIndicator);
        return () => {
            window.removeEventListener("resize", moveIndicator);
        };

    }, [activeIndex])
    useEffect(() => {
        setTimeout(() => {
            _initialized(true)
        }, 100)
    }, [])
    return (
        <div ref={container} className="w-full h-full flex flex-row justify-between relative">
            <div ref={indicatorRef} id={'nav-indicator'}
                 className={`nav-indicator ${initialized ? ' transition-all' : 'h-0'} ${indicatorAtBottom ? 'bottom-0 rounded-t-md' : 'top-0 rounded-b-md'}`}/>
            <div id={'children' + componentId.current} className={'contents'}>
                {
                    children
                }
            </div>


        </div>
    );
};

export default Tab;