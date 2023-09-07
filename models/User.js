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
 * 콜백함수 학습 후 리팩토링 필요
 */
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