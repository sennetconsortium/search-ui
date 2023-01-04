import {simple_query_builder} from "search-ui/lib/search-tools";
import {getIndex, getSearchEndPoint} from "../../config/config";

// a mock service to return some data
export default async function handler(req, res) {
    var error_messages = [{error: "Only support GET/POST"}, {error: "UUID Not found, please check for the correct id"}]
    console.log("FIND API...")

    // only allow POST
    if (req.method === "GET" || req.method === "POST") {

        // use the f
        let uuid = req.query.uuid

        if (uuid) {
            // need to convert into a ES ready query
            let queryBody = simple_query_builder("uuid", uuid)
            console.log('QUERY', formatMessageForCloudwatch(queryBody))
            var myHeaders = new Headers();
            if(req.headers.authorization !== undefined) {
                myHeaders.append("Authorization", req.headers.authorization);
            }
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(queryBody)
                //redirect: 'follow'
            };
            // request("POST", "search", queryBody, getAuth(), getSearchEndPoint()).then(json =>
            //       //adaptResponse(json, this.indexName)
            //       console.log(json)
            //       //res.status(200).json(json)
            //     )
            await fetch(getSearchEndPoint() + getIndex() + "/search", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('SEARCH API RESPONSE BODY', formatMessageForCloudwatch(result))

                    if (result.hasOwnProperty("error")) {
                        res.status(401).json(result)
                    } else {
                        var total = result["hits"]["total"]["value"]
                        if (total === 1) {
                            var entity = result["hits"]["hits"][0]["_source"]
                            res.status(200).json(entity)
                        } else {
                            res.status(404).json(error_messages[1])
                        }
                    }
                })
                .catch(error => {
                    console.log('ERROR IN FIND API...', formatMessageForCloudwatch(error))
                    res.status(500).json(error)
                });
        } else {
            res.status(500).json(error_messages[0])
        }
    } else {
        res.status(500).json(error_messages[0])
    }

}

/*
Cloudwatch uses the newline (\n) character to create new rows in the logs.
Replacing it with a carriage return (\r) allows us to have multiline strings in one row of the logs.
 */
export function formatMessageForCloudwatch(obj) {
    const json_str = JSON.stringify(obj, null, 2)
    const env = process.env.NODE_ENV
    if(env === "development"){
        return json_str
    }
    else if (env === "production"){
        return json_str.replace(/\n/g, '\r')
    }
}