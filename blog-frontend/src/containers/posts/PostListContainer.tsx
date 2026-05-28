import { useAppSelector } from '../../redux/hooks';
import React from 'react';

import { useParams, useSearchParams } from 'react-router-dom';
import PostList from '../../components/posts/PostList';
import { useListPostsQuery } from '../../redux/api/postsApi';

// 같은 쿼리(같은 인자)는 RTK Query가 캐시 키로 dedupe하므로, Pagination도 동일한
// 인자로 호출하면 추가 네트워크 요청 없이 lastPage를 얻는다.
const PostListContainer = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') || undefined;
  const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;

  const { data, error, isFetching } = useListPostsQuery({
    username,
    tag,
    page,
  });
  const user = useAppSelector((state) => state.user.user);

  return (
    <PostList
      loading={isFetching}
      error={error}
      posts={data?.posts}
      showWriteButton={user}
    />
  );
};

export default PostListContainer;
