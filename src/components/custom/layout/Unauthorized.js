import React from "react";
export default class Unauthorized extends React.Component {
    render() {
        return (
            <div className={'container login-container'}>
                <div className={'alert alert-danger text-center'}>Access denied</div>
            </div>
        )
    }
}
