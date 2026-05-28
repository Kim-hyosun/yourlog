import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  ChangeFieldPayload,
  Post,
  WriteFormState,
} from '../../types/models';

// 글 작성/수정 페이지의 폼 상태. 서버 통신은 postsApi mutation이 담당하므로
// 여기엔 form 입력값과 "수정 중인 원본 post id"만 둔다.
const initialState: WriteFormState = {
  title: '',
  body: '',
  tags: [],
  originalPostId: null,
};

const writeSlice = createSlice({
  name: 'write',
  initialState,
  reducers: {
    initialize: () => initialState,
    changeField(state, action: PayloadAction<ChangeFieldPayload>) {
      const { key, value } = action.payload;
      // union이라 한 줄로 할당하면 TS가 좁히지 못해 케이스별 분기.
      if (key === 'tags') state.tags = value;
      else state[key] = value;
    },
    setOriginalPost(state, action: PayloadAction<Post>) {
      const { title, body, tags, _id } = action.payload;
      state.title = title;
      state.body = body;
      state.tags = tags;
      state.originalPostId = _id;
    },
  },
});

export const { initialize, changeField, setOriginalPost } = writeSlice.actions;
export default writeSlice.reducer;
