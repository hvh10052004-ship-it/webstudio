"use client";

import { FormEvent } from "react";

export function ContactForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Cảm ơn bạn! Yêu cầu của bạn đã được gửi.");
    event.currentTarget.reset();
  }

  return (
    <form className="contact-form" id="contactForm" onSubmit={onSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Họ tên</label>
          <input
            id="name"
            name="name"
            className="form-control"
            type="text"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            name="phone"
            className="form-control"
            type="tel"
            placeholder="09xx xxx xxx"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          className="form-control"
          type="email"
          placeholder="email@example.com"
        />
      </div>
      <div className="form-group">
        <label htmlFor="type">Loại Website</label>
        <select id="type" name="type" className="form-control" defaultValue="Landing Page">
          <option>Landing Page</option>
          <option>Website công ty</option>
          <option>Web bán hàng / E-commerce</option>
          <option>Website Startup / SaaS</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="message">Mô tả dự án</label>
        <textarea
          id="message"
          name="message"
          className="form-control"
          placeholder="Hãy mô tả website bạn muốn làm..."
        />
      </div>
      <button className="btn btn-primary" style={{ width: "100%" }} type="submit">
        Gửi yêu cầu →
      </button>
    </form>
  );
}
