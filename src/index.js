const { getUsers, getLinks, sendMail } = require('./mailer/requests');
const express = require('express');
const app = express();


app.set('port', process.env.PORT || 3120);
app.get('/', (req, res) => {
    res.send('Microlearning mailer');
});
app.listen(app.get('port'), () => {
    console.log(`App listening on port ${app.get('port')}`);
});

setInterval(() => {
    getUsers()
        .then(users => {
            users.forEach(user => {
                getLinks(user)
                .then(links => {
                    sendMail(user, links);
                });
            });
        });
}
   , 86400000);