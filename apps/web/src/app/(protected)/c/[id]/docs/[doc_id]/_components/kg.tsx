import { CircleOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { components } from "@/lib/api/path";

interface DocumentKnowledgeGraphProps {
  knowledge_graph: components["schemas"]["DocumentResponse"]["knowledge_graph"];
  type: string; //mimetype
}

function DocumentKnowledgeGraph(props: DocumentKnowledgeGraphProps) {
  if (!props.knowledge_graph) {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2">
        <Loader
          text="No knowledge graph found"
          variant="text-blink"
          className="text-md"
        />
        <Button
          size="sm"
          disabled={
            !["application/pdf", "text/plain"].includes(
              props.type.toLowerCase(),
            ) && !props.type.toLowerCase().includes("text")
          }
          variant="secondary"
        >
          {!["application/pdf", "text/plain"].includes(props.type.toLowerCase())
            ? !props.type.toLowerCase().includes("text") &&
              "Knowledge graph creation is not supported for this file type."
            : "Generate a knowledge graph for this document"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-40 w-full flex-col items-center justify-center gap-1 rounded-lg border-2">
      <CircleOffIcon />
      <p>Not avaliable yet.</p>
    </div>
  );
}
export default DocumentKnowledgeGraph;
