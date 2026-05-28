/* title과 body를 리덕스 스토어에서 불러와 Editor에 전달함 */
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Editor from '../../components/write/Editor';
import { initialize, changeField } from '../../redux/slices/writeSlice';
import { useAppSelector } from '../../redux/hooks';
import type { ChangeFieldPayload } from '../../types/models';

const EditorContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { title, body } = useAppSelector(({ write }) => ({
    title: write.title,
    body: write.body,
  }));
  const onChangeField = useCallback(
    (payload: ChangeFieldPayload) => dispatch(changeField(payload)),
    [dispatch],
  );

  // 언마운트 시 폼 초기화
  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;
