import {signup} from '../controllers/users/signup.controllers.js';
import bodyParser from 'body-parser';
export default function load(app) {
    let jsonParser = bodyParser.json()
    app.post('/users/signup', jsonParser, signup);

    


}

