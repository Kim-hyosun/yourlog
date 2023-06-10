import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
  //비밀번호를 파라미터로 받아서 hashedPassword로 값설정
  //인스턴스메서드
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  //파라미터로 받은 비번이 해당계정 비번하고 일치여부 검증
  //인스턴스메서드
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; //비밀번호 비교해서 true or false 반환
};

UserSchema.statics.findByUsername = function (username) {
  //username으로 데이터 찾을수 있게 해줌
  //스테틱메서드
  return this.findOne({ username }); //this는 모델User를 가리킴
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  //토큰생성
  const token = jwt.sign(
    //첫번째 파라미터에는 토큰에 집어넣고 싶은 데이터
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, //두번째 파라미터에는 JWT암호
    {
      expiresIn: '7d', //7일간 유효
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
