import React from 'react';

const SkeletonElement = ({className}: { className: string }) => {
    return (
        <div className={`bg-gray-200  rounded-md overflow-hidden ${className}`}>
            <div className={'skeleton w-full h-full'}/>
        </div>
    );
};

export default SkeletonElement;