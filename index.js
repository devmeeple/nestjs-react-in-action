const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...')) //
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

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

app.post('/register', async (req, res) => {
    const user = new User(req.body);
    try {
        const userInfo = await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.json({ success: false, err });
    }
});

app.post('/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾음.
    User.findOne({email: req.body.email}, (err, user) => {
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

                });
            }
        });
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})