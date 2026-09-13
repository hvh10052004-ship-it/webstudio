"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";

const VIEW = 240;
const OUT = 256;

export function AvatarCropper({
  onCropped,
  onCancel,
}: {
  onCropped: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [src, setSrc] = useState("");
  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1.15);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );

  const base = nat.w && nat.h ? VIEW / Math.min(nat.w, nat.h) : 1;
  const displayW = nat.w * base * zoom;
  const displayH = nat.h * base * zoom;

  function onFile(file: File | undefined) {
    if (!file) return;
    setSrc(URL.createObjectURL(file));
    setZoom(1.15);
    setPan({ x: 0, y: 0 });
    setNat({ w: 0, h: 0 });
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: pan.x, y: pan.y, px: e.clientX, py: e.clientY };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPan({
      x: drag.current.x + (e.clientX - drag.current.px),
      y: drag.current.y + (e.clientY - drag.current.py),
    });
  };

  const crop = useCallback(() => {
    const img = imgRef.current;
    if (!img || !nat.w) return;
    const left = (VIEW - displayW) / 2 + pan.x;
    const top = (VIEW - displayH) / 2 + pan.y;
    const sx = (-left / displayW) * nat.w;
    const sy = (-top / displayH) * nat.h;
    const sw = (VIEW / displayW) * nat.w;
    const sh = (VIEW / displayH) * nat.h;
    const canvas = document.createElement("canvas");
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, OUT, OUT);
    canvas.toBlob(
      (blob) => {
        if (blob) onCropped(blob);
      },
      "image/jpeg",
      0.9,
    );
  }, [displayH, displayW, nat.h, nat.w, onCropped, pan.x, pan.y]);

  return (
    <div className="app-crop">
      {!src ? (
        <label className="app-crop-pick">
          Chọn ảnh từ máy
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <>
          <p className="app-note">Kéo ảnh và zoom để chọn phần làm đại diện.</p>
          <div
            className="app-crop-view"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Ảnh để cắt"
              draggable={false}
              onLoad={(e) => {
                const el = e.currentTarget;
                setNat({ w: el.naturalWidth, h: el.naturalHeight });
              }}
              style={{
                width: displayW || "auto",
                height: displayH || "auto",
                left: (VIEW - displayW) / 2 + pan.x,
                top: (VIEW - displayH) / 2 + pan.y,
              }}
            />
          </div>
          <label className="app-field">
            <span>Phóng to</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
          <div className="app-site-actions">
            <button type="button" className="app-btn app-btn-dark" onClick={onCancel}>
              Hủy
            </button>
            <button type="button" className="app-btn app-btn-primary" onClick={crop}>
              Dùng phần này
            </button>
          </div>
        </>
      )}
    </div>
  );
}
