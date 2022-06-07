import React from 'react';

interface Props {
    color?: string,
    wrapperClassName: string
    strokeWidth?: number

}

const LoadingDialog = (props: Props) => {
    return (
        <div className={props.wrapperClassName + ' relative'}>
            <div className="showbox">
                <div className="loader">
                    <svg className="circular" viewBox="25 25 50 50">
                        <circle className="path" style={{stroke: props.color ?? 'black'}} cx="50" cy="50" r="20"
                                fill="none" strokeWidth={props.strokeWidth ?? 2}
                                strokeMiterlimit="10"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default LoadingDialog;