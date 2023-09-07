const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
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

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword 암호화된 비밀번호와 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch)
        }
    });
};

const User = mongoose.model('User', userSchema)

module.exports = { User }