const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs');
const nodemailer = require('nodemailer');

const wikipediaRequest = 'https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&prop=info&format=json';



getWikipediaPage = () => {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let queryJSON = JSON.parse(xhttp.responseText);
                let id = queryJSON.query.random[0].id;

                resolve(`https://en.wikipedia.org/?curid=${id}`);
            }
            else {
                console.log(xhttp.responseText);
            }
        }
        xhttp.open('GET', wikipediaRequest, false);
        xhttp.send();
    });
    
};

getKanji = () => {
    let number = Math.floor((Math.random() * 20927) + 19968);
    let hexString = String.fromCharCode(parseInt(number, 16));

    return `https://jisho.org/search/${hexString}%20%23kanji`;
}

getUsers = () => {

        return new Promise((resolve, reject) => {
            API_LINK = 'http://microlearning-api-dev.us-east-2.elasticbeanstalk.com/api/users';

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {

                    resolve(JSON.parse(xhttp.responseText));

                }
                else {
                    console.log(xhttp.responseText);
                    reject(xhhtp.responseText);
                }
            }
            xhttp.open('GET', API_LINK, false);
            xhttp.send();
        });
};


getLinks = (user) => {
    return new Promise((resolve, reject) => {
        let pages = [];
        const promises = [];
        
        if (user.subscriptions.includes('W')) { // Wikipedia
            promises.push(getWikipediaPage());
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

        if (promises.length > 0) {
            Promise.all(promises).then(promisedPages => {   
                resolve(promisedPages.concat(pages).join(', '));
            });
        }
        else {
            resolve(pages.join(', '));
        }
    });
};

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secureConnection: false,
    port: 587,
    auth: {
        user: 'microlearning.bot@gmail.com',
        pass: 'wr987@#$WE'
    }
});

sendMail = (user, pages) => {
    let mailOptions = {
        from: 'microlearning.bot@gmail.com',
        to: `${user.email}`,
        subject: 'Microlearning Daily E-mail.',
        html: `<h1>Good day, dear sir/ma\'m,&nbsp;</h1><p>Thank you once again for subscribing to our service.</p><p>It is a pleasure to help you learn something new every day. Here you have your daily portion of knowledge:</p>${pages}<p>&nbsp;</p><p>I wish you a good day.</p><p>-Microlearning bot</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log(err);
        else
            console.log(info.response);
    });

};

getReactPage = () => {

    let number = Math.floor(Math.random() * (reactPages.length - 1));
    return `https://reactjs.org/docs/${reactPages[number]}`;
};

getCIAPage = () => {
    let number = Math.floor(Math.random() * 499);

    let content = fs.readFileSync(__dirname + '/ciaPages.txt', 'utf8');
    let contentArray = content.split('\n');
    
    return contentArray[number];
}


const reactPages = ['getting-started.html', 'add-react-to-a-website.html', 'create-a-new-react-app.html', 'cdn-links.html', 'hello-world.html', 'introducing-jsx.html', 'rendering-elements.html', 'components-and-props.html', 'state-and-lifecycle.html', 'handling-events.html', 'conditional-rendering.html', 'lists-and-keys.html', 'forms.html', 'lifting-state-up.html', 'composition-vs-inheritance.html', 'thinking-in-react.html', 'accessibility.html', 'code-splitting.html', 'context.html', 'error-boundaries.html', 'forwarding-refs.html', 'fragments.html', 'higher-order-components.html', 'integrating-with-other-libraries.html', 'jsx-in-depth.html', 'optimizing-performance.html', 'portals.html', 'react-without-es6.html', 'react-without-jsx.html', 'reconciliation.html', 'refs-and-the-dom.html', 'render-props.html', 'static-type-checking.html', 'strict-mode.html', 'typechecking-with-proptypes.html', 'uncontrolled-components.html', 'web-components.html', 'react-api.html', 'react-component.html', 'react-dom.html', 'react-dom-server.html', 'dom-elements.html', 'events.html', 'test-utils.html', 'shallow-renderer.html', 'test-renderer.html', 'javascript-environment-requirements.html', 'glossary.html', 'hooks-intro.html', 'hooks-overview.html', 'hooks-state.html', 'hooks-effect.html', 'hooks-rules.html', 'hooks-custom.html', 'hooks-reference.html', 'hooks-faq.html', 'how-to-contribute.html', 'codebase-overview.html', 'implementation-notes.html', 'design-principles.html', 'faq-ajax.html', 'faq-build.html', 'faq-functions.html', 'faq-state.html', 'faq-styling.html', 'faq-structure.html', 'faq-versioning.html', 'faq-internals.html'];

module.exports = { getWikipediaPage, getKanji, getUsers, getCIAPage, getReactPage, getLinks, sendMail};