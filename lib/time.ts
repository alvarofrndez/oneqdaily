/**
 * Zona horaria de referencia de la aplicación.
 * Todo el "día" de la app (pregunta activa, desbloqueos, contadores, fechas)
 * se calcula en esta zona, nunca en la del navegador ni en la del proceso.
 *
 * UTC porque es lo que ya usaba getTodayQuestion (toISOString) y lo que usa
 * Postgres en current_date. Si la cambias, cambia también la base de datos.
 */
export const APP_TIMEZONE = 'UTC';

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** 'YYYY-MM-DD' del instante dado, en la zona de la app. */
export function getAppDateKey(ms: number = Date.now()): string {
  return dateKeyFormatter.format(ms);
}

/** Instante (ms) en el que empieza el siguiente día de la app. */
export function getNextDayStart(ms: number = Date.now()): number {
  const today = getAppDateKey(ms);

  // Búsqueda binaria del primer instante cuyo día ya no es "hoy".
  // Válida para cualquier zona (incluidos cambios de hora de 23 y 25 h).
  let lo = ms;
  let hi = ms + 26 * 60 * 60 * 1000;

  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (getAppDateKey(mid) === today) lo = mid;
    else hi = mid;
  }

  return hi;
}

/** Formatea un 'YYYY-MM-DD' (columna `date`) sin desplazarlo por zona horaria. */
export function formatDateKey(
  dateKey: string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
    new Date(`${dateKey.slice(0, 10)}T00:00:00Z`)
  );
}

/** Formatea un instante (p. ej. created_at) en la zona de la app. */
export function formatInstant(
  value: string | number | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: APP_TIMEZONE,
  }).format(new Date(value));
}