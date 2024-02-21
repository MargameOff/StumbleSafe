/**
 * Create a route /
 * @param {*} app APP instance of express
 */
export default function load(app) {
    app.get('/', (req, res) => {
        res.send('hello world')
    })
}

