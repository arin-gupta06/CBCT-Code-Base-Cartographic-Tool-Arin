import React, { useState, useMemo, useEffect } from 'react';
import { Map, FolderOpen, Github, X, Filter, Search, ChevronDown, File, Folder, Box, Layers, Activity, Shield, TrendingUp, Zap, Trash2, Sliders, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '@/lib/utils';

function Header() {
  const {
    repositoryPath,
    repositoryInfo,
    clearRepository,
    graphData,
    filters,
    setFilter,
    toggleExtensionFilter,
    toggleLanguageFilter,
    toggleSemanticRole,
    clearFilters
  } = useStore();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isGithub = repositoryInfo?.source === 'github';
  const displayName = repositoryInfo?.name || repositoryPath;

  // Get unique extensions, languages, and roles from graphData
  const filterOptions = useMemo(() => {
    if (!graphData?.nodes) return { extensions: [], languages: [], roles: [] };

    const extensions = [...new Set(graphData.nodes.map(n => n.extension).filter(Boolean))].sort();
    const languages = [...new Set(graphData.nodes.map(n => n.language).filter(l => l && l !== 'unknown'))].sort();
    const roles = [...new Set(graphData.nodes.map(n => n.summary?.role).filter(Boolean))].sort();

    return { extensions, languages, roles };
  }, [graphData]);

  const activeFilterCount = filters.extensions.length + filters.languages.length + filters.semanticRoles.length +
    (filters.connectionStatus !== 'all' ? 1 : 0) + (filters.searchQuery ? 1 : 0) +
    (filters.nodeType !== 'all' ? 1 : 0) + (filters.minComplexity > 0 ? 1 : 0) +
    (filters.minCentrality > 0 ? 1 : 0) + (filters.excludePatterns.length > 0 ? 1 : 0);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 backdrop-blur-xl bg-[#0B0B15]/40 border-b border-white/5 shadow-2xl">
      <div className="h-full flex items-center px-3 md:px-6 justify-between max-w-[1920px] mx-auto w-full gap-2 md:gap-4">

        {/* LEFT: Branding */}
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer min-w-fit">
          <div className="relative">
            <div className="absolute inset-0 bg-cbct-accent/40 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Map className="w-5 h-5 md:w-6 md:h-6 text-cbct-accent relative z-10 transition-transform group-hover:scale-110 duration-300" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight flex items-baseline">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:to-cbct-accent transition-all duration-300">CBCT</span>
            <span className="text-cbct-muted ml-2 md:ml-3 font-medium text-xs md:text-sm hidden sm:inline opacity-60 group-hover:opacity-80 transition-opacity">
              CodeBase Cartographic Tool
            </span>
          </h1>
        </div>

        {repositoryPath && (
          <>
            {/* Desktop: CENTER controls */}
            <div className="hidden md:flex flex-1 max-w-2xl items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-500 delay-100">
              {/* Unit Search Bar */}
              <div className="relative w-full max-w-sm group">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cbct-muted group-focus-within:text-cbct-accent transition-colors w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search units..."
                  className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cbct-accent/50 focus:bg-white/5 transition-all shadow-inner"
                  value={filters.searchQuery}
                  onChange={(e) => setFilter('searchQuery', e.target.value)}
                />
              </div>

              {/* Universal Unit Toggle */}
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setFilter('nodeType', 'all')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                    filters.nodeType === 'all'
                      ? "bg-cbct-accent text-white shadow-[0_0_15px_rgba(88,166,255,0.4)]"
                      : "text-cbct-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Layers className="w-3 h-3" />
                  <span className="hidden sm:inline">All</span>
                </button>
                <button
                  onClick={() => setFilter('nodeType', 'module')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                    filters.nodeType === 'module'
                      ? "bg-cbct-accent text-white shadow-[0_0_15px_rgba(88,166,255,0.4)]"
                      : "text-cbct-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Box className="w-3 h-3" />
                  <span className="hidden sm:inline">Modules</span>
                </button>
                <button
                  onClick={() => setFilter('nodeType', 'folder')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                    filters.nodeType === 'folder'
                      ? "bg-cbct-accent text-white shadow-[0_0_15px_rgba(88,166,255,0.4)]"
                      : "text-cbct-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Folder className="w-3 h-3" />
                  <span className="hidden sm:inline">Folders</span>
                </button>
                <button
                  onClick={() => setFilter('nodeType', 'file')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                    filters.nodeType === 'file'
                      ? "bg-cbct-accent text-white shadow-[0_0_15px_rgba(88,166,255,0.4)]"
                      : "text-cbct-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <File className="w-3 h-3" />
                  <span className="hidden sm:inline">Files</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Repo Info & Advanced Filter (Desktop) */}
            <div className="hidden md:flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 min-w-fit justify-end">

              {/* Repo Chip */}
              <div className="hidden lg:flex items-center gap-2 text-sm bg-white/5 px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm">
                {isGithub ? (
                  <Github className="w-3.5 h-3.5 text-cbct-muted" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-cbct-muted" />
                )}
                <span className="text-cbct-muted max-w-[150px] truncate font-medium">
                  {displayName}
                </span>
                {repositoryInfo && (
                  <span className="text-xs text-cbct-accent bg-cbct-accent/10 px-2 py-0.5 rounded-full ml-1 border border-cbct-accent/10">
                    {repositoryInfo.totalFiles} files
                  </span>
                )}
              </div>

              {/* Advanced Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200",
                    activeFilterCount > 0
                      ? 'bg-cbct-accent/20 border-cbct-accent/50 text-cbct-accent shadow-[0_0_10px_rgba(88,166,255,0.2)]'
                      : 'bg-white/5 border-white/10 text-cbct-muted hover:text-white hover:bg-white/10 hover:border-white/20'
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">Adv. Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-cbct-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Content */}
                {showFilterDropdown && (
                  <FilterDropdown
                    filters={filters}
                    filterOptions={filterOptions}
                    setFilter={setFilter}
                    toggleExtensionFilter={toggleExtensionFilter}
                    toggleLanguageFilter={toggleLanguageFilter}
                    toggleSemanticRole={toggleSemanticRole}
                    clearFilters={clearFilters}
                    activeFilterCount={activeFilterCount}
                  />
                )}
              </div>

              <button
                onClick={clearRepository}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-cbct-muted hover:text-red-400 border border-transparent hover:border-red-500/30"
                title="Close repository"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile: hamburger + compact controls */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile search */}
              <div className="relative group flex-1 max-w-[140px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-cbct-muted w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-black/20 border border-white/10 rounded-full py-1 pl-7 pr-2 text-xs text-white focus:outline-none focus:border-cbct-accent/50 transition-all"
                  value={filters.searchQuery}
                  onChange={(e) => setFilter('searchQuery', e.target.value)}
                />
              </div>

              {/* Filter button (mobile) */}
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={cn(
                  "p-1.5 rounded-lg border transition-all",
                  activeFilterCount > 0
                    ? 'bg-cbct-accent/20 border-cbct-accent/50 text-cbct-accent'
                    : 'bg-white/5 border-white/10 text-cbct-muted'
                )}
              >
                <Filter className="w-4 h-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cbct-muted hover:text-white transition-all"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {repositoryPath && mobileMenuOpen && isMobile && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0B0B15]/95 backdrop-blur-xl border-b border-white/10 p-3 z-50 animate-in slide-in-from-top-2 duration-200 space-y-3">
          {/* Unit type filter */}
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/10">
            {[
              { type: 'all', icon: Layers, label: 'All' },
              { type: 'module', icon: Box, label: 'Modules' },
              { type: 'folder', icon: Folder, label: 'Folders' },
              { type: 'file', icon: File, label: 'Files' }
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => { setFilter('nodeType', type); setMobileMenuOpen(false); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-full text-[10px] font-medium transition-all",
                  filters.nodeType === type
                    ? "bg-cbct-accent text-white"
                    : "text-cbct-muted hover:text-white"
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Repo info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cbct-muted">
              {isGithub ? <Github className="w-3 h-3" /> : <FolderOpen className="w-3 h-3" />}
              <span className="truncate max-w-[200px]">{displayName}</span>
            </div>
            <button
              onClick={() => { clearRepository(); setMobileMenuOpen(false); }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Close Repo
            </button>
          </div>
        </div>
      )}

      {/* Mobile filter dropdown */}
      {repositoryPath && showFilterDropdown && isMobile && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50">
          <FilterDropdown
            filters={filters}
            filterOptions={filterOptions}
            setFilter={setFilter}
            toggleExtensionFilter={toggleExtensionFilter}
            toggleLanguageFilter={toggleLanguageFilter}
            toggleSemanticRole={toggleSemanticRole}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
            isMobile={true}
          />
        </div>
      )}
    </header>
  );
}

// Extracted filter dropdown to be reused for both desktop and mobile
function FilterDropdown({ filters, filterOptions, setFilter, toggleExtensionFilter, toggleLanguageFilter, toggleSemanticRole, clearFilters, activeFilterCount, isMobile }) {
  return (
    <div className={cn(
      "bg-[#0B0B15]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-200 ring-1 ring-white/5 overflow-y-auto max-h-[60vh] custom-scrollbar",
      isMobile
        ? "w-full rounded-none border-x-0"
        : "absolute top-full right-0 mt-3 w-80 rounded-xl"
    )}>
      {/* Connection Status */}
      <div className="mb-6">
        <label className="text-[10px] text-cbct-muted uppercase font-bold mb-3 block tracking-wider">Connection Status</label>
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
          {['all', 'connected', 'orphan'].map(status => (
            <button
              key={status}
              onClick={() => setFilter('connectionStatus', status)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filters.connectionStatus === status
                ? 'bg-cbct-accent text-white shadow-sm'
                : 'text-cbct-muted hover:text-white hover:bg-white/5'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Complexity & Centrality Thresholds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-[10px] text-cbct-muted uppercase font-bold mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Min Complexity
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range" min="0" max="50" step="1"
              className="flex-1 accent-orange-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              value={filters.minComplexity}
              onChange={(e) => setFilter('minComplexity', parseInt(e.target.value))}
            />
            <span className="text-xs font-mono text-orange-400 w-6">{filters.minComplexity}</span>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-cbct-muted uppercase font-bold mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Min Centrality
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range" min="0" max="100" step="1"
              className="flex-1 accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              value={filters.minCentrality}
              onChange={(e) => setFilter('minCentrality', parseInt(e.target.value))}
            />
            <span className="text-xs font-mono text-purple-400 w-6">{filters.minCentrality}</span>
          </div>
        </div>
      </div>

      {/* Semantic Roles */}
      {filterOptions.roles.length > 0 && (
        <div className="mb-6">
          <label className="text-[10px] text-cbct-muted uppercase font-bold mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Semantic Roles
          </label>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.roles.map(role => (
              <button
                key={role}
                onClick={() => toggleSemanticRole(role)}
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-medium border transition-all",
                  filters.semanticRoles.includes(role)
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : 'bg-transparent border-white/5 text-cbct-muted hover:border-white/10 hover:text-white'
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Extensions */}
      {filterOptions.extensions.length > 0 && (
        <div className="mb-6">
          <label className="text-[10px] text-cbct-muted uppercase font-bold mb-2 block tracking-wider">File Types</label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
            {filterOptions.extensions.map(ext => (
              <button
                key={ext}
                onClick={() => toggleExtensionFilter(ext)}
                className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${filters.extensions.includes(ext)
                  ? 'bg-cbct-accent/20 border-cbct-accent/40 text-cbct-accent'
                  : 'bg-transparent border-white/5 text-cbct-muted hover:border-white/10 hover:text-white'
                  }`}
              >
                {ext}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {filterOptions.languages.length > 0 && (
        <div className="mb-6">
          <label className="text-[10px] text-cbct-muted uppercase font-bold mb-2 block tracking-wider">Languages</label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
            {filterOptions.languages.map(lang => (
              <button
                key={lang}
                onClick={() => toggleLanguageFilter(lang)}
                className={`px-2 py-1 rounded text-[10px] border transition-all ${filters.languages.includes(lang)
                  ? 'bg-cbct-secondary/20 border-cbct-secondary/40 text-cbct-secondary'
                  : 'bg-transparent border-white/5 text-cbct-muted hover:border-white/10 hover:text-white'
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exclusion Patterns */}
      <div className="mb-6">
        <label className="text-[10px] text-cbct-muted uppercase font-bold mb-2 flex items-center gap-1">
          <Trash2 className="w-3 h-3" /> Exclude Units (Regex)
        </label>
        <input
          type="text"
          placeholder="e.g. node_modules, tests..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              setFilter('excludePatterns', [...filters.excludePatterns, e.target.value]);
              e.target.value = '';
            }
          }}
        />
        {filters.excludePatterns.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.excludePatterns.map((pattern, idx) => (
              <span key={idx} className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px]">
                {pattern}
                <X
                  className="w-2.5 h-2.5 cursor-pointer hover:text-white"
                  onClick={() => setFilter('excludePatterns', filters.excludePatterns.filter((_, i) => i !== idx))}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-[10px] font-bold text-cbct-muted hover:text-white border border-dashed border-white/10 rounded-lg hover:border-cbct-accent/30 hover:bg-cbct-accent/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          <Trash2 className="w-3 h-3" /> Clear All Filters
        </button>
      )}
    </div>
  );
}

export default Header;
