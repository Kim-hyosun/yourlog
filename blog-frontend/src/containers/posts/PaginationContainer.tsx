import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/posts/Pagination';
import { useListPostsQuery } from '../../redux/api/postsApi';

// PostListContainer와 동일 인자로 호출 → RTK Query 캐시 공유.
const PaginationContainer = () => {
  const [searchParams] = useSearchParams();
  const { username } = useParams();
  const tag = searchParams.get('tag') || undefined;
  const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;

  const { data, isFetching } = useListPostsQuery({ username, tag, page });

  if (!data?.posts || isFetching) return null;

  return (
    <Pagination
      tag={tag}
      username={username}
      page={page}
      lastPage={data.lastPage}
    />
  );
};

export default PaginationContainer;
