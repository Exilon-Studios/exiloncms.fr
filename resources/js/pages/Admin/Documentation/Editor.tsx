import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Folder, FolderOpen, Save, Eye, ChevronRight, File, FileCode, Home, FolderPlus, Trash2, Plus, MoreVertical, Loader2, Globe, Languages, FileEdit } from 'lucide-react';
import { useState, FormEvent, useEffect, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';
import { trans } from '@/lib/i18n';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  locale: string;
  availableLocales: string[];
  categories: any[];
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  slug?: string;
  id?: string;
}

interface EditingState {
  node: FileNode | null;
  type: 'rename' | null;
  originalValue: string;
}

interface ContextMenuState {
  node: FileNode | null;
  x: number;
  y: number;
  visible: boolean;
}

// Language name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
};

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || code.toUpperCase();
}

// Sortable item component for drag-and-drop
interface SortableItemProps {
  id: string;
  node: FileNode;
  level: number;
  parentPath: string;
  expandedFolders: Set<string>;
  selectedFile: FileNode | null;
  editingNode: EditingState;
  onToggleFolder: (path: string) => void;
  onLoadFile: (file: FileNode) => void;
  onRightClick: (e: React.MouseEvent, node: FileNode) => void;
  onStartInlineEdit: (node: FileNode) => void;
  onSaveInlineEdit: () => void;
  onCancelInlineEdit: () => void;
  renderChildren: (node: FileNode, level: number, parentPath: string) => React.ReactNode;
}

