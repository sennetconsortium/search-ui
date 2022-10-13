import React from 'react';


const LoadingSpinner = () => {
    return (
        <div className={'d-flex flex-column pt-5 justify-content-center align-items-center'}>
            <span>Loading, please wait...</span>
            <br></br>
            <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
        </div>
    );
};

export default LoadingSpinner;