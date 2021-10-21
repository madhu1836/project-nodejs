/*************************
 * ENVIRONMENT VARIABLES 
 **************************/
module.exports = {
    //databaseUrl: 'mongodb+srv://admin:admin123@cluster0.5jwzc.mongodb.net/mishmash_dev?authSource=admin',
    databaseUrl: 'mongodb+srv://admin:admin123@cluster0.5jwzc.mongodb.net/youth_dev?authSource=admin',
    //BaseUrl: 'http://localhost:7000',
    BaseUrl: 'http://44.195.125.80:7000',
    jwtTokenInfo: {
        secretKey: '9889D22341540031D3386132A7BDD38F4830474543C795D019561C0A308F502B',
        issuer: 'Youth',
        audience: 'localhost:8080',
        algorithm: 'HS256',
        expiresIn: '8760h'
    },
    adminJwtTokenInfo: {
        secretKey: '1FF5C1ED994DEE6CE4123DC0262A78DFCE3E39618FB96E72D4F8840EDBFE9179',
        issuer: 'Youth',
        audience: 'localhost:8080',
        algorithm: 'HS256',
        expiresIn: '1h'
    },
    emailTokenInfo: {
        secretKey: 'C094434C7F4F7893C24C7E098CB3C0E91310A2B688372F3DA986D14BAF6B1BDQ',
        issuer: 'Youth',
        audience: 'localhost:8080',
        algorithm: 'HS256',
        expiresIn: '1h'
    },
    mobileTokenInfo: {
        secretKey: '929FFGG453ERYUI456JKL00KIL42001926589GFGJKDHJJSBJ65568BBHHFSJS90',
        issuer: 'Youth',
        audience: 'localhost:8080',
        algorithm: 'HS256',
        expiresIn: '1h'
    },
    passwordResetTokenInfo: {
        secretKey: '50520F727971BEE4F5E7FAB94A61E91FCEE5BB6AB796C0B7EC9CF40991C39F74',
        issuer: 'Youth',
        audience: 'localhost:8080',
        algorithm: 'HS256',
        expiresIn: '1h'
    },
    emailServiceInfo: {
        senderEmail: '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',
        senderPassword: ' IDontKnow1@',
        service: 'SendGrid'
    },
    bcrypt: {
        saltValue: 8
    },
    crypto: {
        secretKey: 'YourSecretKeyForEncryption&Descryption'
    },
    /*ethereumInfo: {
    	// provider: 'https://mainnet.infura.io/v3/5831dc852881455d9adf0e80e6b0e521',
    	// contractAddress: '0x5e72914535f202659083db3a02c984188fa26e9f',
    	// contractAddressSellArt: '0x5e72914535f202659083db3a02c984188fa26e9f',
    	// // contractAddress: '0xd29Bb935EB26dd7914BAB99BDFd4459d9E079526',
    	// privateKey: 'DBF8F1F0547FE5B7EAD822FFA74CAEBD9503B4DB1C43CEECDBE4877FB453DDF3',
    	// defaultAccount: '0x6483ca2A376DC623023acCAa19A7e930F67c6F0D',
    	// etherScanLink: 'https://etherscan.io/tx/'
    	provider: 'https://mainnet.infura.io/v3/7650c9ea41c74a2ead93f7152eac446d',
    	contractAddress: '0xd29Bb935EB26dd7914BAB99BDFd4459d9E079526',
    	contractAddressSellArt: '0xe7e883721D45385D4458f732aDE11e5Ac547e54d',
    	privateKey: 'DBF8F1F0547FE5B7EAD822FFA74CAEBD9503B4DB1C43CEECDBE4877FB453DDF3',
    	defaultAccount: '0x6483ca2A376DC623023acCAa19A7e930F67c6F0D',
    	etherScanLink: 'https://etherscan.io/tx/'
    },*/
    aws: {
        accessKeyId: 'AKIATPRA4XASNPBJ24ET',
        secretAccessKey: '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',
        region: 'us-east-1',
        s3Bucket: 'fetch-delivery',
        s3AvatarBucket: 'fetch-avatar'
    },
    socialLogin: {
        google_client_id: '824295631640-ps25i8isn47ckmerqibcq0ftik3c8v7n.apps.googleusercontent.com',
        facebook_client_id: '1011221082611310',
        facebook_client_secret: '5ade930469d741507e4096196263d7d9'
    },
    /*stripe: {
    	secretKey: 'sk_live_Pk58DPcqiyyvkYlgiUYR865G00Dk87YQb5',
    	webhook_secret: 'whsec_Q7PFF9QbZxMnvYvLCSR7qUe0grmJslnu'
    },*/
    upload_path: 'public/uploads',
    /**
     * Payumoney setup
     * */
};
