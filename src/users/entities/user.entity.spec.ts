import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('UserEntity', () => {
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory',
          entities: [UserEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
    }).compile();

    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(async () => {
    // 각 테스트는 독립된 환경에서 실행되어야 한다.
    await repository.clear();
  });

  afterAll(async () => {
    // 데이터베이스 연결을 종료한다.
    await repository.manager.connection.destroy();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('필수 값을 넣은 유저를 추가한다', async () => {
    // given
    const user = {
      name: '박대기',
      email: 'wating@kbs.co.kr',
      password: 'password',
    };

    // when
    const sut = await repository.save(user);

    // then
    expect(sut.id).toBeDefined();
    expect(sut.name).toBe('박대기');
    expect(sut.email).toBe('wating@kbs.co.kr');
    expect(sut.password).toBe('password');
  });

  it('모든 필드(null 값을 허용하는) 값을 입력한 유저를 추가한다(image, token, tokenExp)', async () => {
    // given
    const user = {
      name: '박대기',
      email: 'wating@kbs.co.kr',
      password: 'password',
      image: '눈사람 투혼 박대기 기자',
      token: '토큰이 들어간다',
      tokenExp: 20240729,
    };

    // when
    const sut = await repository.save(user);

    // then
    expect(sut.id).toBeDefined();
    expect(sut.name).toBe('박대기');
    expect(sut.email).toBe('wating@kbs.co.kr');
    expect(sut.password).toBe('password');
    expect(sut.image).toBe('눈사람 투혼 박대기 기자');
    expect(sut.token).toBe('토큰이 들어간다');
    expect(sut.tokenExp).toBe(20240729);
  });
});
