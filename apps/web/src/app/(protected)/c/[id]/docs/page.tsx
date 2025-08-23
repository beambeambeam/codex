import { FolderUpIcon, Table2Icon } from "lucide-react";

import DocumentTable from "@/app/(protected)/c/[id]/docs/_components/table";
import DocumentUploadForm from "@/app/(protected)/c/[id]/docs/_components/upload/form";

function DocsPage() {
  return (
    <section className="flex h-full flex-col gap-3 border-t-2 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="inline-flex items-center gap-0.5 text-xl font-bold">
          <FolderUpIcon className="size-5" />
          Upload New Documents
        </h1>
        <p className="text-muted-foreground/60 font-sans text-base">
          Ready to unleash your docs? Drag, drop, and let the magic happend.
          begin!
        </p>
        <DocumentUploadForm />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="inline-flex items-center gap-0.5 text-xl font-bold">
          <Table2Icon className="size-5" />
          Docuemts Table
        </h1>
        <p className="text-muted-foreground/60 font-sans text-base">
          Here is your documents table. View, sort, and manage your files with
          ease.
        </p>
        <DocumentTable />
      </div>
    </section>
  );
}
export default DocsPage;
