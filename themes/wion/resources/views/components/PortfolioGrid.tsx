/**
 * Wion Theme - Portfolio Grid Component
 * Filterable portfolio with multiple view modes
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image?: string;
  tags: string[];
  featured: boolean;
  date: string;
  client?: string;
  link?: string;
}

interface PortfolioGridProps {
  projects: Project[];
  categories?: string[];
  viewMode?: 'grid' | 'masonry' | 'carousel';
  itemsPerRow?: number;
  showFilters?: boolean;
  onProjectClick?: (project: Project) => void;
}

export default function PortfolioGrid({
  projects,
  categories = [],
  viewMode = 'grid',
  itemsPerRow = 3,
  showFilters = true,
  onProjectClick
}: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Get unique categories if not provided
  const allCategories = categories.length > 0
    ? categories
    : ['All', ...new Set(projects.map(p => p.category))];

  // Filter projects
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  // Determine grid classes based on view mode and items per row
  const getGridClasses = () => {
    if (viewMode === 'masonry') {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
    return `grid grid-cols-1 md:grid-cols-${Math.min(itemsPerRow, 4)} gap-8`;
  };

  // Render filter pills
  const renderFilters = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  };

  // Render project card
  const renderProjectCard = (project: Project, index: number) => {
    const isHovered = hoveredProject === project.id;

    return (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`relative cursor-pointer group ${
          viewMode === 'masonry'
            ? 'break-inside-avoid mb-6'
            : ''
        }`}
        onMouseEnter={() => setHoveredProject(project.id)}
        onMouseLeave={() => setHoveredProject(null)}
        onClick={() => onProjectClick && onProjectClick(project)}
      >
        {/* Image container */}
        <div className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
          viewMode === 'masonry' ? 'h-64 md:h-80' : 'aspect-square'
        }`}>
          {/* Placeholder for image */}
          <div className={`w-full h-full bg-gradient-to-br ${
            project.featured ? 'from-blue-500 to-purple-600' : 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
          } flex items-center justify-center`} />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm opacity-90">{project.description}</p>
            </div>
          </motion.div>

          {/* Quick view button */}
          <motion.button
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </div>

        {/* Project info */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(project.date).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Render masonry item
  const renderMasonryItem = (project: Project, index: number) => {
    const isHovered = hoveredProject === project.id;
    const height = project.featured ? 'h-96' : 'h-64';

    return (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`relative cursor-pointer group break-inside-avoid mb-6 ${height}`}
        onMouseEnter={() => setHoveredProject(project.id)}
        onMouseLeave={() => setHoveredProject(null)}
        onClick={() => onProjectClick && onProjectClick(project)}
      >
        <div className="relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Placeholder */}
          <div className={`w-full h-full bg-gradient-to-br ${
            project.featured ? 'from-blue-500 to-purple-600' : 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
          }`} />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-500 text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm opacity-90">{project.description}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="portfolio-grid">
      {showFilters && renderFilters()}

      {/* Grid container */}
      {viewMode === 'masonry' ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="mb-6">
              {renderMasonryItem(project, index)}
            </div>
          ))}
        </div>
      ) : (
        <div className={getGridClasses()}>
          {filteredProjects.map((project, index) => (
            renderProjectCard(project, index)
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">No projects found in this category.</p>
        </div>
      )}

      {/* Load more button */}
      {filteredProjects.length > 0 && filteredProjects.length < projects.length && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

// Portfolio grid with lightbox functionality
export function PortfolioWithLightbox({
  projects,
  categories = [],
  viewMode = 'grid',
  itemsPerRow = 3,
  showFilters = true
}: PortfolioGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <PortfolioGrid
        projects={projects}
        categories={categories}
        viewMode={viewMode}
        itemsPerRow={itemsPerRow}
        showFilters={showFilters}
        onProjectClick={handleProjectClick}
      />

      {/* Lightbox modal */}
      {isLightboxOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-6xl max-h-[90vh] w-full"
          >
            {/* Close button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
              {/* Image */}
              <div className="relative h-96 bg-gradient-to-br from-blue-500 to-purple-600">
                {/* Placeholder for actual image */}
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {selectedProject.title}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium mb-2">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-3xl font-bold mb-2">{selectedProject.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedProject.description}
                    </p>
                  </div>
                  {selectedProject.featured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-bold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-medium">{new Date(selectedProject.date).toLocaleDateString()}</p>
                  </div>
                  {selectedProject.client && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client</p>
                      <p className="font-medium">{selectedProject.client}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    View Project
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Case Study
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              aria-label="Next project"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}

// Animated portfolio grid
export function AnimatedPortfolioGrid({
  projects,
  categories = [],
  viewMode = 'grid',
  itemsPerRow = 3,
  showFilters = true
}: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="portfolio-grid">
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...new Set(projects.map(p => p.category))].map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(itemsPerRow, 4)} gap-8`}>
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative cursor-pointer group"
            whileHover={{ y: -10 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm opacity-90">{project.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}