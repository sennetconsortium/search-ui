import WebSocket from "ws";
import {getIngestEndPoint} from "../../config/config";

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const ws = new WebSocket(`ws://${getIngestEndPoint()}/job-queue`)

        ws.on('message', function message(data) {
            console.log('received: %s', data);
            res.status(200).json(data)
        })
    }

    res.status(404).json([])
}