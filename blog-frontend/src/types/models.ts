// 서버 응답 모델. mongoose 스키마와 일치하는 최소 형태만 선언한다.
export interface User {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  publishedDate: string;
  user: User;
}

// ── postsApi 인자/응답 ──────────────────────────────
export interface ListPostsArgs {
  page?: number;
  username?: string;
  tag?: string;
}

export interface ListPostsResponse {
  posts: Post[];
  lastPage: number;
}

export interface WritePostArgs {
  title: string;
  body: string;
  tags: string[];
}

export interface UpdatePostArgs extends WritePostArgs {
  id: string;
}

// ── writeSlice 상태/액션 ────────────────────────────
export interface WriteFormState {
  title: string;
  body: string;
  tags: string[];
  originalPostId: string | null;
}

// changeField는 키별로 허용 값이 다르므로 union으로 좁힌다.
export type ChangeFieldPayload =
  | { key: 'title'; value: string }
  | { key: 'body'; value: string }
  | { key: 'tags'; value: string[] };
