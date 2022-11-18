import path from "path";

export default async function handler(req, res) {
    // //Find the absolute path of the json directory
    // const jsonDirectory = path.join(process.cwd(), 'json');
    // //Read the json data file data.json
    // const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
    // //Return the content of the data file in json format
    // res.status(200).json(fileContents);

    let inputFile = path.join(process.cwd(), '../entity_constraints.yml'), outputFile = 'out.json',
        yaml = require('js-yaml'),
        fs = require('fs'),
        obj = yaml.load(fs.readFileSync(inputFile, {encoding: 'utf-8'}));
    res.status(200).json(obj);
}