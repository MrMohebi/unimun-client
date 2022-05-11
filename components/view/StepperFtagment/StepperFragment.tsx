import React, {useEffect} from 'react';

interface Props {
    children?: React.ReactNode,
    step: number
}

const StepperFragment = (props: Props) => {
    useEffect(() => {
        let steps = Array.from(document.getElementsByClassName('stepper')[0].children)
        steps.forEach((s, i) => {
            let styleOfStep = (s as HTMLDivElement).style;
            if (i !== props.step) {
                styleOfStep.setProperty('opacity', '0', 'important');
                styleOfStep.setProperty('max-height', '0vh', 'important');
                styleOfStep.setProperty('overflow', 'hidden', 'important');
            } else {
                styleOfStep.setProperty('opacity', '1', 'important');
                styleOfStep.setProperty('max-height', '100vh', 'important');
                styleOfStep.setProperty('overflow', '', 'important');

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