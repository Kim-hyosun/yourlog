import { useAppSelector } from '../../redux/hooks';

import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PostViewer from '../../components/post/PostViewer';
import PostActionButtons from '../../components/post/PostActionButtons';
import { setOriginalPost } from '../../redux/slices/writeSlice';
import {
  useReadPostQuery,
  useRemovePostMutation,
} from '../../redux/api/postsApi';

const PostViewerContainer = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // postId가 없으면 skip되므로 호출 시점엔 항상 string. ! 단언으로 좁힘.
  const {
    data: post,
    error,
    isFetching,
  } = useReadPostQuery(postId!, { skip: !postId });
  const [removePost, { isLoading: removing }] = useRemovePostMutation();
  const user = useAppSelector((state) => state.user.user);

  const onEdit = () => {
    if (!post) return;
    dispatch(setOriginalPost(post));
    navigate('/write');
  };

  const onRemove = async () => {
    if (removing || !postId) return;
    try {
      await removePost(postId).unwrap();
      navigate('/');
    } catch (e) {
      console.log(e);
      alert('포스트 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // user/post 둘 다 있어야 비교가 의미 있음.
  const ownPost = !!(user && post && user._id === post.user._id);

  return (
    <PostViewer
      post={post}
      loading={isFetching}
      error={error}
      actionButtons={
        ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
      }
    />
  );
};

export default PostViewerContainer;
