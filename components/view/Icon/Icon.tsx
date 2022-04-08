import React from 'react';
// import Image from "next/image";

interface Props {
    w: number,
    h: number,
    unit: string,
    svg?: any,
    img?: string,
    alt?: string,
    fill?: boolean
}

const Icon = ({w, h, unit, svg, img, alt, fill}: Props) => {

    return (
        img ?
            <div
                style={{
                    height: h + (unit ? unit : 'px'),
                    width: w + (unit ? unit : 'px'),
                }}

            >
                <img src={img} alt={alt}/>
            </div>
            :
            <div className={"transition-all " + (fill ? 'icon-background' : 'bg-black')}
                 style={{
                     height: w + (unit ? unit : 'px'),
                     width: w + (unit ? unit : 'px'),
                     WebkitMaskImage: `url(${svg})`,
                     WebkitMaskRepeat: 'no-repeat'
                 }}>
            </div>
    )

};

export default Icon;