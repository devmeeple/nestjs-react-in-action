# NestJS React In Action

Express + React 조합을 NestJS + React 조합으로 마이그레이션(migration) 한다.

**<참고 자료>**

[John Ahn '따라하며 배우는 노드, 리액트 시리즈 - 기본 강의'](https://inf.run/HGxe)

# 4. 데이터베이스 모델과 스키마

CS(Computer science)가 어렵다고 이야기한다. 가장 어려운 점은 문맥에 따라 다르게 사용되는 점이다. 모델(Model), 스키마(Schema)도 그렇다.
데이터베이스에서 사용하는 용어지만 진영에 따라 다른 의미를 가진다. RDBMS, NoSQL에서 어떤 의미로 사용할까.

## 스키마(Schema)

> 스키마는 데이터의 구조와 내용을 정의하는 JSON 객체다.[^1]

테이블을 다루는 RDBMS를 사용하다가 NoSQL을 사용하면 테이블이 없어 당황스럽다. NoSQL의 스키마는 테이블과 비슷하다. 테이블의 구조를 선언하듯이
스키마로 구조를 잡는다. 밑그림을 그린다.

RDBMS에서의 스키마는 DDL(Data Definition Language)를 의미한다.

## 모델(Model)

NoSQL 모델은 데이터의 구조와 비즈니스 로직을 정의하는 객체다. RDBMS는 테이블과 매핑되는 객체를 의미한다.

## 사용

개념을 알아봤으니 사용해보자.

```typescript

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('User', userSchema);
```

모델은 `User`가 되고 스키마는 `userSchema`가 된다.

```typescript
@Entity() 
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({ unique: true})
  email: string;
  
  @Column()
  password: string;
}
```

모델은 `User`가 되고 스키마는 엔티티 클래스를 통해 암묵적으로 정의된다.

```sql
CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);
```

[^1]: [MongoDB '스키마'](https://www.mongodb.com/ko-kr/docs/atlas/app-services/schemas/)
