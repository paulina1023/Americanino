import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartSummary from './components/CartSummary';
import { defaultProducts } from './data/products';
import './App.css';

const storageKey = 'americanino-react-cart';
const categories = ['Todos', 'Mujer', 'Hombre', 'Accesorios', 'Lluvia', 'Sale'];

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function App() {
  const [products] = useState(defaultProducts);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [{ ...defaultProducts[0], quantity: 1 }];
    } catch {
      return [{ ...defaultProducts[0], quantity: 1 }];
    }
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timeout);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'Todos' || product.category === activeCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [product.name, product.category, product.badge || '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const shipping = subtotal >= 199000 || subtotal === 0 ? 0 : 12000;
  const total = subtotal + shipping;

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setToast(`${product.name} añadido a tu bolsa`);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeProduct = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const checkout = () => {
    setCart([]);
    setToast('Pedido confirmado · Modo demostración');
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      setActiveCategory('Todos');
    }
  };

  return (
    <>
      <div className="announcement">Envío gratis en compras superiores a $199.000 · Cambios fáciles</div>
      <Header
        cartCount={cartCount}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        onOpenSearch={() => setIsSearchOpen((current) => !current)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isSearchOpen={isSearchOpen}
      />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">Nueva colección · AMERICANINO</p>
            <h1>Tu ritmo.<br />Tu forma.</h1>
            <p>
              Prendas para los días que empiezan temprano y terminan tarde.
              Diseñadas para moverse contigo.
            </p>
            <button type="button" className="button button-light" onClick={() => handleCategorySelect('Lluvia')}>
              Ver temporada de lluvia
            </button>
          </div>
        </section>

        <section className="section" id="products">
          <div className="section-head">
            <h2>{activeCategory === 'Todos' ? 'Favoritos de temporada' : activeCategory}</h2>
            <span className="text-link">{filteredProducts.length} resultados</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div className="empty-page-state">
              <p>No encontramos productos para esta búsqueda.</p>
              <button type="button" className="button" onClick={() => handleCategorySelect('Todos')}>
                Ver todo
              </button>
            </div>
          )}
        </section>

        {activeCategory === 'Todos' ? (
          <section className="split-banner">
            <div className="split-image" />
            <div className="split-copy">
              <div>
                <p className="kicker">Hecho para todos los días</p>
                <h2>Menos reglas.<br />Más estilo.</h2>
                <button type="button" className="button" onClick={() => handleCategorySelect('Hombre')}>
                  Descubrir hombre
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="newsletter">
          <p className="kicker">Únete a la lista</p>
          <h2>Lo nuevo llega primero.</h2>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Tu correo electrónico" required />
            <button className="button" type="submit">Suscribirme</button>
          </form>
        </section>

        <section className="section cart-layout" id="cart">
          <div>
            <div className="toolbar">
              <span>Tu bolsa</span>
              <span>{cartCount} productos</span>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <p>Tu bolsa está vacía.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-line" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{money.format(item.price)}</p>
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <button className="remove-item" type="button" onClick={() => removeProduct(item.id)}>
                      Eliminar
                    </button>
                  </div>
                  <strong>{money.format(item.price * item.quantity)}</strong>
                </div>
              ))
            )}
          </div>

          <CartSummary subtotal={subtotal} shipping={shipping} total={total} onCheckout={checkout} />
        </section>
      </main>

      <footer className="footer">
        <div>
          <button type="button" className="logo-button footer-logo" onClick={() => handleCategorySelect('Todos')}>
            AMERICANINO
          </button>
          <p>Diseño para vivirlo todo.</p>
        </div>
        <div>
          <h3>Comprar</h3>
          {categories
            .filter((category) => category !== 'Todos')
            .map((category) => (
              <button key={category} type="button" className="footer-link" onClick={() => handleCategorySelect(category)}>
                {category}
              </button>
            ))}
        </div>
        <div>
          <h3>Ayuda</h3>
          <button type="button" className="footer-link" onClick={() => handleCategorySelect('Todos')}>
            Mi bolsa
          </button>
          <button type="button" className="footer-link" onClick={() => handleCategorySelect('Todos')}>
            Checkout
          </button>
          <button type="button" className="footer-link" onClick={() => handleCategorySelect('Lluvia')}>
            Envíos y cambios
          </button>
        </div>
        <div>
          <h3>Seguimos cerca</h3>
          <button type="button" className="footer-link" onClick={() => handleCategorySelect('Mujer')}>
            Instagram
          </button>
          <button type="button" className="footer-link" onClick={() => handleCategorySelect('Hombre')}>
            TikTok
          </button>
          <button type="button" className="footer-link" onClick={() => handleCategorySelect('Accesorios')}>
            Pinterest
          </button>
        </div>
      </footer>

      {toast ? <div className="toast show">{toast}</div> : null}
    </>
  );
}

export default App;
