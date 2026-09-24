'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { getAppDateKey } from '@/lib/time';

/** Diferencia (ms) entre el reloj del servidor y el del navegador. */
const ServerClockContext = createContext(0);

export function ServerClockProvider({
  serverNow,
  children,
}: {
  serverNow: number;
  children: React.ReactNode;
}) {
  // El offset queda algo por debajo de la realidad (la latencia de red): el
  // cliente va como mucho unos ms por detrás del servidor, nunca por delante.
  // Es el lado seguro: al desbloquear, el servidor ya habrá cambiado de día.
  const [offset] = useState(() => serverNow - Date.now());

  return (
    <ServerClockContext.Provider value={offset}>
      {children}
    </ServerClockContext.Provider>
  );
}

/** Hora actual del servidor (ms). `null` hasta que el cliente monta. */
export function useServerNow(tickMs = 1000): number | null {
  const offset = useContext(ServerClockContext);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now() + offset);
    tick();

    const interval = window.setInterval(tick, tickMs);
    return () => window.clearInterval(interval);
  }, [offset, tickMs]);

  return now;
}

/** Día actual del servidor ('YYYY-MM-DD'). Solo re-renderiza al cambiar de día. */
export function useServerDateKey(): string | null {
  const offset = useContext(ServerClockContext);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setKey(getAppDateKey(Date.now() + offset));
    tick();

    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [offset]);

  return key;
}