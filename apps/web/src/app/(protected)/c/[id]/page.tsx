import CollectionSidebar from "@/app/(protected)/c/[id]/_components/side-bar";
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
        <header className="group-has-data-[collapsible=offcanvas]/sidebar-wrapper:h-12 h-16.5 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <section className="flex h-full gap-2 border-t-2 px-4 pt-2"></section>
      </SidebarInset>
    </SidebarProvider>
  );
}
export default CollectionPage;
