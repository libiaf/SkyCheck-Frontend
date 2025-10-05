import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

import chevron from "../assets/chevron.svg";

type Props = {
  value?: Date | null;                    
  onChange?: (d: Date | null) => void;   
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  openToDate?: Date;
};

const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const addMonths = (base: Date, m: number) => {
  const y = base.getFullYear();
  const mo = base.getMonth();
  const d = base.getDate();
  const target = new Date(y, mo + m, 1);
  const dim = daysInMonth(target.getFullYear(), target.getMonth());
  target.setDate(Math.min(d, dim));
  target.setHours(0, 0, 0, 0);
  return target;
};
const monthsNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const ReactDatePicker: React.FC<Props> = ({
  value,
  onChange,
  className,
  minDate,
  maxDate,
  openToDate
}) => {
  // “hoy” a medianoche, auto-actualiza al cambiar de día
  const [today, setToday] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const id = setTimeout(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      setToday(d);
    }, midnight.getTime() - now.getTime());
    return () => clearTimeout(id);
  }, [today]);

  // estado interno SOLO si no te pasan `value`
  const [innerDate, setInnerDate] = useState<Date | null>(null);
  const selected = (value !== undefined ? value : innerDate) ?? null;

  const [open, setOpen] = useState(false);

  const minD = useMemo(() => minDate ?? addMonths(today, -2), [minDate, today]);
  const maxD = useMemo(() => maxDate ?? addMonths(today,  2), [maxDate, today]);
  const minYear = minD.getFullYear();
  const maxYear = maxD.getFullYear();

  const placeholder = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
        .format(today),
    [today]
  );

  const handleChange = (d: Date | null) => {
    if (value === undefined) {
      // modo no controlado: guardamos local
      setInnerDate(d);
    }
    onChange?.(d); // SIEMPRE notificamos al padre si existe
  };

  return (
    <div className={`date-wrapper ${open ? "is-open" : ""}`}>
      <DatePicker
        className={`date-input ${className ?? ""}`}
        calendarClassName="dp-calendar"
        popperClassName="dp-popper"

        selected={selected}
        onChange={handleChange}
        dateFormat="MMM d, yyyy"
        placeholderText={placeholder}
        onCalendarOpen={() => setOpen(true)}
        onCalendarClose={() => setOpen(false)}
        minDate={minD}
        maxDate={maxD}
        openToDate={openToDate ?? today}
        renderCustomHeader={({
          date: viewDate,
          changeYear, changeMonth,
          decreaseMonth, increaseMonth,
          prevMonthButtonDisabled, nextMonthButtonDisabled,
        }) => {
          const viewYear = viewDate.getFullYear();
          const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
          const startMonth = viewYear === minYear ? minD.getMonth() : 0;
          const endMonth   = viewYear === maxYear ? maxD.getMonth()  : 11;
          const months = monthsNames
            .map((name, idx) => ({ name, idx }))
            .filter(m => m.idx >= startMonth && m.idx <= endMonth);

          const clampMonthIfNeeded = (targetYear: number) => {
            const cur = viewDate.getMonth();
            let next = cur;
            if (targetYear === minYear && cur < startMonth) next = startMonth;
            if (targetYear === maxYear && cur > endMonth)   next = endMonth;
            if (next !== cur) changeMonth(next);
          };

          return (
            <div className="dp-header">
              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>‹</button>
              <select
                value={viewYear}
                onChange={(e) => { const y = Number(e.target.value); clampMonthIfNeeded(y); changeYear(y); }}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={viewDate.getMonth()}
                onChange={(e) => changeMonth(Number(e.target.value))}
              >
                {months.map(m => <option key={m.idx} value={m.idx}>{m.name}</option>)}
              </select>
              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>›</button>
            </div>
          );
        }}
      />

      <img src={chevron} alt="" aria-hidden="true" className="date-chevron" />
    </div>
  );
};

export default ReactDatePicker;