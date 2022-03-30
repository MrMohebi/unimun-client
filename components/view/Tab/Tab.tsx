import React, {useEffect} from 'react';


interface Props {
    children?: any,
    activeIndex: number,
    indicatorAtBottom?: boolean,
    indicatorSizeDivider?: 'full' | number
}


const Tab = ({children, activeIndex, indicatorAtBottom, indicatorSizeDivider}: Props) => {

    const indicatorRef = React.useRef(null);
    const container = React.useRef<HTMLDivElement>(null);


    const moveIndicator = () => {
        let children = document.getElementById('children')?.children;
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

    return (
        <div ref={container} className="w-full h-full flex flex-row justify-between relative">
            <div ref={indicatorRef} id={'nav-indicator'}
                 className={`nav-indicator transition-all ${indicatorAtBottom ? 'bottom-0 rounded-t-md' : 'top-0 rounded-b-md'}`}/>
            <div id={'children'} className={'contents'}>
                {
                    children
                }
            </div>


        </div>
    );
};

export default Tab;