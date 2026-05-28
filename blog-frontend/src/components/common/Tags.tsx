import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

// 태그를 알약(pill) 형태 칩으로 표시.
const TagsBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;

  .tag {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    background: ${palette.gray[1]};
    color: ${palette.cyan[7]};
    border-radius: 999px;
    font-size: 0.85rem;
    line-height: 1.4;
    text-decoration: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: ${palette.cyan[1]};
      color: ${palette.cyan[8]};
    }
  }
`;

interface TagsProps {
  tags?: string[];
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
  if (!tags?.length) return null;
  return (
    <TagsBlock>
      {tags.map((tag) => (
        <Link className="tag" to={`/posts?tag=${tag}`} key={tag}>
          #{tag}
        </Link>
      ))}
    </TagsBlock>
  );
};

export default Tags;
