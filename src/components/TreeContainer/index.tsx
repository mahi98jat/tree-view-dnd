import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  // DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TreeNode from "./TreeNode";

import groups from "../groups.json";
import activities from "../Activity.json";
import SubTree from "./ContainerNode";
import { Activity, Group } from "../types";

const TreeContainer = () => {
  const groupItems = groups.filter((group) => !group.parentGroupId);

  const activityItems = activities.filter(
    (activity) => !activity?.parentGroupId
  );

  const rootItemIds = [
    ...groupItems.map((ele) => ele.activityGroupId),
    ...activityItems.map((ele) => ele?.activityDefinitionId),
  ];

  const [activeId, setActiveId] = useState<string | number>();

  const [itemIds, setItemIds] = useState<string[]>(rootItemIds);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groupData: Record<string, Group> = groupItems?.reduce((acc, group) => {
    return { ...acc, [group?.activityGroupId]: { ...group } };
  }, {});

  const activitiesData: Record<string, Activity> = {
    ...activityItems.reduce((acc, activity) => {
      return { ...acc, [activity?.activityDefinitionId]: activity };
    }, {}),
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      sensors={sensors}
    >
      <SortableContext items={itemIds} id="root">
        {itemIds.map((val) => {
          if (groupData[val]) {
            return <SubTree id={val} data={groupData[val]} />;
          }

          return <TreeNode id={val} data={activitiesData[val]} />;
        })}
      </SortableContext>
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active?.id);
  }

  function onDragOver(event: DragOverEvent) {
    console.log(event?.over, event?.active, "on drag over");
  }

  function handleDragEnd(event: DragEndEvent) {
    // console.log("drag end trigger", event?.active?.data);
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setItemIds((items) => {
        const oldIndex = items.indexOf(active?.id);
        const newIndex = items.indexOf(over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};

export { TreeContainer };
