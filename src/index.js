const nodemailer = require('nodemailer');
const { getUsers, getLinks } = require('./mailer/requests');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secureConnection: false,
    port: 587,
    auth: {
        user: 'microlearning.bot@gmail.com',
        pass: 'wr987@#$WE'
    }
});

while(true) {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    if ((now.getSeconds() == 0 || now.getSeconds() == 30) && now.getMilliseconds(0) == 0/* hour == 8 && minutes == 0 */) {
        getUsers()
        .then(users => {
            console.log('asfasf');
            console.log(users);
            users.forEach(user => {
                getLinks(user)
                .then(links => {
                    let mailOptions = {
                        from: 'microlearning.bot@gmail.com',
                        to: `${user.email}`,
                        subject: 'Microlearning Daily E-mail.',
                        html: `<h1>Good day, dear sir/ma\'m,&nbsp;</h1><p>Thank you once again for subscribing to our service.</p><p>It is a pleasure to help you learn something new every day. Here you have your daily portion of knowledge:</p>${links}<p>&nbsp;</p><p>I wish you a good day.</p><p>-Microlearning bot</p>`
                    };
        
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err)
                            console.log(err);
                        else
                            console.log(info.response);
                    });
                });
            });
        });
    }    
}
