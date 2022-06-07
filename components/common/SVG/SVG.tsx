import React, {useEffect, useRef, useState} from 'react';


import SVG from '../../../assets/svgs/toman.svg'

const Svg = (props: { svgPath: string, svgOnLoad: Function, wrapperClassName: string, wrapperRef?: any }) => {


    const [svg, _svg] = useState(null);
    const wrapperRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (svg) {
            props.svgOnLoad(wrapperRef.current?.firstChild);
        }
    }, [svg])
    useEffect(() => {

        try {
            import(`../../../assets/svgs/${props.svgPath}.svg`).then(importedSVG => {
                _svg(importedSVG.default())
            })
        } catch (e) {
            console.log(e)
        }
    }, [props.svgPath])
    return (
        <div className={props.wrapperClassName} ref={wrapperRef}>
            {svg}
        </div>
    );
};

export default Svg;