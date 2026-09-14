export default function Header({
  cartCount,
  categories,
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  searchTerm,
  onSearchChange,
  isSearchOpen,
}) {
  return (
    <header className="site-header">
      <nav className="navbar">
        <button type="button" className="logo-button" onClick={() => onSelectCategory('Todos')}>
          AMERICANINO
        </button>

        <div className="nav-links">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? 'nav-link active' : 'nav-link'}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="actions">
          <button className="icon-button" aria-label="Buscar" type="button" onClick={onOpenSearch}>
            ⌕
          </button>
          <a className="icon-button cart-link" aria-label="Bolsa" href="#cart">
            ♧
            <span className="cart-count">{cartCount}</span>
          </a>
        </div>
      </nav>

      {isSearchOpen ? (
        <div className="search-bar-wrap">
          <input
            type="search"
            className="search-input"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Busca por producto, categoría o estilo"
            autoFocus
          />
        </div>
      ) : null}
    </header>
  );
}
