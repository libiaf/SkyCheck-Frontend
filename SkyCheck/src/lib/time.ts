// Convierte un Date "local" (seleccionado por el usuario) a "YYYY-MM-DDTHH:mm:ss±HH:MM"
// usando una zona IANA (ej. "America/Mazatlan"), sin depender de la zona del navegador.
export function toISOWithTZ(date: Date, tz: string): string {
  // Tomamos los componentes en la zona tz
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map(p => [p.type, p.value]));
  const y = parts.year, M = parts.month, d = parts.day;
  const h = parts.hour, m = parts.minute, s = parts.second;

  // Calculamos el offset de la zona en esa fecha concreta
  // offsetMin = (hora_en_tz - hora_en_UTC)
  const asUTC = Date.UTC(+y, +M - 1, +d, +h, +m, +s);
  // Hora "local" en esa zona, expresada como epoch ms: construimos un Date con esos campos en la zona del navegador
  // y comparamos con la epoch UTC "asUTC".
  const local = new Date(+y, +M - 1, +d, +h, +m, +s).getTime();
  const offsetMin = Math.round((local - asUTC) / 60000); // minutos

  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const offHH = String(Math.floor(abs / 60)).padStart(2, '0');
  const offMM = String(abs % 60).padStart(2, '0');

  return `${y}-${M}-${d}T${h}:${m}:${s}${sign}${offHH}:${offMM}`;
}