const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function CartSummary({ subtotal, shipping, total, onCheckout }) {
  return (
    <aside className="summary-box">
      <h2>Resumen</h2>
      <p>
        <span>Subtotal</span>
        <strong>{money.format(subtotal)}</strong>
      </p>
      <p>
        <span>Envío</span>
        <strong>{shipping === 0 ? 'Gratis' : money.format(shipping)}</strong>
      </p>
      <hr />
      <p className="summary-total">
        <span>Total</span>
        <strong>{money.format(total)}</strong>
      </p>
      <button className="button" type="button" onClick={onCheckout}>
        Confirmar compra
      </button>
    </aside>
  );
}
