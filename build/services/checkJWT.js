const jwt = require('jsonwebtoken');
const checkJWT = async (jwtToken) => {
    try {
        jwtToken = jwtToken.replace('Bearer ', '');
        const decodedToken = jwt.verify(jwtToken, process.env.TOKEN_KEY);
        return !!(decodedToken);
    }
    catch (e) {
        return false;
    }
};
module.exports = checkJWT;
