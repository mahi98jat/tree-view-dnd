import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./TreeNode.css";
import { Activity } from "../types";

type TreeNodeProps = {
  id: string | number;
  data: Activity;
};

function TreeNode(props: TreeNodeProps) {
  const { id, data } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? "0.4" : "1",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="tree-node">
        <p>Activity: {data?.name} </p>
      </div>
    </div>
  );
}

export default TreeNode;
