// yourlog API의 OpenAPI 3.0 스펙. 엔드포인트가 추가/변경되면 이 파일을 수정.
// koa2-swagger-ui가 이 객체를 그대로 받아 /docs UI를 그려준다.

const User = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
  },
  required: ['_id', 'username'],
};

const Post = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    body: { type: 'string', description: 'Quill HTML' },
    tags: { type: 'array', items: { type: 'string' } },
    publishedDate: { type: 'string', format: 'date-time' },
    user: { $ref: '#/components/schemas/User' },
  },
};

const Credentials = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 20 },
    password: { type: 'string' },
  },
};

const PostInput = {
  type: 'object',
  required: ['title', 'body', 'tags'],
  properties: {
    title: { type: 'string' },
    body: { type: 'string', description: 'HTML (백엔드에서 sanitize-html 적용)' },
    tags: { type: 'array', items: { type: 'string' } },
  },
};

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'yourlog API',
    version: '1.0.0',
    description:
      'Koa + MongoDB 블로그 API. 인증은 httpOnly 쿠키(access_token, JWT 7일). 프로덕션은 SameSite=None; Secure.',
  },
  servers: [
    { url: '/', description: 'Same origin (현재 호스트)' },
  ],
  tags: [
    { name: 'Auth', description: '회원가입/로그인/세션' },
    { name: 'Posts', description: '블로그 글 CRUD' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
      },
    },
    schemas: { User, Post, Credentials, PostInput },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: '회원가입',
        description:
          '성공 시 access_token 쿠키 발급. IP당 15분 20회 레이트리밋(로컬 한정).',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Credentials' } },
          },
        },
        responses: {
          200: {
            description: '가입 완료',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          400: { description: '입력 검증 실패' },
          409: { description: '이미 존재하는 아이디' },
          429: { description: '레이트리밋 초과' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: '로그인',
        description: '성공 시 access_token 쿠키 발급. IP당 15분 20회 레이트리밋.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Credentials' } },
          },
        },
        responses: {
          200: {
            description: '로그인 성공',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          401: { description: '아이디/비밀번호 불일치' },
          429: { description: '레이트리밋 초과' },
        },
      },
    },
    '/api/auth/check': {
      get: {
        tags: ['Auth'],
        summary: '세션 검증',
        description: '쿠키 유효 시 사용자 정보 반환. 만료가 임박하면 토큰 자동 갱신.',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: '로그인 중',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          401: { description: '비로그인' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: '로그아웃',
        description: 'access_token 쿠키 제거.',
        responses: {
          204: { description: '쿠키 제거 완료' },
        },
      },
    },
    '/api/posts': {
      get: {
        tags: ['Posts'],
        summary: '글 목록',
        description:
          '필터: page/username/tag. 응답 헤더 `last-page`에 마지막 페이지 번호.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'username', in: 'query', schema: { type: 'string' } },
          { name: 'tag', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: '글 배열',
            headers: {
              'last-page': {
                schema: { type: 'integer' },
                description: '마지막 페이지 번호',
              },
            },
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: '글 작성',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PostInput' } },
          },
        },
        responses: {
          200: {
            description: '작성 완료',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Post' } },
            },
          },
          400: { description: '입력 검증 실패' },
          401: { description: '비로그인' },
        },
      },
    },
    '/api/posts/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      get: {
        tags: ['Posts'],
        summary: '글 단건',
        responses: {
          200: {
            description: 'Post',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Post' } },
            },
          },
          400: { description: '잘못된 id 형식' },
          404: { description: '없음' },
        },
      },
      patch: {
        tags: ['Posts'],
        summary: '글 수정 (작성자 전용)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PostInput' } },
          },
        },
        responses: {
          200: {
            description: '수정 완료',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Post' } },
            },
          },
          400: { description: '입력 검증 실패' },
          401: { description: '비로그인' },
          403: { description: '작성자 아님' },
          404: { description: '없음' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: '글 삭제 (작성자 전용)',
        security: [{ cookieAuth: [] }],
        responses: {
          204: { description: '삭제 완료' },
          401: { description: '비로그인' },
          403: { description: '작성자 아님' },
          404: { description: '없음' },
        },
      },
    },
  },
};

export default openApiSpec;
