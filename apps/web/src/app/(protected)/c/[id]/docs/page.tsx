import { SidebarTrigger } from "@/components/ui/sidebar";

function DocsPage() {
  return (
    <>
      <header className="group-has-data-[collapsible=offcanvas]/sidebar-wrapper:h-12 h-16.5 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
      <section className="flex h-full gap-2 border-t-2 px-4 pt-2"></section>
    </>
  );
}
export default DocsPage;
