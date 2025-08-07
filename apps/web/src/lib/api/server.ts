import { cookies } from "next/headers";
import createFetchClient from "openapi-fetch";

import { env } from "@/env";
import { paths } from "@/lib/api/path";

export const fetchServer = createFetchClient<paths>({
  baseUrl: env.API_URL,
  fetch: async (request) => {
    return fetch(request, {
      headers: {
        cookie: (await cookies()).toString(),
      },
      cache: "no-store",
      credentials: "include",
    });
  },
});
