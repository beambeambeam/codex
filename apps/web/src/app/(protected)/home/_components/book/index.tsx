"use client";

import { useRouter } from "next/navigation";

import { Book } from "@/app/(protected)/home/_components/book/book";
import AvatarGroup from "@/components/ui/avatar-group";
import { Loader } from "@/components/ui/loader";
import { Scroller } from "@/components/ui/scroller";
import { useQueryFetchClient } from "@/lib/api/client";

function CollectionBooks() {
  const { data, isPending } = useQueryFetchClient.useQuery(
    "get",
    "/api/v1/collections",
  );

  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader
          size="lg"
          text="Please wait. Summoning your collections..."
          variant="text-shimmer"
        />
      </div>
    );
  }

  return (
    <div className="lg:ml-30 ml-20 flex h-full w-full flex-col gap-3 rounded-r-lg border-b-0 border-l-2 pt-4">
      <h1 className="px-4 text-xl">All Collections.</h1>
      <div className="border-t-2"></div>
      <Scroller className="flex h-full cursor-pointer flex-col flex-wrap gap-x-2 gap-y-4 p-2 px-4 pr-12">
        {data?.map((item, idx) => (
          <div
            key={item.id ?? idx}
            onDoubleClick={() => router.push(`c/${item.id}`)}
            onMouseEnter={() => router.prefetch(`c/${item.id}`)}
          >
            <Book depth={4} color="#F04E23">
              <div className="mb-2 grid gap-3 p-3 px-0">
                <div className="flex">
                  <h1 className="text-base font-semibold">{item.title}</h1>
                </div>
                <p className="text-xs">{item.description}</p>
                <div className="flex">
                  <AvatarGroup
                    size="sm"
                    items={
                      item.contributor
                        ? item.contributor.map((c, idx) => ({
                            id: idx,
                            name: c.display,
                            image: c.imgUrl ?? "",
                          }))
                        : []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
            </Book>
          </div>
        ))}
      </Scroller>
    </div>
  );
}
export default CollectionBooks;
