

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const view = req.query.view
        if (view) {
            const body = JSON.parse(atob(view))
            res.status(200).json(body)
        } else {
            res.status(404).json({error: 'Invalid data resource'})
        }

    }

    res.status(404).json([])
}