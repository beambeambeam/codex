import CollectionSidebar from "@/app/(protected)/c/[id]/_components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function CollectionPage() {
  return (
    <SidebarProvider>
      <CollectionSidebar />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <section className="flex h-full gap-2 px-4 pt-2">d</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
export default CollectionPage;
