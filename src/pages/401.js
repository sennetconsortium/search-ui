import 'bootstrap/dist/css/bootstrap.css';
import Header from "../components/custom/layout/Header";
import React from "react";

export default function Custom500() {
    return (
        <>
            <Header title="Unauthorized | SenNet"></Header>

            <div className={"container"}>
                <div className={"row align-items-center error-row"}>
                    <div className={"col"}>
                        <h1 className={"error-heading"}>401</h1>
                        <h2 className={"error-heading"}>Your globus token has expired</h2>
                        <p  className={"error-heading"}>Please logout and login again</p>
                        <div className={"row"}>
                            <div className={"col text-center"}>
                                <a className="btn btn-outline-primary" role={"button"} href={"/logout"}>Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
