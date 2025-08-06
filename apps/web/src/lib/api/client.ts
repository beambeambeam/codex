import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { env } from "@/env";
import { paths } from "@/lib/api/path";

export const fetchClient = createFetchClient<paths>({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  fetch: (request) => {
    return fetch(request, {
      credentials: "include",
    });
  },
});

export const $api = createClient(fetchClient);
