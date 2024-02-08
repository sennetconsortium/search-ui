export default async function handler(req, res) {
    if (req.method === 'POST') {
          return new Promise((resolve, reject) => {
              const body = req.body

              if ('password' in body) {
                  if (body.password === atob(process.env.UI_PSWD)) {
                      res.status(200).json({status_text: 'Valid'})
                  } else {
                      res.status(401).json({status_text: 'Invalid password'})
                  }
                  resolve()
              } else {
                  res.status(401).json({status_text: 'Missing required field: "password"'})
                  resolve()
              }
          });
    }
}
