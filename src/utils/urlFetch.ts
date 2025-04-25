type FetchOptions<TBody> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: TBody;
  headers?: Record<string, string>;
  version?: 'v1';
};

export async function urlFetch<TResponse, TBody = Record<string, unknown>>(
  url: string,
  fetchOptions: FetchOptions<TBody> = {},
): Promise<TResponse> {
  const { method = 'GET', body, version = 'v1', headers = {} } = fetchOptions;

  const cleanedUrl = url.startsWith('/') ? url : `/${url}`;
  const res = await fetch(`/api/${version}${cleanedUrl}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  return res.json() as Promise<TResponse>;
}
