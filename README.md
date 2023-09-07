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

## 커밋 컨벤션
프로젝트를 진행할 때 효과적인 개발을 위해 프레임워크를 도입하여 생산성을 올리듯이 커밋 메시지도 컨벤션이 있다면 협업 시 생산성이 비약적으로 증가하겠다고 느꼈다. 이번 프로젝트에 사용할 커밋 컨벤션은 다음과 같다.  
| 커밋 타입 | 설명                                               | 사용 예시                                      |
|------------|----------------------------------------------------|------------------------------------------------|
| `feat`     | 새로운 기능을 추가할 경우                           | `git commit -m "feat(auth): add new login page"` |
| `fix`      | 버그를 수정할 경우                                 | `git commit -m "fix(navbar): correct the broken links"` |
| `refactor` | 코드를 리팩토링할 경우 (기능이나 버그에 영향 없음) | `git commit -m "refactor(utils): optimize date parser"` |
| `docs`     | 문서를 수정할 경우                                 | `git commit -m "docs: update README"`          |
| `style`    | 코드 스타일을 변경할 경우 (로직 변경 없음)          | `git commit -m "style: format code"`           |
| `test`     | 테스트 코드를 추가하거나 수정할 경우                | `git commit -m "test(auth): add login unit tests"` |

## nodemon
스프링 부트에 `devtools` 같은 패키지이다. 파일이 수정되면 `nodemon`이 변화를 감지하고 서버를 재시동해준다.
```javascript
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}

```
프로덕션 환경과 개발환경을 다음과 같이 분리하여 사용하였다.

## login
12강은 문제가 많았다. mongoose가 버전업이 되어ㅂ 레거시 코드들이 되어버렸다. 많은 코드가 리팩토링 되었고 `async/await` , `Promise` 문법의 중요성이 강조되었다.

[문법 참고자료](https://ko.javascript.info/)
- async/await, Promise 이하 callback
- try .. catch