import 'bootstrap/dist/css/bootstrap.css';

function Spinner() {
    return (
        <div className="text-center p-3">
            <span>Loading, please wait...</span>
            <br></br>
            <span className="spinner-border spinner-border-lg align-center alert alert-info"></span>
        </div>
    )
}

export default Spinner
