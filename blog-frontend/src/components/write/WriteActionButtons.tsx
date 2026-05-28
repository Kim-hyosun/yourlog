import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const WriteActionButtonsBlock = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
  button + button {
    margin-left: 0.5rem;
  }
`;

/* TagBox에서 쓰는 버튼과 일치하는 높이로 설정& 서로 간의 여백줌 */
const StyledButton = styled(Button)`
  height: 2.125rem;
  & + & {
    margin-left: 0.5rem;
  }
`;

interface WriteActionButtonsProps {
  onCancel: () => void;
  onPublish: () => void;
  isEdit: boolean;
  publishing: boolean;
}

const WriteActionButtons: React.FC<WriteActionButtonsProps> = ({
  onCancel,
  onPublish,
  isEdit,
  publishing,
}) => {
  return (
    <WriteActionButtonsBlock>
      <StyledButton cyan onClick={onPublish} disabled={publishing}>
        {publishing ? '저장 중…' : `포스트 ${isEdit ? '수정' : '등록'}`}
      </StyledButton>
      <StyledButton onClick={onCancel} disabled={publishing}>
        취소
      </StyledButton>
    </WriteActionButtonsBlock>
  );
};

export default WriteActionButtons;
