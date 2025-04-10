import React, { useState, useMemo, useCallback, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { BsPinAngle } from "react-icons/bs";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import Checkbox from "@/components/common/CheckBox";
import { DragIcon, PinnedIcon } from "@/assets/Svgs";
import IconButton from "@/components/common/IconButton";
import { MdClose } from "react-icons/md";

type Item = {
  id: number;
  label: string;
  isSelected: boolean;
  isSticky: boolean;
};

type Group = {
  id: number;
  name: string;
  meta: Item[];
};

type Props = {
  listConfig?: any;
  sortData?: any;
  listViews?: any;
  setListViews?: any;
  columns: any;
  setColumns: any;
};

const SortableItem = React.memo(
  ({
    item,
    handlePinToggle,
    handleClose,
  }: {
    item: Item;
    handlePinToggle: (itemId: number) => void;
    handleClose: (itemId: number) => void;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(
          "group flex justify-between items-center bg-white shadow-sm mb-2 p-2 border rounded"
        )}
      >
        <div
          className="flex flex-1 items-center gap-3"
          {...listeners}
          {...attributes}
        >
          <div
            className={
              item.isSticky
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
          >
            <DragIcon />
          </div>
          <span className="text-caption">{item.label}</span>
        </div>
        <div
          className={clsx(
            "flex items-center gap-2 transition-opacity",
            item.isSticky ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div className="flex items-center gap-1">
            <IconButton
              className={clsx("hover:bg-purple-20 p-1")}
              onClick={(e) => {
                e.stopPropagation();
                handlePinToggle(item.id);
              }}
            >
              {item.isSticky ? <PinnedIcon /> : <BsPinAngle />}
            </IconButton>
            <div className="bg-gray-300 w-[1px] h-5"></div>
            <IconButton
              className="hover:bg-red-200 p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleClose(item.id);
              }}
            >
              <MdClose />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
);

const ListSorting = ({
  listConfig,
  sortData,
  listViews,
  setListViews,
  columns,
  setColumns,
}: Props) => {
  useEffect(() => {
    if (listConfig) {
      const updatedListView = listConfig.groups.map((group) => ({
        ...group,
        meta: group.meta
          .map((meta) => {
            const effectiveCols =
              listConfig?.views[0]?.localColumns || listConfig.views[0].columns;
            const columnAvailable = effectiveCols.find(
              (column) => column?.listColumnsMeta?.name === meta?.name
            );

            return {
              ...meta,
              ...columnAvailable,
              isSelected: Boolean(columnAvailable),
              isSticky: columnAvailable?.isSticky, // Merge other properties from the filter state
              sequence: columnAvailable?.sequence || group?.meta?.length,
            };
          })
          .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)), // Sort by sequence in ascending order
      }));



      setListViews(updatedListView);
    }
  }, [listConfig, sortData]);

  // const handleCheckboxChange = (groupId: number, itemId: number) => {
  //   setListViews((prevGroups) =>
  //     prevGroups.map((group) =>
  //       group.id === groupId
  //         ? {
  //             ...group,
  //             meta: group.meta.map((item) =>
  //               item.id === itemId
  //                 ? { ...item, isSelected: !item.isSelected }
  //                 : item
  //             ),
  //           }
  //         : group
  //     )
  //   );
  // };

  const handleCheckboxChange = (groupId: number, itemId: number) => {
    setListViews((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              meta: group.meta.map((item) => {
                if (item.id === itemId) {
                  const effectiveCols =
                    listConfig.views[0].columns ||
                    listConfig?.views[0]?.localColumns;
                  // Find the respective column from the effective columns
                  const column = effectiveCols.find(
                    (col) => col?.listColumnsMeta?.name === item.name
                  );

                  return {
                    ...item,
                    isSelected: !item.isSelected,
                    ...column, // Add the column data (such as sequence, sticky, etc.)
                  };
                }
                return item;
              }),
            }
          : group
      )
    );
  };

  const handlePinToggle = useCallback((groupId: number, itemId: number) => {
    setListViews((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              meta: group.meta.map((item) =>
                item.id === itemId
                  ? { ...item, isSticky: !item.isSticky }
                  : item
              ),
            }
          : group
      )
    );
  }, []);

  const handleClose = (groupId: number, itemId: number) => {
    let updatedView = listViews.map((group) =>
      group.id === groupId
        ? {
            ...group,
            meta: group.meta.map((item) =>
              item.id === itemId ? { ...item, isSelected: false } : item
            ),
          }
        : group
    );

    setListViews(updatedView);
  };

  const handleDragEnd = ({ active, over }: any) => {
    setListViews((prevGroups) =>
      prevGroups.map((group) => {
        const oldIndex = group.meta.findIndex((item) => item.id === active.id);
        const newIndex = group.meta.findIndex((item) => item.id === over.id);

        // Move the item
        const updatedMeta = arrayMove(group.meta, oldIndex, newIndex);

        // Update the sequence field
        const reindexedMeta = updatedMeta.map((item: any, index) => ({
          ...item,
          sequence: index + 1, // Start sequence from 1
        }));

        return {
          ...group,
          meta: reindexedMeta,
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {listViews?.map((group) => (
        <div key={group.id} className="flex justify-between gap-8">
          {/* Left: Checkbox List */}
          <div className="flex-1">
            <h3 className="pb-4 border-b border-light-gray font-semibold text-caption text-grey-100">
              {group.name}
            </h3>
            <div className="flex flex-wrap gap-y-6 mt-4">
              {group.meta.map((item) => (
                <div
                  key={item.id}
                  className="flex items-baseline gap-2 mb-2 w-full lg:w-1/2"
                >
                  <Checkbox
                    checked={item.isSelected}
                    onChange={() => handleCheckboxChange(group.id, item.id)}
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Drag and Drop */}
          <div className="w-[320px]">
            <h3 className="mb-4 font-semibold text-caption text-grey-100">
              Sort order (drag & drop)
            </h3>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={group.meta
                  .filter((item) => item.isSelected)
                  .map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={clsx("p-4 border rounded min-h-[200px]")}>
                  {group.meta.filter((item) => item.isSelected).length > 0 ? (
                    group.meta
                      .filter((item) => item.isSelected)
                      .map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          handlePinToggle={(id) =>
                            handlePinToggle(group.id, id)
                          }
                          handleClose={(id) => handleClose(group.id, id)}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500">Drag items here</p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSorting;
