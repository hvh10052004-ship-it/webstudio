"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";

export function SwipePinRow({
  onReply,
  children,
}: {
  onReply: () => void;
  children: ReactNode;
}) {
  const [x, setX] = useState(0);
  const start = useRef(0);
  const offset = useRef(0);
  const dragging = useRef(false);

  function down(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    start.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const next = Math.max(-72, Math.min(0, e.clientX - start.current));
    offset.current = next;
    setX(next);
  }

  function up() {
    dragging.current = false;
    if (offset.current <= -48) onReply();
    offset.current = 0;
    setX(0);
  }

  return (
    <div className="chat-swipe">
      <div className="chat-swipe-action" aria-hidden="true" />
      <div
        className="chat-swipe-inner"
        style={{ transform: `translateX(${x}px)` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {children}
      </div>
    </div>
  );
}
