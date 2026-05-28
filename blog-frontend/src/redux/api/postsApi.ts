import { baseApi } from './baseApi';
import type {
  Post,
  ListPostsArgs,
  ListPostsResponse,
  WritePostArgs,
  UpdatePostArgs,
} from '../../types/models';

// 응답 헤더의 last-page는 페이지네이션에 필요해서 transformResponse로 같이 묶는다.
export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPosts: build.query<ListPostsResponse, ListPostsArgs>({
      query: ({ page = 1, username, tag }) => ({
        url: '/api/posts',
        params: { page, username, tag },
      }),
      transformResponse: (response: Post[], meta) => ({
        posts: response,
        lastPage: parseInt(meta?.response?.headers.get('last-page') || '1', 10),
      }),
      providesTags: ['PostList'],
    }),
    readPost: build.query<Post, string>({
      query: (id) => `/api/posts/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Post', id }],
    }),
    writePost: build.mutation<Post, WritePostArgs>({
      query: ({ title, body, tags }) => ({
        url: '/api/posts',
        method: 'POST',
        body: { title, body, tags },
      }),
      invalidatesTags: ['PostList'],
    }),
    updatePost: build.mutation<Post, UpdatePostArgs>({
      query: ({ id, title, body, tags }) => ({
        url: `/api/posts/${id}`,
        method: 'PATCH',
        body: { title, body, tags },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Post', id },
        'PostList',
      ],
    }),
    removePost: build.mutation<void, string>({
      query: (id) => ({ url: `/api/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PostList'],
    }),
  }),
});

export const {
  useListPostsQuery,
  useReadPostQuery,
  useWritePostMutation,
  useUpdatePostMutation,
  useRemovePostMutation,
} = postsApi;
