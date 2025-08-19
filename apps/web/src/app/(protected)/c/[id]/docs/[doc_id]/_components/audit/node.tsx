import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
} from "@/components/base-node";
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
import { components } from "@/lib/api/path";

interface DocumentAuditNodeProps {
  data: components["schemas"]["DocumentAudit"];
}

export const DocumentAuditNode = memo((props: DocumentAuditNodeProps) => (
  <BaseNode className="w-72">
    {props.data.action_type != "CREATE" && (
      <Handle type="source" position={Position.Top} />
    )}
    <BaseNodeHeader className="flex items-center justify-between border-b">
      <div className="flex w-full justify-between">
        <span>{props.data.action_type}</span>
        <RelativeTimeCard date={new Date(props.data.timestamp ?? "")} />
      </div>
    </BaseNodeHeader>
    <BaseNodeContent>
      <div className="font-sarabun">
        <p className="text-muted-foreground text-xs">Previous Values</p>
        <div className="p-2 text-xs">
          {props.data.old_values ? (
            <ul className="list-disc pl-4">
              {Object.entries(props.data.old_values)
                .filter(
                  ([key]) =>
                    !["user_id", "collection_id", "file_id"].includes(key),
                )
                .map(([key, value]) => (
                  <li key={key}>
                    <span className="font-semibold">{key}:</span>{" "}
                    <span>{String(value)}</span>
                  </li>
                ))}
            </ul>
          ) : (
            "No previous values"
          )}
        </div>
        <p className="text-muted-foreground text-xs">Updated Values</p>
        <div className="p-2 text-xs">
          {props.data.new_values ? (
            <ul className="list-disc pl-4">
              {Object.entries(props.data.new_values)
                .filter(
                  ([key]) =>
                    !["user_id", "collection_id", "file_id"].includes(key),
                )
                .map(([key, value]) => (
                  <li key={key}>
                    <span className="font-semibold">{key}:</span>{" "}
                    <span>{String(value)}</span>
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      </div>
    </BaseNodeContent>
    <Handle type="source" position={Position.Bottom} />
  </BaseNode>
));

DocumentAuditNode.displayName = "DocumentAuditNode";
