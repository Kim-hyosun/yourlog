import { useAppSelector } from '../../redux/hooks';

import Header from '../../components/common/Header';
import { useLogoutMutation } from '../../redux/api/authApi';

// 로그아웃 응답은 userSlice의 logout.matchFulfilled가 받아 user/localStorage를 정리한다.
const HeaderContainer = () => {
  const user = useAppSelector((state) => state.user.user);
  const [logout] = useLogoutMutation();
  const onLogout = () => {
    logout();
  };
  return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
