import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Folder, Edit, ArrowLeft, FileJson, Save, Eye, ChevronRight, File, FileCode } from 'lucide-react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';

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

export default function DocumentationEditor({ locale, availableLocales, categories }: Props) {
  const { settings } = usePage<PageProps>().props;

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

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
              className={`flex items-center gap-2 py-2 px-${2 + level * 4} hover:bg-accent/50 rounded cursor-pointer transition-colors ${
                selectedFile?.path === node.path ? 'bg-accent' : ''
              }`}
              onClick={() => toggleFolder(node.path)}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  expandedFolders.has(node.path) ? 'rotate-90' : ''
                }`}
              />
              <Folder className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{node.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {node.children?.length || 0} files
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
            className={`flex items-center gap-2 py-2 px-${2 + level * 4} hover:bg-accent/50 rounded cursor-pointer transition-colors ${
              selectedFile?.path === node.path ? 'bg-accent' : ''
            }`}
            onClick={() => loadFile(node)}
          >
            <span className="w-4"></span>
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{node.name}</span>
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

    // Load file content
    try {
      const response = await fetch(route('admin.plugins.documentation.file-content'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '' },
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

  const discardChanges = () => {
    if (selectedFile) {
      loadFile(selectedFile);
    }
    setHasUnsavedChanges(false);
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Documentation Editor (${locale.toUpperCase()}) - ${settings.name}`} />

      {/* Full-height IDE layout */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={route('admin.plugins.documentation.index')}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>

              <h1 className="text-lg font-semibold">
                Documentation Editor
              </h1>

              <span className="text-sm text-muted-foreground">
                {locale.toUpperCase()}
              </span>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500">Unsaved changes</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={discardChanges}
                  disabled={isSaving}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={saveFile}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
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
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - File Tree (250px) */}
          <div className="w-[280px] border-r border-border overflow-y-auto p-2">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground px-2">FILES</h2>
            </div>
            {fileTree.length > 0 ? (
              renderFileTree(fileTree)
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <FileJson className="h-12 w-12 mx-auto mb-2 opacity-50" />
                No documentation files found
              </div>
            )}
          </div>

          {/* Middle - Changes List (flex-1, max 400px) */}
          <div className="flex-1 max-w-[400px] border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-muted-foreground">CHANGES</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                No changes yet
              </p>
            </div>
          </div>

          {/* Right - Editor (flex-1) */}
          <div className="flex-1 overflow-y-auto">
            {selectedFile ? (
              <div className="h-full flex flex-col p-4">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                    {selectedFile.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.path}
                  </p>
                </div>

                <div className="flex-1 flex flex-col">
                  <Label htmlFor="content" className="sr-only">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={fileContent}
                    onChange={(e) => {
                      setFileContent(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="# Markdown content"
                    className="flex-1 font-mono text-sm min-h-[400px] p-4 border border-input rounded-md resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">Select a file to edit</p>
                  <p className="text-sm">
                    Choose a file from the file tree on the left
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
);
}
