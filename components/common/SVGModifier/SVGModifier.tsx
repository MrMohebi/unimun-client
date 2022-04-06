import React, {useEffect, useRef} from 'react';

interface Props {
    SVGName: string,
    elementClass: string,
    value: string,
    children: any
}

const SvgModifier = (props: Props) => {

    const svgHolder = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (svgHolder && svgHolder.current)
            try {
                svgHolder.current.getElementsByClassName(props.SVGName + "_svg__" + props.elementClass)[0].innerHTML = props.value
            } catch (e) {
            }
    })
    return (
        <div ref={svgHolder} id={'svgHolder'}>
            {props.children}
        </div>
    );
};

export default SvgModifier;