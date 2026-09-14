const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product" key={product.id}>
      <div className="product-image">
        {product.badge ? <span className="badge">{product.badge}</span> : null}
        <img src={product.image} alt={product.name} />
        <button className="quick-add" type="button" onClick={() => onAdd(product)}>
          Añadir a la bolsa
        </button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <span className="price">
          {product.oldPrice ? (
            <>
              <span className="old-price">{money.format(product.oldPrice)}</span>
              <span className="sale-price">{money.format(product.price)}</span>
            </>
          ) : (
            money.format(product.price)
          )}
        </span>
      </div>
    </article>
  );
}
