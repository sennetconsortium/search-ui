import 'bootstrap/dist/css/bootstrap.css';
import Header from "../components/custom/layout/Header";
import React from "react";

export default function Custom404() {
    return (
        <>
            <Header title="Page Not Found | SenNet"></Header>

            <div className={"container"}>
                <div className={"row align-items-center error-row"}>
                    <div className={"col"}>
                        <h1 className={"text-center"}>404</h1>
                        <h2 className={"text-center"}>Oops! This page could not be found</h2>
                        <p className={"text-center"}>Sorry but the page you are looking for does not exist, has been removed, or is
                            temporarily unavailable</p>
                        <div className={"row"}>
                            <div className={"col text-center"}>
                                <a className="btn btn-outline-primary" role={"button"} href={"/search"}>Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
