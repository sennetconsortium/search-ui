import React from "react";
export default class Unauthorized extends React.Component {
    render() {
        return (
            <div className={'container login-container'}>
                <div className={'alert alert-danger text-center'}>You have not been granted access to use the <a href={'/'}>SenNet Data Sharing Portal</a> or you have not logged in</div>
            </div>
        )
    }
}
