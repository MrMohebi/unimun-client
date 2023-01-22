import React, {useEffect} from 'react';


interface Props {
    steps: number,
    onChange: any,
    min: number,
    max: number,
    sliderColor?: string,
    tumbColor?: string,
    defaultLower?: number
    defaultUpper?: number
    sliderSize?: string
}

const DoubleSlider = (props: Props) => {

    let onChange = (lower: number, upper: number) => {
        props.onChange(lower, upper)
    }
    useEffect(() => {

        let lowerSlider = document.querySelector('#lower') as HTMLInputElement,
            upperSlider = document.querySelector('#upper') as HTMLInputElement,
            lowerVal = parseInt(lowerSlider!.value),
            upperVal = parseInt(upperSlider!.value);

        upperSlider.oninput = () => {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);

            if (upperVal < lowerVal + 4) {
                lowerSlider.value = (upperVal - 4).toString();

                if (lowerVal == parseInt( lowerSlider.min)) {
                    upperSlider.value = 4+'';
                }
            }

            onChange(lowerVal, upperVal)
        };


        lowerSlider.oninput = function () {
            lowerVal = parseInt(lowerSlider.value);
            upperVal = parseInt(upperSlider.value);

            if (lowerVal > upperVal - 4) {
                upperSlider.value = (lowerVal + 4).toString();

                if (upperVal == parseInt( upperSlider.max)) {
                    lowerSlider.value = parseInt(upperSlider.max) - 4+'';
                }

            }
            onChange(lowerVal, upperVal)
        };


    }, [])

    const InputsStyle = {
        background: `linear-gradient(${props.sliderColor},${props.sliderColor}) no-repeat center`,
        backgroundSize: `100% ${props.sliderSize}`,

    }
    const UpperInputStyle = {
        background: `linear-gradient(${props.sliderColor},${props.sliderColor}) no-repeat center`,
        backgroundSize: `100% ${props.sliderSize}`,

    }
    return (
        <div className="multi-range">
            <input style={InputsStyle} type="range" min={props.min} max={props.max}
                   defaultValue={props.defaultLower ?? 0} step={props.steps}
                   id="lower"/>
            <input className={''} type="range" min={props.min} max={props.max} defaultValue={props.defaultUpper ?? 0}
                   step={props.steps}
                   id="upper"/>
        </div>
    );
};

export default DoubleSlider;