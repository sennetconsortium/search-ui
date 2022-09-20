import React from "react";
import {getRootURL} from "../../../config/config";

export default class Unauthorized extends React.Component {
    render() {
        return (
            <div className={'login-container'}>
                <div className={'alert alert-danger text-center'}>
                    <p>
                        Access denied
                    </p>
                    <p>
                        Check your permissions and log in <a href={getRootURL()}>here</a>
                    </p>
                </div>
            </div>
        )
    }
}
