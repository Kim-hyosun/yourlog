const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    //!ctx.request.user
    ctx.status = 401; // Unauthorized
    ctx.body = 'Unauthorized: 로그인이 필요합니다';
    return;
  }
  return next();
};
/* 
checkLoggedIn미들웨어는 
로그인상태가 아니면 401 HTTPstatus를 반환하고,
로그인상태면 그다음 미들웨어를 실행한다 
 */
export default checkLoggedIn;
