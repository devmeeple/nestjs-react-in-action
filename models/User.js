const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

/**
 * Mongoose의 pre 메서드를 사용, 'save' 이벤트가 발생하기 전 실행될 로직을 정의한다.
 * 비밀번호가 변경될 경우에만 암호화 작업을 수행한다.
 * 
 * 문제점
 * 비동기 처리의 중첩: bcrypt.genSalt, bcrypt.hash 함수의 콜백 중첩이 발생했다.
 * 에러처리의 중복이 발생
 * ES6 패턴에 맞게 수정
 *
 * 해결방안
 * async/await 사용
 * 에러처리 개선: try-catch 블록을 사용하여 에러를 한 곳에서 처리
 * var 대신 const, let을 사용함.
 */
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            // 비밀번호를 암호화함
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err)
    }
});

userSchema.methods.comparePassword = async function (planPassword) {
    try {
        return await bcrypt.compare(planPassword, this.password);
    } catch (err) {
        throw err;
    }
};

userSchema.methods.generateToken = async function () {
    try {
        this.token = jwt.sign(this._id.toHexString(), 'secretToken');
        await this.save();
        return this;
    } catch (err) {
        throw err;
    }
};
/*
콜백함수 학습 후 리팩토링 필요
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                return next(err)
            }

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err){
                    return next(err)
                }
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});
*/

/*
userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword 암호화된 비밀번호와 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
};
 */

/*
MongooseError: Model.prototype.save() no longer accepts a callback
메서드가 콜백을 더 이상 지원하지 않는다.
userSchema.methods.generateToken = function (cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function (err, user) {
        if (err) {
            return cb(err);
        } else {
            cb(null, user);
        }
    });
};
 */

const User = mongoose.model('User', userSchema)

module.exports = { User }