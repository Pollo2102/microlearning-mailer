const { getKanji, getUsers, getWikipediaPage, getReactPage, getCIAPage} = require('./requests');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'microlearning.bot@gmail.com',
        pass: 'wr987@#$WE'
    }
});


mailerFunction = () => {


    while(true) {
        console.log('Waiting...');
        let now = new Date();
        console.log('End1');
        let hour = now.getHours();
        console.log('End2');
        let minutes = now.getMinutes();
        console.log('End3');
        if (now.getSeconds() == 0/* hour == 8 && minutes == 0 */) {
            console.log('Time to send email');
            let users =  getUsers();
            users.forEach(user => {
                let pages = [];
                
                if (user.subscriptions.includes('W')) { // Wikipedia
                    pages.push(getWikipediaPage());
                }
                if (user.subscriptions.includes('K')) { // Kanji
                    pages.push(getKanji());
                }
                if (user.subscriptions.includes('R')) { // React
                    pages.push(getReactPage());
                }
                if (user.subscriptions.includes('C')) { // CIA
                    pages.push(getCIAPage());
                }
                console.log(pages.join(', '));
                let mailOptions = {
                    from: 'microlearning.bot@gmail.com',
                    to: `${user.email}`,
                    subject: 'Microlearning Daily E-mail.',
                html: `<h1>Good day, dear sir/ma\'m,&nbsp;</h1><p>Thank you once again for subscribing to our service.</p><p>It is a pleasure to help you learn something new every day. Here you have your daily portion of knowledge:</p>${pages.join(', ')}<p>&nbsp;</p><p>I wish you a good day.</p><p>-Microlearning bot</p>`
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                })
            });
        }
        console.log('End');
    }

};

module.exports = {mailerFunction};