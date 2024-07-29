import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * id: 기본키 1씩 증가
 * name: 최대 50글자
 * email: 중복되지 않는 유일한 값
 * password: 최소 5글자
 * role: 유저, 관리자
 * token: 유저 유효성 검사에 사용
 * tokenExp: 토큰 유효기간
 */
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  tokenExp: number;
}