function SortableItem({
  id,
  node,
  level,
  parentPath,
  expandedFolders,
  selectedFile,
  editingNode,
  onToggleFolder,
  onLoadFile,
  onRightClick,
  onStartInlineEdit,
  onSaveInlineEdit,
  onCancelInlineEdit,
  renderChildren,
}: SortableItemProps) {
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

  const nodePath = parentPath ? `${parentPath}/${node.path}` : node.path;
  const isEditing = editingNode.node?.path === nodePath && editingNode.type === 'rename';

  return (
    <div ref={setNodeRef} style={style}>
      {node.type === 'directory' ? (
        <div>
          <div
            className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded cursor-pointer transition-colors ${
              selectedFile?.path === nodePath ? 'bg-accent' : ''
            }`}
            onClick={() => onToggleFolder(nodePath)}
            onContextMenu={(e) => onRightClick(e, node)}
          >
            <ChevronRight
              {...attributes}
              {...listeners}
              className={`h-4 w-4 transition-transform text-muted-foreground cursor-grab ${
                expandedFolders.has(nodePath) ? 'rotate-90' : ''
              }`}
            />
            {expandedFolders.has(nodePath) ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )}
            {isEditing ? (
              <Input
                value={editingNode.node?.name || ''}
                onChange={(e) => {
                  if (editingNode.node) {
                    onStartInlineEdit({ ...editingNode.node!, name: e.target.value });
                  }
                }}
                onBlur={onSaveInlineEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSaveInlineEdit();
                  } else if (e.key === 'Escape') {
                    onCancelInlineEdit();
                  }
                }}
                className="h-6 px-1 text-sm bg-background border-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-offset-2"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium">{node.name}</span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {node.children?.length || 0} pages
            </span>
          </div>
          {expandedFolders.has(nodePath) && node.children && (
            <div className="ml-4">
              {renderChildren(node, level + 1, nodePath)}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded cursor-pointer transition-colors ${
            selectedFile?.path === nodePath ? 'bg-accent' : ''
          }`}
          onClick={() => onLoadFile(node)}
          onContextMenu={(e) => onRightClick(e, node)}
        >
          <span className="w-4" {...attributes} {...listeners}></span>
          {isEditing ? (
            <Input
              value={editingNode.node?.name || ''}
              onChange={(e) => {
                if (editingNode.node) {
                  onStartInlineEdit({ ...editingNode.node!, name: e.target.value });
                }
              }}
              onBlur={onSaveInlineEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSaveInlineEdit();
                } else if (e.key === 'Escape') {
                  onCancelInlineEdit();
                }
              }}
              className="h-6 px-1 text-sm bg-background border-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-offset-2"
              autoFocus
            />
          ) : (
            <>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">{node.name}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocumentationEditor({ locale, availableLocales, categories: initialCategories }: Props) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  // Ensure categories is always an array
  const [categories, setCategories] = useState(Array.isArray(initialCategories) ? initialCategories : []);

  // New file/folder modals
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [parentCategory, setParentCategory] = useState('');

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderSlug, setNewFolderSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Language creation modal
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [newLocaleCode, setNewLocaleCode] = useState('');
  const [duplicateFromLocale, setDuplicateFromLocale] = useState('');
  const [isCreatingLocale, setIsCreatingLocale] = useState(false);

  // Inline editing state
  const [editingNode, setEditingNode] = useState<EditingState>({
    node: null,
    type: null,
    originalValue: '',
  });

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    node: null,
    x: 0,
    y: 0,
    visible: false,
  });

  const editorRef = useRef<HTMLDivElement>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ node: null, x: 0, y: 0, visible: false });
      if (editingNode.node) {
        setEditingNode({ node: null, type: null, originalValue: '' });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingNode]);

  // Reload categories after creation/update
  const reloadCategories = useCallback(async () => {
    try {
      const response = await fetch(route('admin.plugins.documentation.tree', { locale: locale || 'fr' }));
      if (response.ok) {
        const data = await response.json();
        // Ensure tree is an array
        const tree = Array.isArray(data.tree) ? data.tree : [];
        const newCategories = tree.map((node: any) => ({
          id: node.path,
          title: node.title || node.name,
          pages: Array.isArray(node.children) ? node.children.map((child: any) => ({
            slug: child.slug || child.name.replace('.md', ''),
            title: child.title || child.name.replace('.md', ''),
          })) : [],
        }));
        setCategories(newCategories);
      }
    } catch (error) {
      console.error('Failed to reload categories:', error);
      // Set empty array on error to prevent crashes
      setCategories([]);
    }
  }, [locale]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const buildFileTree = (categories: any[]): FileNode[] => {
    const tree: FileNode[] = [];

    categories.forEach((category) => {
      const categoryNode: FileNode = {
        id: category.id,
        name: category.title,
        path: category.id,
        type: 'directory',
        children: [],
      };

      if (category.pages && category.pages.length > 0) {
        categoryNode.children = category.pages.map((page: any) => ({
          id: `${category.id}/${page.slug}`,
          name: page.title,
          path: `${category.id}/${page.slug}`,
          type: 'file' as const,
          slug: page.slug,
        }));
      }

      tree.push(categoryNode);
    });

    return tree;
  };

  const fileTree = buildFileTree(categories);
  const flatFileIds = fileTree.flatMap(node => {
    const ids = [node.id!];
    if (node.children) {
      node.children.forEach(child => ids.push(child.id!));
    }
    return ids;
  });

  const handleRightClick = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      node,
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // TODO: Implement file/folder move logic
      console.log('Move from', active.id, 'to', over.id);
    }
  };

  const startInlineEdit = (node: FileNode) => {
    setEditingNode({
      node,
      type: 'rename',
      originalValue: node.name,
    });
    setContextMenu({ node: null, x: 0, y: 0, visible: false });
  };

  const saveInlineEdit = async () => {
    if (!editingNode.node || !editingNode.originalValue || editingNode.originalValue === editingNode.node?.name) {
      setEditingNode({ node: null, type: null, originalValue: '' });
      return;
    }

    try {
      if (editingNode.node!.type === 'directory') {
        await router.post(route('admin.plugins.documentation.save-content'), {
          locale,
          path: `${editingNode.node!.path}/index`,
          content: `---\ntitle: "${editingNode.node!.name}"\ndescription: ""\norder: 999\n---\n\n# ${editingNode.node!.name}\n\n`,
        });
      } else {
        const response = await fetch(route('admin.plugins.documentation.file-content'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
          },
          body: JSON.stringify({ locale, path: editingNode.node!.path }),
        });

        if (response.ok) {
          const data = await response.json();
          let content = data.content || '';
          const titleMatch = content.match(/^title:\s*"(.+?)"/m);
          const titleLine = titleMatch ? content.indexOf(titleMatch[0]) : -1;

          if (titleLine !== -1) {
            const endOfLine = content.indexOf('\n', titleLine);
            content = content.substring(0, titleLine) +
                      `title: "${editingNode.node!.name}"` +
                      content.substring(endOfLine);
          } else {
            content = `---\ntitle: "${editingNode.node!.name}"\ndescription: ""\norder: 999\n---\n\n${content}`;
          }

          await router.post(route('admin.plugins.documentation.save-content'), {
            locale,
            path: editingNode.node!.path,
            content,
          });
        }
      }

      await reloadCategories();
    } catch (error) {
      console.error('Failed to rename:', error);
    }

    setEditingNode({ node: null, type: null, originalValue: '' });
  };

  const cancelInlineEdit = () => {
    setEditingNode({ node: null, type: null, originalValue: '' });
  };

  const deleteNode = async (node: FileNode) => {
    setContextMenu({ node: null, x: 0, y: 0, visible: false });

    const confirmMessage = node.type === 'directory'
      ? trans('admin.documentation.messages.folder_delete_confirm', { name: node.name })
      : trans('admin.documentation.messages.delete_confirm', { name: node.name });

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      if (node.type === 'file') {
        await router.delete(route('admin.plugins.documentation.destroy', {
          locale,
          category: node.path.split('/')[0],
          page: node.slug || node.path.split('/').slice(1).join('/'),
        }));
      } else {
        // For folders, we need to delete all files recursively
        const response = await fetch(route('admin.plugins.documentation.tree', { locale }), {
          method: 'GET',
        });
        const data = await response.json();

        const deleteFilesRecursively = async (folderPath: string) => {
          const folder = data.tree.find((n: any) => n.path === folderPath);
          if (!folder) return;

          // Delete all files in folder
          if (folder.children) {
            for (const child of folder.children) {
              if (child.type === 'file') {
                await router.delete(route('admin.plugins.documentation.destroy', {
                  locale,
                  category: folderPath,
                  page: child.slug,
                }));
              }
            }
          }

          // Delete the index.md file
          const indexPath = `${folderPath}/index`;
          try {
            await fetch(route('admin.plugins.documentation.save-content'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
              },
              body: JSON.stringify({
                locale,
                path: indexPath,
                content: '', // Empty content to delete
              }),
            });
          } catch (e) {
            // Ignore error if file doesn't exist
          }
        };

        await deleteFilesRecursively(node.path);
      }

      await reloadCategories();

      if (selectedFile?.path === node.path) {
        setSelectedFile(null);
        setFileContent('');
      }

    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const createNewFile = async (parentPath: string, fileName: string) => {
    if (!fileName) return;

    setIsCreating(true);

    try {
      const slug = fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const response = await fetch(route('admin.plugins.documentation.store'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: JSON.stringify({
          locale,
          category: parentPath,
          filename: slug,
          title: fileName,
          content: `# ${fileName}\n\nWrite your content here.`,
        }),
      });

      if (response.ok) {
        setShowNewFileModal(false);
        setNewFileName('');
        setSelectedFolderForFile(null);
        await reloadCategories();
        setExpandedFolders(prev => new Set([...prev, parentPath]));
      } else {
        console.error('Failed to create file');
      }

    } catch (error) {
      console.error('Failed to create file:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const createNewFolder = async () => {
    if (!newFolderName || !newFolderSlug) return;

    setIsCreating(true);

    try {
      const response = await fetch(route('admin.plugins.documentation.category.store'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: JSON.stringify({
          locale,
          name: newFolderName,
          slug: newFolderSlug,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowNewFolderModal(false);
        setNewFolderName('');
        setNewFolderSlug('');
        await reloadCategories();
      } else {
        // Show error
        console.error('Failed to create folder:', data.message);
      }

    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const createNewLocale = async () => {
    if (!newLocaleCode || newLocaleCode.length < 2) return;

    setIsCreatingLocale(true);

    try {
      if (duplicateFromLocale) {
        // Duplicate from existing locale
        await router.post(route('admin.plugins.documentation.duplicate-locale'), {
          source_locale: duplicateFromLocale,
          target_locale: newLocaleCode.toLowerCase(),
        });
      } else {
        // Create empty locale
        await router.post(route('admin.plugins.documentation.create-locale'), {
          locale: newLocaleCode.toLowerCase(),
        });
      }

      setShowLanguageModal(false);
      setNewLocaleCode('');
      setDuplicateFromLocale('');

      // Reload page to show new locale
      window.location.href = route('admin.plugins.documentation.browse', { locale: newLocaleCode.toLowerCase() });

    } catch (error) {
      console.error('Failed to create locale:', error);
      setIsCreatingLocale(false);
    }
  };

  const changeLocale = (newLocale: string) => {
    router.get(route('admin.plugins.documentation.browse', { locale: newLocale }));
  };

  const renderFileTree = (nodes: FileNode[], level = 0, parentPath = ''): React.ReactNode => {
    return nodes.map((node) => (
      <SortableItem
        key={`${parentPath}/${node.path}`}
        id={node.id!}
        node={node}
        level={level}
        parentPath={parentPath}
        expandedFolders={expandedFolders}
        selectedFile={selectedFile}
        editingNode={editingNode}
        onToggleFolder={toggleFolder}
        onLoadFile={loadFile}
        onRightClick={handleRightClick}
        onStartInlineEdit={(updatedNode) => setEditingNode({ ...editingNode, node: updatedNode })}
        onSaveInlineEdit={saveInlineEdit}
        onCancelInlineEdit={cancelInlineEdit}
        renderChildren={renderFileTree}
      />
    ));
  };

  const loadFile = async (file: FileNode) => {
    if (hasUnsavedChanges) {
      if (!confirm(trans('admin.documentation.messages.unsaved_changes_confirm'))) {
        return;
      }
    }

    setSelectedFile(file);
    setHasUnsavedChanges(false);

    try {
      const response = await fetch(route('admin.plugins.documentation.file-content'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: JSON.stringify({ locale, path: file.path }),
      });

      if (response.ok) {
        const data = await response.json();
        setFileContent(data.content || '');
      }
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;

    setIsSaving(true);

    try {
      await router.post(route('admin.plugins.documentation.save-content'), {
        locale,
        path: selectedFile.path,
        content: fileContent,
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setHasUnsavedChanges(false);
          setIsSaving(false);
        },
        onError: () => {
          setIsSaving(false);
        },
      });
    } catch (error) {
      console.error('Failed to save file:', error);
      setIsSaving(false);
    }
  };

  // New file creation in folder
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFolderForFile, setSelectedFolderForFile] = useState<FileNode | null>(null);

  const handleNewFileInFolder = (folder: FileNode) => {
    setSelectedFolderForFile(folder);
    setShowNewFileModal(true);
    setContextMenu({ node: null, x: 0, y: 0, visible: false });
  };

  return (
    <>
      <Head title={`${trans('admin.documentation.editor.title')} (${locale.toUpperCase()})`} />

      {/* Full-screen IDE layout */}
      <div className="h-screen flex flex-col bg-background" ref={editorRef}>
        {/* Top Header Bar */}
        <div className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-4">
            <Link href={route('admin.plugins.documentation.browse')}>
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                {trans('admin.documentation.editor.back_to_admin')}
              </Button>
            </Link>

            <div className="h-6 w-px bg-border"></div>

            <h1 className="text-sm font-semibold">
              {trans('admin.documentation.title')}
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {selectedFile && (
              <>
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500">● {trans('admin.documentation.editor.unsaved')}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveFile}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="h-8"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? trans('admin.documentation.editor.saving') : trans('admin.documentation.editor.save')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  as={Link}
                  href={route('docs.page', {
                    locale,
                    category: selectedFile.path.split('/')[0],
                    page: selectedFile.slug ?? selectedFile.path.split('/').slice(1).join('/'),
                  })}
                  target="_blank"
                  className="h-8"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {trans('admin.documentation.editor.preview')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - File Tree (320px for better responsiveness) */}
          <div className="w-[320px] border-r border-border flex flex-col bg-muted/30">
            {/* Locale Selector with Add Language */}
            <div className="p-3 border-b border-border">
              <div className="flex gap-2">
                <Select value={locale} onValueChange={changeLocale}>
                  <SelectTrigger className="flex-1 h-9">
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocales.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {getLanguageName(loc)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-2"
                  onClick={() => setShowLanguageModal(true)}
                  title={trans('admin.documentation.locales.add_locale')}
                >
                  <Languages className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File Tree Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {trans('admin.documentation.editor.files')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => setShowNewFolderModal(true)}
                title={trans('admin.documentation.editor.new_folder')}
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={flatFileIds} strategy={verticalListSortingStrategy}>
                  {fileTree.length > 0 ? (
                    renderFileTree(fileTree)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <FileCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      {trans('admin.documentation.editor.no_files')}
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Right - Editor */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {selectedFile ? (
              <>
                {/* Editor Header */}
                <div className="h-10 border-b border-border px-4 flex items-center justify-between bg-muted/20">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="text-xs text-muted-foreground">{selectedFile.path}</span>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-hidden">
                  <Textarea
                    value={fileContent}
                    onChange={(e) => {
                      setFileContent(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder={`# ${trans('admin.documentation.editor.markdown_placeholder')}`}
                    className="w-full h-full font-mono text-sm p-4 border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">
                    {trans('admin.documentation.editor.select_file')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {trans('admin.documentation.editor.select_file_hint')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowNewFolderModal(true)}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    {trans('admin.documentation.editor.new_folder')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 min-w-[200px] bg-popover text-popover-foreground border rounded-md shadow-lg p-1"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.node?.type === 'directory' && (
            <>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => handleNewFileInFolder(contextMenu.node!)}
              >
                <Plus className="h-4 w-4" />
                {trans('admin.documentation.editor.new_file')}
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                onClick={() => {
                  startInlineEdit(contextMenu.node!);
                  setContextMenu({ node: null, x: 0, y: 0, visible: false });
                }}
              >
                <FileEdit className="h-4 w-4" />
                {trans('admin.documentation.editor.edit')}
              </button>
            </>
          )}
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md text-red-500"
            onClick={() => deleteNode(contextMenu.node!)}
          >
            <Trash2 className="h-4 w-4" />
            {trans('admin.documentation.editor.delete')}
          </button>
        </div>
      )}

      {/* New Folder Modal */}
      <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{trans('admin.documentation.editor.new_folder')}</DialogTitle>
            <DialogDescription>
              {trans('admin.documentation.editor.folder_name_placeholder')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">{trans('admin.documentation.editor.folder_name')}</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                  setNewFolderSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder={trans('admin.documentation.editor.folder_name_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder-slug">{trans('admin.documentation.editor.folder_slug')}</Label>
              <Input
                id="folder-slug"
                value={newFolderSlug}
                onChange={(e) => setNewFolderSlug(e.target.value)}
                placeholder={trans('admin.documentation.editor.folder_slug_placeholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderModal(false)}>
              {trans('admin.documentation.editor.cancel')}
            </Button>
            <Button onClick={createNewFolder} disabled={isCreating || !newFolderName || !newFolderSlug}>
              {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {trans('admin.documentation.editor.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New File Modal */}
      <Dialog open={showNewFileModal} onOpenChange={setShowNewFileModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{trans('admin.documentation.editor.new_file')}</DialogTitle>
            <DialogDescription>
              {trans('admin.documentation.editor.page_name')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-name">{trans('admin.documentation.editor.page_name')}</Label>
              <Input
                id="file-name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="My Page"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowNewFileModal(false);
              setNewFileName('');
              setSelectedFolderForFile(null);
            }}>
              {trans('admin.documentation.editor.cancel')}
            </Button>
            <Button
              onClick={() => {
                createNewFile(selectedFolderForFile!.path, newFileName);
                setShowNewFileModal(false);
                setNewFileName('');
                setSelectedFolderForFile(null);
              }}
              disabled={isCreating || !newFileName}
            >
              {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {trans('admin.documentation.editor.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Language Modal */}
      <Dialog open={showLanguageModal} onOpenChange={setShowLanguageModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{trans('admin.documentation.locales.create_locale')}</DialogTitle>
            <DialogDescription>
              {trans('admin.documentation.locales.create_locale_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="locale-code">{trans('admin.documentation.locales.locale_code')}</Label>
              <Input
                id="locale-code"
                value={newLocaleCode}
                onChange={(e) => setNewLocaleCode(e.target.value.toLowerCase())}
                placeholder={trans('admin.documentation.locales.locale_code_placeholder')}
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Examples: en (English), es (Español), de (Deutsch), it (Italiano)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duplicate-from">{trans('admin.documentation.locales.duplicate_from')}</Label>
              <Select value={duplicateFromLocale || 'none'} onValueChange={(val) => setDuplicateFromLocale(val === 'none' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder={trans('admin.documentation.locales.duplicate_from_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{trans('admin.documentation.locales.create_empty')}</SelectItem>
                  {availableLocales.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {getLanguageName(loc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {trans('admin.documentation.locales.copy_from_hint')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowLanguageModal(false);
              setNewLocaleCode('');
              setDuplicateFromLocale('');
            }}>
              {trans('admin.documentation.editor.cancel')}
            </Button>
            <Button onClick={createNewLocale} disabled={isCreatingLocale || !newLocaleCode || newLocaleCode.length < 2}>
              {isCreatingLocale ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {trans('admin.documentation.editor.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
