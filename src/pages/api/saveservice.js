

export default function handler(req, res) {

	const data = {response: "Only POST accepted"}

	if (req.method === 'POST') {
		//log.debug(req.data)
		res.status(200).json(req.body)
	} else if (req.method === 'GET') {
 		const res = await fetch(`http://localhost:3000/api/mockservice/?uuid=461bbfdc344442673e381f632510b3333333333`)
  		const data = await res.json()
  		res.status(200).json(data)
	}

	res.status(405).json(data)
}

