import { useEffect, useState, useCallback } from 'react';
import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import { RiFileTextLine } from 'react-icons/ri';
import { trans } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Save,
  Eye,
  EyeOff,
  Home,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  locale: string;
  category?: string;
  title?: string;
  children?: FileNode[];
}

interface EditorBlockNoteProps {
  locales: string[];
  categories: string[];
  defaultLocale: string;
}

interface Block {
  id: string;
  type: string;
  content: any;
  props: any;
  children: Block[];
}

export default function EditorBlockNote({ locales, categories, defaultLocale }: EditorBlockNoteProps) {
  const [selectedLocale, setSelectedLocale] = useState(defaultLocale);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [initialContent, setInitialContent] = useState<any[]>([]);

  // Initialiser BlockNote avec le hook React
  const editor = useCreateBlockNote({ initialContent });

  // Charger le fichier sélectionné dans BlockNote
  const loadFileIntoEditor = useCallback(async (file: FileNode) => {
    try {
      const response = await axios.get(`/admin/editor/file/${file.locale}/${file.category}/${file.path.replace('.md', '')}`);
      const { frontmatter, markdown } = response.data;

      // Créer le contenu initial avec le titre comme premier bloc
      const content = [
        {
          type: 'cover',
          props: { title: frontmatter.title || file.title || 'Sans titre' },
        },
        ...parseMarkdownToBlocks(markdown),
      ];

      setInitialContent(content);
      setSelectedFile(file);
    } catch (error) {
      console.error('Erreur lors du chargement du fichier:', error);
    }
  }, []);

  const parseMarkdownToBlocks = (markdown: string): Block[] => {
    const blocks: Block[] = [];
    const lines = markdown.split('\n');
    let currentBlock: any = null;
    let currentListItems: string[] = [];
    let inCodeBlock = false;
    let codeContent = '';

    // Helper pour ajouter le bloc courant
    const pushCurrentBlock = () => {
      if (currentBlock) {
        if (currentListItems.length > 0) {
          currentBlock.content = currentListItems.map(text => ({ type: 'text', text, styles: {} }));
        }
        currentBlock.id = crypto.randomUUID();
        blocks.push(currentBlock);
      }
      currentBlock = null;
      currentListItems = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Bloc de code
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          pushCurrentBlock();
          blocks.push({
            id: crypto.randomUUID(),
            type: 'codeBlock',
            content: [
              { type: 'text', text: codeContent.trim(), styles: {} },
            ],
            props: { language: 'javascript' },
          });
          codeContent = '';
          inCodeBlock = false;
        } else {
          pushCurrentBlock();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Lignes vides
      if (!line.trim()) {
        pushCurrentBlock();
        continue;
      }

      // Titres
      if (line.startsWith('###')) {
        pushCurrentBlock();
        blocks.push({
          id: crypto.randomUUID(),
          type: 'heading',
          props: { level: 3, textAlignment: 'left' },
          content: [{ type: 'text', text: line.replace(/^###\s+/, '').trim(), styles: {} }]
        });
        continue;
      }
      if (line.startsWith('##')) {
        pushCurrentBlock();
        blocks.push({
          id: crypto.randomUUID(),
          type: 'heading',
          props: { level: 2, textAlignment: 'left' },
          content: [{ type: 'text', text: line.replace(/^##\s+/, '').trim(), styles: {} }]
        });
        continue;
      }
      if (line.startsWith('#')) {
        pushCurrentBlock();
        blocks.push({
          id: crypto.randomUUID(),
          type: 'heading',
          props: { level: 1, textAlignment: 'left' },
          content: [{ type: 'text', text: line.replace(/^#\s+/, '').trim(), styles: {} }]
        });
        continue;
      }

      // Listes
      if (line.match(/^\s*[-*+]\s+/)) {
        pushCurrentBlock();
        const itemText = line.replace(/^\s*[-*+]\s+/, '');
        blocks.push({
          id: crypto.randomUUID(),
          type: 'bulletListItem',
          content: [{ type: 'text', text: itemText, styles: {} }],
          props: {},
          children: []
        });
        continue;
      }

      // Listes numérotées
      if (line.match(/^\s*\d+\.\s+/)) {
        pushCurrentBlock();
        const itemText = line.replace(/^\s*\d+\.\s+/, '');
        blocks.push({
          id: crypto.randomUUID(),
          type: 'numberedListItem',
          content: [{ type: 'text', text: itemText, styles: {} }],
          props: {},
          children: []
        });
        continue;
      }

      // Contenu paragraphe
      if (!currentBlock) {
        currentBlock = {
          type: 'paragraph',
          content: [{ type: 'text', text: line.trim(), styles: {} }],
          props: {}
        };
      } else if (currentBlock.type === 'paragraph') {
        currentBlock.content[0].text += ' ' + line.trim();
      } else {
        pushCurrentBlock();
        currentBlock = {
          type: 'paragraph',
          content: [{ type: 'text', text: line.trim(), styles: {} }],
          props: {}
        };
      }
    }

    pushCurrentBlock();
    return blocks;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const loadFileTree = async (locale: string) => {
    try {
      const response = await axios.get(`/api/docs/${locale}/tree`);
      setFileTree(response.data.tree || []);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
      setFileTree([]);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;

    setSaving(true);
    try {
      // Get blocks from editor
      const blocks = editor.document;
      const { markdown, frontmatter } = blocksToMarkdown(blocks);

      await axios.post(`/admin/editor/file/${selectedFile.locale}/${selectedFile.category}/${selectedFile.path.replace('.md', '')}`, {
        frontmatter,
        markdown,
      });

      alert('Fichier enregistré avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const blocksToMarkdown = (blocks: any[]): { markdown: string; frontmatter: any } => {
    let markdown = '';
    const frontmatter: any = {};

    // Extraire les métadonnées du bloc cover s'il existe
    const coverBlock = blocks.find((b: any) => b.type === 'cover');
    if (coverBlock?.props?.title) {
      frontmatter.title = coverBlock.props.title;
    }

    for (const block of blocks) {
      if (block.type === 'cover') {
        continue; // Skip cover blocks in markdown
      }

      if (block.type === 'codeBlock') {
        const code = block.content?.map((c: any) => c.text || '').join('') || '';
        markdown += '```' + (block.props?.language || 'javascript') + '\n';
        markdown += code.trim() + '\n';
        markdown += '```\n\n';
      } else if (block.type === 'heading') {
        const level = block.props?.level || 1;
        const prefix = '#'.repeat(level);
        const text = block.content?.map((c: any) => c.text || '').join('') || '';
        markdown += `${prefix} ${text}\n\n`;
      } else if (block.type === 'bulletListItem') {
        const text = block.content?.map((c: any) => c.text || '').join('') || '';
        markdown += `- ${text}\n`;
      } else if (block.type === 'numberedListItem') {
        const text = block.content?.map((c: any) => c.text || '').join('') || '';
        markdown += `1. ${text}\n`;
      } else if (block.type === 'paragraph') {
        const text = block.content?.map((c: any) => c.text || '').join('') || '';
        if (text.trim()) {
          markdown += text + '\n\n';
        }
      }
    }

    return { markdown, frontmatter };
  };

  const togglePreview = async () => {
    if (!previewMode) {
      // Générer l'aperçu
      const blocks = editor.document;
      const { markdown } = blocksToMarkdown(blocks);
      const html = convertMarkdownToHtml(markdown);
      setPreviewContent(html);
    }
    setPreviewMode(!previewMode);
  };

  const convertMarkdownToHtml = (md: string): string => {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br />');
  };

  // Charger l'arborescence au chargement
  useEffect(() => {
    loadFileTree(selectedLocale);
  }, [selectedLocale]);

  // Sauvegarde automatique avec Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-background flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/plugins/documentation">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {trans('admin.documentation.editor.back')}
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">{trans('admin.documentation.editor.title')}</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="px-3 py-1.5 border rounded-md text-sm bg-background"
          >
            {locales.map((loc) => (
              <option key={loc} value={loc}>{loc.toUpperCase()}</option>
            ))}
          </select>

          {selectedFile && (
            <>
              <Button variant="outline" size="sm" onClick={togglePreview}>
                {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? trans('admin.documentation.editor.edit') : trans('admin.documentation.editor.preview')}
              </Button>

              <Button size="sm" onClick={saveFile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? trans('admin.documentation.editor.saving') : trans('admin.documentation.editor.save')}
              </Button>

              <a
                href={`/docs/${selectedFile.locale}/${selectedFile.category}/${selectedFile.path.replace('.md', '')}`}
                target="_blank"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {trans('admin.documentation.editor.view_docs')}
                </Button>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">
              {trans('admin.documentation.editor.files')}
            </h2>
          </div>

          {fileTree.length === 0 ? (
            <div className="px-4 pb-8 text-center text-muted-foreground text-sm">
              <RiFileTextLine className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{trans('admin.documentation.editor.no_files')}</p>
            </div>
          ) : (
            <div className="px-2">
              {fileTree.map((node) => renderFileNode(node, 0))}
            </div>
          )}
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <div className="h-full overflow-hidden">
              {previewMode ? (
                <div className="h-full overflow-y-auto p-6">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <BlockNoteView
                    editor={editor}
                    className="h-full"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <RiFileTextLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">{trans('admin.documentation.editor.select_file')}</p>
                <p className="text-sm mt-2">{trans('admin.documentation.editor.select_file_hint')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 bg-muted/30 flex items-center justify-between flex-shrink-0">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <Home className="h-4 w-4 mr-2" />
            {trans('admin.documentation.editor.back_to_admin')}
          </Button>
        </Link>

        {selectedFile && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {selectedFile.path}
            </span>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newUrl = window.location.href;
                window.open(newUrl, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              {trans('admin.documentation.editor.view_docs')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  function renderFileNode(node: FileNode, level: number): React.ReactNode {
    const isExpanded = expandedFolders.has(node.path);

    return (
      <div key={node.name} style={{ paddingLeft: `${level * 8}px` }}>
        {node.type === 'directory' ? (
          <div className="py-1">
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-2 w-full px-2 py-1 rounded hover:bg-accent transition-colors text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <svg className="h-4 w-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 10-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h3a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-sm font-medium">{node.name}</span>
            </button>
            {isExpanded && node.children && (
              <div className="ml-2">
                {node.children.map((child) => renderFileNode(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              loadFileIntoEditor(node);
            }}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-accent transition-colors text-left ${
              selectedFile?.path === node.path ? 'bg-accent' : ''
            }`}
          >
            <svg className="h-4 w-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 0h6m2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h3a2 2 0 002-2V9a2 2 0 10-2-2h2a2 2 0 00-2 2z" />
            </svg>
            <span className="text-sm">{node.name.replace('.md', '')}</span>
            {node.title && (
              <span className="text-xs text-muted-foreground ml-auto">({node.title})</span>
            )}
          </button>
        )}
      </div>
    );
  }
}
