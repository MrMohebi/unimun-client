import React, {useEffect} from 'react';



interface Props {
    children?: any,
    activeIndex: number,
    indicatorAtBottom?: boolean,
    indicatorSizeDivider?: 'full' | number
}


const Tab = ({children, activeIndex, indicatorAtBottom, indicatorSizeDivider}: Props) => {

    const indicatorRef = React.useRef(null);


    const moveIndicator = () => {
        let children = document.getElementById('children')?.children;
        let child = children![activeIndex].getBoundingClientRect()

        if (indicatorRef && indicatorRef.current) {
            let indicator = (indicatorRef.current as HTMLElement)
            let divideBy = 1;
            if (typeof indicatorSizeDivider === "number") {
                divideBy = indicatorSizeDivider
            }
            let width = child.width / divideBy;
            (indicator as HTMLElement).style.width = width + 'px';
            (indicator as HTMLElement).style.left = ((child.left + (child.width / 2)) - (width / 2)) + 'px'
        }

    }

    useEffect(() => {
        moveIndicator()
        window.addEventListener("resize", moveIndicator);
        return () => {
            window.removeEventListener("resize", moveIndicator);
        };

    }, [])

    return (
        <div className="navbar">
            <div ref={indicatorRef} id={'nav-indicator'}
                 className={`nav-indicator transition-all ${indicatorAtBottom ? 'bottom-0' : 'top-0'}`}/>
            <div id={'children'} className={'contents'}>
                {
                    children
                }
            </div>


        </div>
    );
};

export default Tab;