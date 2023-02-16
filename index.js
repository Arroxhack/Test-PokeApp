const server = require("./src/app.js");
const port = process.env.PORT || 3001;
const {db} = require("./src/db.js");

db.sync({force: false}).then(() => {
    server.listen(port, () => {
        console.log(`Listening at port ${port}`);
    });
}); 