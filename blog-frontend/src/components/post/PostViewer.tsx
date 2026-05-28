import React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import type { Post } from '../../types/models';

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
  padding-bottom: 6rem;
  max-width: 720px;
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 2.5rem;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.75rem;
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 0 0 1.25rem;
    color: ${palette.gray[9]};
  }
`;

// 본문은 글 가독성을 위해 line-height/letter-spacing 충분히, 폰트 살짝 키움.
const PostContent = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${palette.gray[8]};

  p {
    margin: 1.1em 0;
  }
  h1,
  h2,
  h3 {
    line-height: 1.3;
    letter-spacing: -0.01em;
    margin-top: 1.6em;
  }
  ul,
  ol {
    padding-left: 1.5rem;
  }
  blockquote {
    border-left: 3px solid ${palette.gray[3]};
    padding: 0.25rem 0 0.25rem 1rem;
    margin: 1em 0;
    color: ${palette.gray[7]};
  }
  img {
    max-width: 100%;
    border-radius: 6px;
  }
`;

type RTKError = FetchBaseQueryError | SerializedError;

interface PostViewerProps {
  post?: Post;
  // RTK Query 에러 그대로 전달받음.
  error?: RTKError;
  loading: boolean;
  actionButtons?: React.ReactNode;
}

const PostViewer: React.FC<PostViewerProps> = ({
  post,
  error,
  loading,
  actionButtons,
}) => {
  if (error) {
    // SerializedError에는 status가 없고, FetchBaseQueryError만 status를 가짐.
    const status = 'status' in error ? error.status : undefined;
    if (status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류 발생!</PostViewerBlock>;
  }

  if (loading || !post) return null;

  const { title, body, user, publishedDate, tags } = post;
  return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} | Your log</title>
      </Helmet>

      <PostHead>
        <h1>{title}</h1>
        <SubInfo
          username={user.username}
          publishedDate={publishedDate}
          hasMarginTop
        />
        <Tags tags={tags} />
      </PostHead>
      {actionButtons}
      <PostContent
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
      />
    </PostViewerBlock>
  );
};

export default PostViewer;
