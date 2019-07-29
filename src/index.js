const { getUsers, getLinks, sendMail } = require('./mailer/requests');



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