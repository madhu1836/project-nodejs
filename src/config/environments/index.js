/*************************
 * ENVIRONMENT VARIABLES 
 **************************/
module.exports = {

    databaseUrl: 'mongodb+srv://Madhu:rjNlU8tVk0YocxUA@cluster0.wexbk.mongodb.net/?retryWrites=true&w=majority',
    BaseUrl: 'http://localhost:8800',

    jwtTokenInfo: {
        secretKey: '9889D22341540031D3386132A7BDD38F4830474543C795D019561C0A308F502B',
        issuer: 'Sample Project',
        audience: 'localhost:8800',
        algorithm: 'HS256',
        expiresIn: '2h'
    },

    bcrypt: {
        saltValue: 8
    },

};
