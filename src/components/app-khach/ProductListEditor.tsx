"use client";

import {
  emptyProduct,
  parseProducts,
  type ProductItem,
} from "@/data/app-blocks";

export function ProductListEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const items = parseProducts(value);

  function setItems(next: ProductItem[]) {
    onChange(JSON.stringify(next));
  }

  function update(index: number, key: keyof ProductItem, text: string) {
    setItems(
      items.map((item, i) => (i === index ? { ...item, [key]: text } : item)),
    );
  }

  return (
    <div className="app-product-list">
      {items.map((item, index) => (
        <div className="app-product-card" key={index}>
          <div className="app-product-card-head">
            <strong>Sản phẩm {index + 1}</strong>
            {items.length > 1 ? (
              <button
                type="button"
                className="app-product-remove"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
              >
                Xóa
              </button>
            ) : null}
          </div>
          <label className="app-field">
            <span>Tên sản phẩm *</span>
            <input
              value={item.name}
              maxLength={50}
              placeholder="AURA Glow Essence 30ml"
              onChange={(e) => update(index, "name", e.target.value.slice(0, 50))}
            />
          </label>
          <label className="app-field">
            <span>Mô tả</span>
            <textarea
              value={item.desc}
              rows={2}
              maxLength={160}
              placeholder="Thành phần, công dụng ngắn..."
              onChange={(e) => update(index, "desc", e.target.value.slice(0, 160))}
            />
          </label>
          <label className="app-field">
            <span>Giá *</span>
            <input
              value={item.price}
              maxLength={20}
              placeholder="449.000đ"
              onChange={(e) => update(index, "price", e.target.value.slice(0, 20))}
            />
          </label>
          <label className="app-field">
            <span>Nút mua</span>
            <input
              value={item.cta}
              maxLength={24}
              placeholder="Mua ngay"
              onChange={(e) => update(index, "cta", e.target.value.slice(0, 24))}
            />
          </label>
        </div>
      ))}
      {items.length < 8 ? (
        <button
          type="button"
          className="app-btn app-btn-dark app-btn-full"
          onClick={() => setItems([...items, emptyProduct()])}
        >
          Thêm sản phẩm
        </button>
      ) : null}
    </div>
  );
}
