import Joi from 'joi';
import User from '../../models/user';

/* POST /api/auth/register
{
	username:'jireh',
	password:'mypass123'
} 
*/
export const register = async (ctx) => {
  //회원가입
  //Request Body 검증하기
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { username, password } = ctx.request.body;
  try {
    //username이 이미 존재 하는지 확인 = 중복계정생기면 안되니까
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; //Conflict
      return;
    }

    const user = new User({
      username,
    });
    await user.setPassword(password); //비밀번호 설정
    await user.save(); //데이터베이스에 저장

    //응답할 데이터에서 hashedPassword필드 제거
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      //httpOnly가 활성화된 쿠키에 토큰을 담아줘
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 
POST api/auth/login 
{
	username:'jireh',
	password:'mypass123'
}
{
   "username":"jireh1234",
   "password":"mypass1234"
}
*/

export const login = async (ctx) => {
  //로그인
  const { username, password } = ctx.request.body;

  //username, password가 없으면 에러발생시키기
  if (!username || !password) {
    ctx.status = 401; //Unauthorized
    return;
  }
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      //계정이 존재하지 않으면 에러발생시키기
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    //잘못된 비밀번호이면 에러발생시키기
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      //httpOnly가 활성화된 쿠키에 토큰을 담아줘
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 
GET api/auth/check 
jwtMiddleware에서 검증
*/
export const check = async (ctx) => {
  //로그인 상태 확인
  const { user } = ctx.state;
  if (!user) {
    //로그인 중이 아니면
    ctx.status = 401; //Unauthorized
    return;
  }
  ctx.body = user;
};

/* 
POST api/auth/logout 
쿠키를 지워주는 원리
*/
export const logout = async (ctx) => {
  //로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204; //No content
};
