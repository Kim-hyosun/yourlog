import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Responsive from '../common/Responsive';
import Button from '../common/Button';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import palette from '../../lib/styles/palette';
import type { Post, User } from '../../types/models';

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
  padding-bottom: 5rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    margin: 0;
    color: ${palette.gray[9]};
    letter-spacing: -0.02em;
  }
`;

// 모바일 1열, 768px↑ 2열 그리드.
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const Card = styled.article`
  background: white;
  border: 1px solid ${palette.gray[2]};
  border-radius: 10px;
  padding: 1.5rem;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
    border-color: ${palette.gray[3]};
  }

  h3 {
    margin: 0;
    font-size: 1.375rem;
    line-height: 1.35;
    letter-spacing: -0.01em;

    a {
      color: ${palette.gray[9]};
      text-decoration: none;
      &:hover {
        color: ${palette.cyan[7]};
      }
    }
  }

  p {
    margin: 0.85rem 0 0;
    color: ${palette.gray[7]};
    font-size: 0.95rem;
    line-height: 1.6;

    /* 본문 미리보기 3줄로 잘라 보여줌 */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const Empty = styled.div`
  padding: 4rem 1rem;
  text-align: center;
  color: ${palette.gray[6]};
`;

// 저장된 Quill HTML에서 태그를 모두 제거해 텍스트 미리보기를 만든다.
const toPreview = (html: string) =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\s+/g, ' ')
    .trim();

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const { publishedDate, user, tags, title, body, _id } = post;
  return (
    <Card>
      <h3>
        <Link to={`/@${user.username}/${_id}`}>{title}</Link>
      </h3>
      <SubInfo
        username={user.username}
        publishedDate={publishedDate}
        hasMarginTop
      />
      <p>{toPreview(body)}</p>
      <Tags tags={tags} />
    </Card>
  );
};

interface PostListProps {
  posts?: Post[];
  loading: boolean;
  error?: unknown;
  // truthy면 "새 글 작성하기" 버튼 노출. 로그인 사용자(User) 또는 null.
  showWriteButton?: User | null;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
  showWriteButton,
}) => {
  if (error) {
    return (
      <PostListBlock>
        <Empty>에러가 발생했습니다.</Empty>
      </PostListBlock>
    );
  }

  return (
    <PostListBlock>
      <TopBar>
        <h2>글 목록</h2>
        {showWriteButton && (
          <Button cyan to="/write">
            새 글 작성하기
          </Button>
        )}
      </TopBar>

      {!loading && posts && posts.length === 0 && (
        <Empty>아직 작성된 글이 없어요. 첫 글을 남겨보세요.</Empty>
      )}

      {!loading && posts && posts.length > 0 && (
        <Grid>
          {posts.map((post) => (
            <PostItem post={post} key={post._id} />
          ))}
        </Grid>
      )}
    </PostListBlock>
  );
};

export default PostList;
