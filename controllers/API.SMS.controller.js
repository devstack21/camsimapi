
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN)

 async function initVerification(request, response) {
    let telephone = await request.body.telephone;
    // On envoie le SMS au client à partir du numéro reçu
    client.verify.v2.services(SERVICEID)
        .verifications
        .create({ to: telephone, channel: 'sms' })
        .then(verification => {
            console.log('SMS envoyé ...');
            response.json({ status: verification.status });
        });
    console.log('Envoi du SMS ...');
}
 async function verify(request, response) {
    let { telephone, code } = await request.body;

    // On vérifie le code
    client.verify.v2.services(SERVICEID)
        .verificationChecks
        .create({ to: telephone, code: code })
        .then(verification => {
            response.json({ status: verification.status });
        });
    // Si status = "approved" alors le code est verifié sinon status = "pending"
    console.log('Vérification ...');
}

module.exports = {verify , initVerification }