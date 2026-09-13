const fs = require("fs");
const p = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep/styles.css";
let c = fs.readFileSync(p, "utf8");
if (c.includes(".sample-grid")) {
  console.log("exists");
  process.exit(0);
}

c += `

/* ===== LANDING SAMPLE GALLERY ===== */
.sample-section .section-description {
  margin-bottom: 28px;
}

.sample-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.sample-card {
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #121722;
  min-height: 240px;
}

.sample-card--wide {
  grid-column: 1 / -1;
  min-height: 320px;
}

.sample-card img {
  width: 100%;
  height: 100%;
  min-height: 240px;
  object-fit: cover;
  display: block;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.sample-card--wide img {
  min-height: 320px;
}

.sample-card:hover img {
  transform: scale(1.04);
}

.sample-card figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 20px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.78));
  display: grid;
  gap: 4px;
}

.sample-card figcaption strong {
  color: #fff;
  font-size: 18px;
}

.sample-card figcaption span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
}

body.theme-light .sample-card {
  border-color: rgba(18, 23, 34, 0.1);
  background: #e8ecf2;
}

@media (max-width: 700px) {
  .sample-grid {
    grid-template-columns: 1fr;
  }

  .sample-card--wide {
    grid-column: auto;
    min-height: 240px;
  }

  .sample-card--wide img {
    min-height: 240px;
  }
}
`;

fs.writeFileSync(p, c);
console.log("css ok");
