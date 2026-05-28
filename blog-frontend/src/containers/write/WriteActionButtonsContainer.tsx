import { useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import WriteActionButtons from '../../components/write/WriteActionButtons';
import {
  useWritePostMutation,
  useUpdatePostMutation,
} from '../../redux/api/postsApi';

const WriteActionButtonsContainer = () => {
  const navigate = useNavigate();
  const { title, body, tags, originalPostId } = useAppSelector(({ write }) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    originalPostId: write.originalPostId,
  }));

  // updatePost는 originalPostId가 있을 때만 호출하므로 분기 시점에 string으로 좁혀짐.

  const [writePost, writeResult] = useWritePostMutation();
  const [updatePost, updateResult] = useUpdatePostMutation();
  const publishing = writeResult.isLoading || updateResult.isLoading;
  const post = writeResult.data || updateResult.data;
  const postError = writeResult.error || updateResult.error;

  const onPublish = () => {
    if (publishing) return; // 중복 제출 방지
    if (originalPostId) {
      updatePost({ id: originalPostId, title, body, tags });
    } else {
      writePost({ title, body, tags });
    }
  };

  const onCancel = () => navigate(-1);

  useEffect(() => {
    if (post) {
      const { _id, user } = post;
      navigate(`/@${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
      alert('포스트 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [navigate, post, postError]);

  return (
    <WriteActionButtons
      onPublish={onPublish}
      onCancel={onCancel}
      isEdit={!!originalPostId}
      publishing={publishing}
    />
  );
};

export default WriteActionButtonsContainer;
