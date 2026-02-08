import { Link, usePage } from '@inertiajs/react';
import { IconChevronRight, IconFolder, IconFileText, IconExternalLink } from '@tabler/icons-react';
import { useState, useMemo } from 'react';

interface DocSidebarProps {
  navigation: any[] | undefined;
  currentPage: string;
  onClose?: () => void;
}

export default function DocSidebar({ navigation = [], currentPage, onClose }: DocSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenSections(newOpen);
  };

  // Auto-open section containing current page
  useState(() => {
    const currentSection = navigation.find((item) =>
      item.type === 'header' &&
      navigation.some((nav) => nav.href?.includes(currentPage))
    );
    if (currentSection) {
      setOpenSections(new Set([currentSection.title]));
    }
  });

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Navigation</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-accent rounded-md"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {navigation.map((item, index) => {
          if (item.type === 'header') {
            const isOpen = openSections.has(item.title);
            // Find all items until next header (using filter instead of takeWhile)
            const sectionItems = useMemo(() => {
              const afterIndex = index + 1;
              const items = [];
              for (let i = afterIndex; i < navigation.length; i++) {
                if (navigation[i].type === 'header') break;
                items.push(navigation[i]);
              }
              return items;
            }, [navigation, index]);

            return (
              <div key={index}>
                <button
                  onClick={() => toggleSection(item.title)}
                  className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-semibold hover:bg-accent rounded-md transition-colors"
                >
                  <span>{item.title}</span>
                  <IconChevronRight
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-2 mt-1 flex flex-col gap-0.5">
                    {sectionItems.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        item={subItem}
                        currentPage={currentPage}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (item.type === 'page' && !item.indent) {
            return (
              <NavLink
                key={index}
                item={item}
                currentPage={currentPage}
                onClick={onClose}
              />
            );
          }

          return null;
        })}
      </nav>

      {/* Footer links */}
      <div className="mt-auto pt-4 border-t flex flex-col gap-2 text-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconFileText className="h-4 w-4" />
          <span>Retour au site</span>
        </Link>
        <a
          href="https://github.com/Exilon-Studios/exiloncms"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>GitHub</span>
          <IconExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

interface NavLinkProps {
  item: any;
  currentPage: string;
  onClick?: () => void;
}

function NavLink({ item, currentPage, onClick }: NavLinkProps) {
  const page = usePage();
  const isActive = item.slug === currentPage || page.props?.page?.slug === item.slug;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors
        ${isActive ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-accent'}
        ${item.indent ? 'ml-4' : ''}
      `}
    >
      {item.icon && (
        <span className="flex-shrink-0">
          {item.icon === 'Folder' ? <IconFolder className="h-4 w-4" /> : <IconFileText className="h-4 w-4" />}
        </span>
      )}
      <span className={item.indent ? 'text-muted-foreground' : ''}>{item.title}</span>
      {item.badge && (
        <span className="ml-auto px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
