"use client";

import { FormEvent, useState } from "react";

export function OrderForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="sales-form">
        <div className="sales-success">
          <h3>Đã nhận đơn của bạn</h3>
          <p className="sales-muted">
            Nhân viên sẽ gọi xác nhận trong 15–30 phút (8:00–21:00). Thanh toán
            khi nhận hàng nếu bạn chọn COD.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="sales-form" onSubmit={onSubmit}>
      <label htmlFor="sales-name">Họ tên</label>
      <input id="sales-name" name="name" required placeholder="Nguyễn Thị A" />

      <label htmlFor="sales-phone">Số điện thoại</label>
      <input
        id="sales-phone"
        name="phone"
        type="tel"
        required
        placeholder="09xx xxx xxx"
      />

      <label htmlFor="sales-address">Địa chỉ nhận hàng</label>
      <textarea
        id="sales-address"
        name="address"
        required
        placeholder="Số nhà, đường, phường, quận, tỉnh"
      />

      <label htmlFor="sales-bundle">Gói sản phẩm</label>
      <select id="sales-bundle" name="bundle" defaultValue="1">
        <option value="1">1 hộp — 449.000đ</option>
        <option value="2">2 hộp — 799.000đ (tiết kiệm 99k)</option>
        <option value="3">Combo 3 — 898.000đ (mua 2 tặng 1)</option>
      </select>

      <label htmlFor="sales-pay">Thanh toán</label>
      <select id="sales-pay" name="payment" defaultValue="cod">
        <option value="cod">COD — trả tiền khi nhận hàng</option>
        <option value="bank">Chuyển khoản trước</option>
      </select>

      <button className="sales-btn sales-btn-primary" type="submit">
        Đặt hàng — COD 0đ trước
      </button>
    </form>
  );
}
