//**** External APIs settings ****
module.exports = {
    TPAMagic: {
        version: 'v1', 
        host: 'api.magicthegathering.io',
        port: 80,
        protocol: 'https://', 
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            Accept: '*/*'
        }
    }
};