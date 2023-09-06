# 따라하며 배우는 노드, 리액트 시리즈 - 기본 강의
[몽고 DB 연결](https://www.youtube.com/watch?v=IHjolKwrjPE&t=217s) 해당 URL에서는 다양한 옵션을 주어 mongoose 설정을 지원했다.  
하지만 [mongoose 공식문서](https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options)를 보면 mongoose6부터는 더 이상 지원되지 않는 옵션이라고 한다. 따라서 코드 작성시 유의하도록 하자.
> No More Deprecation Warning Options  
useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.
```javascript
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://devmeeple:<password>@cluster0.sc7iabh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected...')) //
    .catch(err => console.log(err))
```