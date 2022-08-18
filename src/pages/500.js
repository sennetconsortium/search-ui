import 'bootstrap/dist/css/bootstrap.css';

export default function Custom500() {
    return (
        <div className={"container"}>
            <div className={"row align-items-center"} style={{height: "35em"}}>
                <div className={"col"}></div>
                <div className={"col"}>
                    <h1 style={{textAlign: "center"}}>500</h1>
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
    )
}
