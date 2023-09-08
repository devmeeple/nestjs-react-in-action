const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { auth} = require('./middleware/auth');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...')) //
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/api/users/register', async (req, res) => {
    const user = new User(req.body);
    try {
        const userInfo = await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.json({ success: false, err });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        // 요청된 이메일을 데이터베이스에서 있는지 확인.
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            });
        }

        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: '비밀번호가 일치하지 않습니다.'
            });
        }

        // 비밀번호까지 일치하다면 토큰을 생성하기.
        const tokenUser = await user.generateToken();

        // 토큰을 저장한다. 쿠키, 로컬 스토리지 아래 방식은 쿠키에 저장
        res.cookie('x_auth', tokenUser.token)
            .status(200)
            .json({
                loginSuccess: true,
                userId: tokenUser._id
            });

    } catch (err) {
        console.log('에러 발생:', err);
        return res.status(500).json({ success: false, err} );
    }
});

app.get('/api/users/auth', auth, (req, res) => {
    // 여기 까지 미들웨어를 통과했다는 것은 인증 성공이라는 뜻
    res.status(200).json({
        _id: req.user._id,
        // role 0 -> 일반유저 / 0이 아니면 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { token: '' });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.'
            })
        }

        return res.status(200).send({
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            success: false, err
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

// Callback 사용 MongooseError: Model.prototype.save() no longer accepts a callback 발생
// 최신 Mongoose 에서는 API가 업데이트 되어 지원하지 않는다. 따라서 새로운 콜백을 학습하여 적용할 필요가 있다. async/await 또는 Promise
// https://www.inflearn.com/questions/805491/%EA%B0%95%EC%9D%98%EC%97%90-%EB%82%98%EC%98%A4%EB%8A%94-%EB%AC%B8%EB%B2%95%EC%9D%B4-%EC%A0%81%EC%9A%A9%EB%90%98%EC%A7%80-%EC%95%8A%EC%8A%B5%EB%8B%88%EB%8B%A4
/*
app.post('/register', (req, res) => {
    // 회원 가입 시 필요한 정보를 클라이언트에서 받아오고 데이터베이스에 저장한다.
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})
*/

// MongooseError: Model.findOne() no longer accepts a callback
/*
app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾음.
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            console.log('User.findOne 에러:', err);
            return res.status(500).send(err);
        }
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            });
        }
        // 요청된 이메일이 데이터베이스 있다면 비밀번호가 맞는 비밀번호 인지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({loginSuccess: false, message: '비밀번호가 틀렸습니다.'});
            } else {
                // 비밀번호 까지 맞다면 토큰을 생성하기.
                user.generateToken((err, user) => {
                    if (err) {
                        return res.status(400).send(err);
                    }

                    // 토큰을 저장한다. 쿠키, 로컬 스토리지 아래 방식은 쿠키에 저장
                    res.cookie('x_auth', user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id})
                });
            }
        });
    });
});
 */

/*
MongooseError: Model.findOneAndUpdate() no longer accepts a callback
app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id },
        { token: ''}, (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        }
    );
});
 */