import {getRootURL} from "../../../config/config";
import Cookies from 'cookies'

export default function handler(req, res) {
    const cookies = new Cookies(req, res)
    const uuid = req.query.uuid
    let auth = cookies.get("groups_token")

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + auth );
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
        method: 'GET',
        headers: myHeaders
    }
    console.log('sample: getting data...', uuid)
    fetch(getRootURL() + "api/find?uuid=" + uuid, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.hasOwnProperty("error")) {
                res.status(401).json(result)
            } else {
                res.status(200).json(result)
            }
        }).catch(error => {
        console.log(error)
        res.status(500).json(error)
    });
}
