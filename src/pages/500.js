import 'bootstrap/dist/css/bootstrap.css';
import Header from "../components/custom/layout/Header";
import React from "react";

export default function Custom500() {
    return (
        <>
            <Header title="Internal Server Error | SenNet"></Header>

            <div className={"container"}>
                <div className={"row align-items-center error-row"}>
                    <div className={"col"}></div>
                    <div className={"col"}>
                        <h1 className={"error-heading"}>500</h1>
                        <h2>Oops! We've encountered an internal server error</h2>
                        <div className={"row"}>
                            <div className={"col"}></div>
                            <div className={"col text-center"}>
                                <a className="btn btn-outline-primary" role={"button"} href={"/search"}>Home</a>
                            </div>
                            <div className={"col"}></div>
                        </div>
                    </div>
                    <div className={"col"}></div>
                </div>
            </div>
        </>
    )
}
