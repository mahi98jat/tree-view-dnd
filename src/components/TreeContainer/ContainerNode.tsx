import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import groups from "../groups.json";
import activities from "../Activity.json";
import { useState } from "react";
import { Activity, Group } from "../types";
import TreeNode from "./TreeNode";

type SubTreeProps = {
  id: string;
  data: Group;
};

function SubTree(props: SubTreeProps) {
  const { id } = props;
  const data = groups?.filter((group) => group?.activityGroupId === id)[0];

  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  const groupItems = groups.filter((group) => group.parentGroupId === id);

  const activityItems = activities.filter(
    (activity) => activity?.parentGroupId === id
  );

  const itemIds = [
    ...groups
      .filter((group) => group.parentGroupId === id)
      .map((ele) => ele.activityGroupId),
    ...activities
      .filter((activity) => activity?.parentGroupId === id)
      .map((ele) => ele?.activityDefinitionId),
  ];

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

  const groupData: Record<string, Group> = groupItems?.reduce((acc, group) => {
    return { ...acc, [group?.activityGroupId]: { ...group } };
  }, {});

  const activitiesData: Record<string, Activity> = {
    ...activityItems.reduce((acc, activity) => {
      return { ...acc, [activity?.activityDefinitionId]: activity };
    }, {}),
  };

  return (
    <SortableContext items={itemIds} id={id} key={id}>
      <div className="group-wrapper" ref={setNodeRef} style={style}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div {...attributes} {...listeners}>
            Drag
          </div>
          <h3
            style={{ color: "red", border: "1px solid red", cursor: "pointer" }}
            onClick={() => setIsCollapse(!isCollapse)}
          >
            Sub Tree {data?.name}
          </h3>
        </div>
        {isCollapse ? (
          <>
            {itemIds.map((val) => {
              if (groupData[val]) {
                return <SubTree id={val} data={groupData[val]} />;
              }

              return <TreeNode id={val} data={activitiesData[val]} />;
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </SortableContext>
  );
}

export default SubTree;
