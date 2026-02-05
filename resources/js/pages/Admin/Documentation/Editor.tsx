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
import { FileText, Folder, FolderOpen, Save, Eye, ChevronRight, File, FileCode, Plus, X, Home, FolderPlus } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';
import { trans } from '@/lib/i18n';

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
}

// Dynamic locale labels
const LOCALE_LABELS: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES',
  de: 'DE',
  it: 'IT',
  pt: 'PT',
  nl: 'NL',
  pl: 'PL',
  ru: 'RU',
  zh: 'CN',
  ja: 'JP',
  ko: 'KO',
  ar: 'AR',
  tr: 'TR',
};

export default function DocumentationEditor({ locale, availableLocales, categories }: Props) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderSlug, setNewFolderSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

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
        name: category.title,
        path: category.id,
        type: 'directory',
        children: [],
      };

      if (category.pages && category.pages.length > 0) {
        categoryNode.children = category.pages.map((page: any) => ({
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

  const renderFileTree = (nodes: FileNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => (
      <div key={node.path}>
        {node.type === 'directory' ? (
          <div>
            <div
              className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded cursor-pointer transition-colors ${
                selectedFile?.path === node.path ? 'bg-accent' : ''
              }`}
              onClick={() => toggleFolder(node.path)}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform text-muted-foreground ${
                  expandedFolders.has(node.path) ? 'rotate-90' : ''
                }`}
              />
              {expandedFolders.has(node.path) ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm font-medium">{node.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {node.children?.length || 0} {trans('admin.documentation.pages')}
              </span>
            </div>
            {expandedFolders.has(node.path) && node.children && (
              <div className="ml-4">
                {renderFileTree(node.children, level + 1)}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded cursor-pointer transition-colors ${
              selectedFile?.path === node.path ? 'bg-accent' : ''
            }`}
            onClick={() => loadFile(node)}
          >
            <span className="w-4"></span>
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">{node.name}</span>
          </div>
        )}
      </div>
    ));
  };

  const loadFile = async (file: FileNode) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Do you want to continue?')) {
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

  const createNewFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFileName || !newFileCategory) return;

    setIsCreating(true);

    try {
      const slug = newFileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filePath = `${newFileCategory}/${slug}`;

      await router.post(route('admin.plugins.documentation.store'), {
        locale,
        category: newFileCategory,
        filename: slug,
        title: newFileName,
        content: `# ${newFileName}\n\nWrite your content here.`,
      });

      setShowNewFileModal(false);
      setNewFileName('');
      setNewFileCategory('');
      window.location.reload();
    } catch (error) {
      console.error('Failed to create file:', error);
      setIsCreating(false);
    }
  };

  const changeLocale = (newLocale: string) => {
    router.get(route('admin.plugins.documentation.browse', { locale: newLocale }));
  };

  const createNewFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName || !newFolderSlug) return;

    setIsCreatingFolder(true);

    try {
      await router.post(route('admin.plugins.documentation.category.store'), {
        locale,
        name: newFolderName,
        slug: newFolderSlug,
      });

      setShowNewFolderModal(false);
      setNewFolderName('');
      setNewFolderSlug('');
      window.location.reload();
    } catch (error) {
      console.error('Failed to create folder:', error);
      setIsCreatingFolder(false);
    }
  };

  return (
    <>
      <Head title={`${trans('admin.documentation.editor.title')} (${locale.toUpperCase()})`} />

      {/* Full-screen IDE layout */}
      <div className="h-screen flex flex-col bg-background">
        {/* Top Header Bar */}
        <div className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-4">
            <Link href={route('admin.plugins.documentation.index')}>
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
          {/* Left Sidebar - File Tree (280px) */}
          <div className="w-[280px] border-r border-border flex flex-col bg-muted/30">
            {/* Locale Selector */}
            <div className="p-3 border-b border-border">
              <Select value={locale} onValueChange={changeLocale}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLocales.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Tree Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {trans('admin.documentation.editor.files')}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setShowNewFolderModal(true)}
                  title={trans('admin.documentation.editor.new_folder')}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setShowNewFileModal(true)}
                  title={trans('admin.documentation.editor.new_file')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              {fileTree.length > 0 ? (
                renderFileTree(fileTree)
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <FileCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  {trans('admin.documentation.editor.no_files')}
                </div>
              )}
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
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewFolderModal(true)}
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      {trans('admin.documentation.editor.new_folder')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewFileModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {trans('admin.documentation.editor.new_file')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {trans('admin.documentation.editor.new_page')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewFileModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={createNewFile} className="space-y-4">
              <div>
                <Label htmlFor="fileName">
                  {trans('admin.documentation.editor.page_name')}
                </Label>
                <Input
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={trans('admin.documentation.editor.title_placeholder')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fileCategory">
                  {trans('admin.documentation.editor.category')}
                </Label>
                <select
                  id="fileCategory"
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">
                    {trans('admin.documentation.editor.select_category')}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewFileModal(false)}
                >
                  {trans('admin.documentation.editor.cancel')}
                </Button>
                <Button type="submit" disabled={isCreating || !newFileName || !newFileCategory}>
                  {isCreating ? trans('admin.documentation.editor.creating') : trans('admin.documentation.editor.create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {trans('admin.documentation.editor.new_folder')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewFolderModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={createNewFolder} className="space-y-4">
              <div>
                <Label htmlFor="folderName">
                  {trans('admin.documentation.editor.folder_name')}
                </Label>
                <Input
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={trans('admin.documentation.editor.folder_name_placeholder')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="folderSlug">
                  {trans('admin.documentation.editor.folder_slug')}
                </Label>
                <Input
                  id="folderSlug"
                  value={newFolderSlug}
                  onChange={(e) => setNewFolderSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                  placeholder={trans('admin.documentation.editor.folder_slug_placeholder')}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewFolderModal(false)}
                >
                  {trans('admin.documentation.editor.cancel')}
                </Button>
                <Button type="submit" disabled={isCreatingFolder || !newFolderName || !newFolderSlug}>
                  {isCreatingFolder ? trans('admin.documentation.editor.creating') : trans('admin.documentation.editor.create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
