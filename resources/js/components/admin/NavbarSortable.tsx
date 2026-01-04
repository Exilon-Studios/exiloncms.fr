/**
 * NavbarSortable - Drag and drop navbar element ordering
 */

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2, ExternalLink } from 'lucide-react';
import { NavbarElement } from '@/types';
import { trans } from '@/lib/i18n';

interface SortableItemProps {
  id: string;
  element: NavbarElement;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

interface NavbarSortableProps {
  elements: NavbarElement[];
}

function SortableItem({ id, element, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle name - now always a string from backend
  const displayName = element.name || 'Sans nom';

  const type = typeof element.type === 'string' ? element.type : String(element.type || 'link');
  const children = Array.isArray(element.elements) ? element.elements : [];

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-all">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-medium truncate">{displayName}</span>
          {element.icon && (
            <i className={`${element.icon} text-xs text-muted-foreground shrink-0`}></i>
          )}
        </div>

        {/* New Tab Indicator */}
        {element.new_tab && (
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(element.id)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Éditer
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(element.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Children (dropdown items) */}
      {children.length > 0 && (
        <div className="ml-8 mt-2 space-y-2">
          {children.map((child) => (
            <SortableItem
              key={child.id}
              id={`${element.id}-${child.id}`}
              element={child}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavbarSortable({ elements }: NavbarSortableProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<NavbarElement[]>(elements);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle nesting (dropdown items)
    if (activeId !== overId) {
      setItems((items) => {
        const activeItem = findItem(items, activeId);
        const overItem = findItem(items, overId);

        if (!activeItem || !overItem) return items;

        // If dragging over a dropdown item, add to its children
        if (overItem.type === 'dropdown' && activeItem.parent_id !== overItem.id) {
          return moveItemToParent(items, activeId, overId);
        }

        return items;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = findIndex(items, active.id as string);
        const newIndex = findIndex(items, over.id as string);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Save order to server
        saveOrder(newItems);

        return newItems;
      });
    }
  };

  const findItem = (items: NavbarElement[], id: string): NavbarElement | null => {
    for (const item of items) {
      if (String(item.id) === id) return item;
      if (item.elements) {
        const found = findItem(item.elements, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findIndex = (items: NavbarElement[], id: string): number => {
    for (let i = 0; i < items.length; i++) {
      if (String(items[i].id) === id) return i;
      if (items[i].elements) {
        const foundIndex = findIndex(items[i].elements!, id);
        if (foundIndex !== -1) return foundIndex;
      }
    }
    return -1;
  };

  const moveItemToParent = (items: NavbarElement[], itemId: string, parentId: string): NavbarElement[] => {
    // Implementation for moving item to dropdown parent
    return items;
  };

  const saveOrder = (items: NavbarElement[]) => {
    const order = items.map((item, index) => ({
      id: item.id,
      children: item.elements?.map((child, childIndex) => ({
        id: child.id,
        position: childIndex,
      })) || [],
    }));

    router.post(route('admin.navbar-elements.update-order'), { order }, {
      preserveScroll: true,
    });
  };

  const handleEdit = (id: number) => {
    router.get(route('admin.navbar-elements.edit', id));
  };

  const handleDelete = (id: number) => {
    if (confirm(trans('admin.navbar.index.confirm_delete'))) {
      router.delete(route('admin.navbar-elements.destroy', id), {
        onSuccess: () => {
          router.get(route('admin.navbar-elements.index'));
        },
      });
    }
  };

  const activeItem = activeId ? findItem(items, activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((e) => String(e.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              <p>Aucun élément de navigation</p>
            </div>
          ) : (
            items.map((element) => (
              <SortableItem
                key={element.id}
                id={String(element.id)}
                element={element}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <div className="flex items-center gap-3 p-3 bg-card border border-primary rounded-lg shadow-lg opacity-80">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {activeItem.name || 'Sans nom'}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
