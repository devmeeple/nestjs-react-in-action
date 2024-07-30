import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { UserEntity } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repository = moduleFixture.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // 각 테스트는 독립된 환경에서 실행되어야 한다.
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('[GET] /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('[POST] /register', () => {
    it('회원가입에 성공한다', () => {
      // given
      const user = {
        name: '박대기',
        email: 'wating@kbs.co.kr',
        password: 'password',
      };

      // when + then
      return request(app.getHttpServer())
        .post('/users/register')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect({
          success: true,
        });
    });

    it('모든 필드(null 값을 허용하는) 값을 입력한 유저가 회원가입에 성공한다', () => {
      // given
      const user = {
        name: '박대기',
        email: 'wating@kbs.co.kr',
        password: 'password',
        image: '눈사람 투혼 박대기 기자',
        token: '토큰이 들어간다',
        tokenExp: 20240729,
      };

      // when + then
      return request(app.getHttpServer())
        .post('/users/register')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect({
          success: true,
        });
    });
  });
});
