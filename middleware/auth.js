const { User } = require('../models/User');
let auth = async (req, res, next) => {
    // 인증 처리를 하는 곳

    // 클라이언트 퀴에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    try {
        // 토큰을 복호화 한 후 유저를 찾는다.
        const user = await User.findByToken(token);

        if (!user) {
            return res.json({
                isAuth: false,
                error: true
            });
        }

        req.token = token;
        req.user = user;
        next();

    } catch (err) {
        return res.json({
            isAuth: false,
            error: true
        });
    }
}

module.exports = {auth};

// 토큰을 복호화 한 후 유저를 찾는다.
/*
User.findByToken(token, (err, user) => {
    if (err) {
        throw err;
    }

    if (!user) {
        return res.json({
            isAuth: false,
            error: true
        });
    }

    req.token = token;
    req.user = user;
    next();
});

// 유저가 있으면 인증 OK. 없으면 NO
 */