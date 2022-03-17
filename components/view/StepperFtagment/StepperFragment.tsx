import React, {useEffect} from 'react';

interface Props {
    children?: React.ReactNode,
    step: number
}

const StepperFragment = (props: Props) => {
    useEffect(() => {
        let steps = Array.from(document.getElementsByClassName('stepper')[0].children)
        steps.forEach((s, i) => {
            if (i !== props.step) {
                let styleOfStep = (s as HTMLDivElement).style;
                styleOfStep.opacity = "0";
                styleOfStep.maxHeight = "0vh";
                styleOfStep.overflow = "hidden";
            } else {
                let styleOfStep = (s as HTMLDivElement).style;
                styleOfStep.opacity = "1";
                styleOfStep.maxHeight = "100vh";
                styleOfStep.overflow = "";
            }
        })
    }, [props.step])

    return (
        <div className={'stepper'}>
            {
                props.children ?? null
            }
        </div>
    );
};

export default StepperFragment;