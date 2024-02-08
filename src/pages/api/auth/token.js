export default async function handler(req, res) {
    if (req.method === 'GET') {
        // check for the Authorization header
        const authHeader = req.headers.authorization || ''
        const authParts = authHeader.split(' ')
        if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
            return res.status(401).json({ active: false })
        }

        let headers = new Headers()
        headers.append('Authorization', 'Basic ' + process.env.GLOBUS_TOKEN)
        headers.append('Content-Type', 'application/x-www-form-urlencoded')

        let formBody = 'token=' + authParts[1]

        let url = 'https://auth.globus.org/v2/oauth2/token/introspect'
        return await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formBody
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.active) {
                    res.status(200).json({ active: response.active })
                } else {
                    res.status(401).json({ active: response.active })
                }
            })
            .catch(() => {
                res.status(401).json({ active: false })
            })
    }
}
