"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  text: string;
  start: string;
  end: string;
  monthKey: string;
  starred?: boolean;
};

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

type MonthArtwork = {
  month: string;
  mood: string;
  location: string;
  photographer: string;
  sourceLabel: string;
  sourceUrl: string;
  localImage: string;
};

type NoteMode = "single" | "multiple";
type ThemeMode = "light" | "dark";

const STORAGE_KEY = "calendar-wall-notes";
const repoBasePath = process.env.GITHUB_PAGES === "true" ? "/Interactive_Calendar-" : "";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const THEME_STORAGE_KEY = "calendar-theme-mode";

function assetPath(path: string) {
  return `${repoBasePath}${path}`;
}

const monthArtwork: MonthArtwork[] = [
  {
    month: "January",
    mood: "Aurora season",
    location: "Norway",
    photographer: "Anthony's astro",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Aurora_mountain.jpg",
    localImage: assetPath("/months/jan.jpg")
  },
  {
    month: "February",
    mood: "Quiet thaw",
    location: "Winter forest",
    photographer: "TatyanaTimoshenko",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sunrise_in_the_winter_forest.jpg",
    localImage: assetPath("/months/feb.jpg")
  },
  {
    month: "March",
    mood: "First green",
    location: "Schleierfalle, Germany",
    photographer: "Richard Hierner",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Spring_forest.jpg",
    localImage: assetPath("/months/mar.jpg")
  },
  {
    month: "April",
    mood: "Cherry blossom morning",
    location: "Prospect Park, Brooklyn",
    photographer: "Rhododendrites",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:April_Blossoms_-_Japanese_cherry_tree_in_Prospect_Park.jpg",
    localImage: assetPath("/months/apr.jpg")
  },
  {
    month: "May",
    mood: "High alpine air",
    location: "Mountain lake",
    photographer: "Shubham",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Mountain.jpg",
    localImage: assetPath("/months/may.jpg")
  },
  {
    month: "June",
    mood: "Long-day clarity",
    location: "Cambridge, US",
    photographer: "Kunal Mukherjee",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Forest_lake_(3219887761).jpg",
    localImage: assetPath("/months/jun.jpg")
  },
  {
    month: "July",
    mood: "Open summer",
    location: "Parc Slip nature reserve",
    photographer: "Alan Hughes",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Summer_meadow_(geograph_7243101).jpg",
    localImage: assetPath("/months/jul.jpg")
  },
  {
    month: "August",
    mood: "Crystal summer lake",
    location: "Teletskoye Lake",
    photographer: "A.Savin",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F_%D0%BA%D0%BE%D1%81%D0%B0_%D0%A2%D0%B5%D0%BB%D0%B5%D1%86%D0%BA%D0%BE%D0%B5_%D0%BE%D0%B7%D0%B5%D1%80%D0%BE.jpg",
    localImage: assetPath("/months/aug.jpg")
  },
  {
    month: "September",
    mood: "Golden meadow",
    location: "Karnataka, India",
    photographer: "MuraliMenon22",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Landscape_with_the_meadow.jpg",
    localImage: assetPath("/months/sep.jpg")
  },
  {
    month: "October",
    mood: "Autumn forest reflections",
    location: "Lake shore",
    photographer: "Arild Vågen",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Autumn_forest_by_the_lake_(52580612707).jpg",
    localImage: assetPath("/months/oct.jpg")
  },
  {
    month: "November",
    mood: "Cold reflections",
    location: "Lake and birch forest",
    photographer: "kishjar?",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Autumn_(51558088432).jpg",
    localImage: assetPath("/months/nov.jpg")
  },
  {
    month: "December",
    mood: "Snow line",
    location: "Mountain range",
    photographer: "Muhammad Ali",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Snow_and_Mountains.jpg",
    localImage: assetPath("/months/dec.jpg")
  }
];

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date) {
  const normalized = stripTime(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) {
    return false;
  }

  return toIsoDate(a) === toIsoDate(b);
}

function isWithinRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) {
    return false;
  }

  const value = stripTime(date).getTime();
  return value > stripTime(start).getTime() && value < stripTime(end).getTime();
}

function buildMonthGrid(baseDate: Date) {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const days: CalendarDay[] = [];
  const cursor = new Date(gridStart);

  while (days.length < 42) {
    days.push({
      date: new Date(cursor),
      currentMonth: cursor.getMonth() === baseDate.getMonth()
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function formatRange(start: string, end: string) {
  const startDate = fromIsoDate(start);
  const endDate = fromIsoDate(end);

  if (start === end) {
    return `${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
  }

  const sameMonthRange = startDate.getMonth() === endDate.getMonth();
  const sameYearRange = startDate.getFullYear() === endDate.getFullYear();

  if (sameMonthRange && sameYearRange) {
    return `${monthNames[startDate.getMonth()]} ${startDate.getDate()} to ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  if (sameYearRange) {
    return `${monthNames[startDate.getMonth()]} ${startDate.getDate()} to ${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  return `${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()} to ${monthNames[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
}

function getSeason(monthIndex: number) {
  if ([11, 0, 1].includes(monthIndex)) {
    return "winter";
  }

  if ([2, 3, 4].includes(monthIndex)) {
    return "spring";
  }

  if ([5, 6, 7].includes(monthIndex)) {
    return "summer";
  }

  return "autumn";
}

export default function Home() {
  const today = useMemo(() => stripTime(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [noteMode, setNoteMode] = useState<NoteMode>("single");
  const [rangeStart, setRangeStart] = useState<Date | null>(today);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(today);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  const monthKey = `${visibleMonth.getFullYear()}-${String(
    visibleMonth.getMonth() + 1
  ).padStart(2, "0")}`;
  const days = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const activeArtwork = monthArtwork[visibleMonth.getMonth()];
  const activeSeason = getSeason(visibleMonth.getMonth());

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Note[];
      setNotes(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const visibleNotes = notes
    .filter((note) => note.monthKey === monthKey)
    .sort((a, b) => a.start.localeCompare(b.start));

  function selectDate(date: Date) {
    if (noteMode === "single") {
      setRangeStart(date);
      setRangeEnd(date);
      return;
    }

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }

    if (stripTime(date).getTime() < stripTime(rangeStart).getTime()) {
      setRangeStart(date);
      setRangeEnd(rangeStart);
      return;
    }

    setRangeEnd(date);
  }

  function changeNoteMode(mode: NoteMode) {
    setNoteMode(mode);

    if (mode === "single") {
      const nextDate = rangeStart ?? rangeEnd ?? today;
      setRangeStart(nextDate);
      setRangeEnd(nextDate);
      return;
    }

    const nextStart = rangeStart ?? today;
    setRangeStart(nextStart);
    setRangeEnd(null);
  }

  function changeMonth(offset: number) {
    const nextMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + offset,
      1
    );
    setVisibleMonth(nextMonth);
  }

  function saveNote() {
    if (!rangeStart || !rangeEnd || !noteText.trim()) {
      return;
    }

    const nextNote: Note = {
      id: crypto.randomUUID(),
      text: noteText.trim(),
      start: toIsoDate(rangeStart),
      end: toIsoDate(rangeEnd),
      monthKey,
    };

    setNotes((current) => [nextNote, ...current]);
    setNoteText("");
  }

  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
  }

  function clearAllVisibleNotes() {
    setNotes((current) => current.filter((note) => note.monthKey !== monthKey));
  }

  function toggleStarred(id: string) {
    setNotes((current) =>
      current.map((note) =>
        note.id === id ? { ...note, starred: !note.starred } : note
      )
    );
  }

  function clearSelectedDates() {
    setRangeStart(null);
    setRangeEnd(null);
  }

  const heroCaption =
    rangeStart && rangeEnd
      ? noteMode === "single"
        ? formatRange(toIsoDate(rangeStart), toIsoDate(rangeEnd))
        : formatRange(toIsoDate(rangeStart), toIsoDate(rangeEnd))
      : "Select a start date, then an end date to create a multi-day note.";

  const selectionLabel =
    noteMode === "single"
      ? "Tap a day to create a note for that date."
      : rangeStart && !rangeEnd
        ? "Pick the ending day for this note range."
        : "Select a start date, then an end date for a multi-day note.";

  return (
    <main className={`page-shell page-shell-${themeMode}`}>
      <section className="calendar-stage">
        <div className={`season-atmosphere season-${activeSeason}`} aria-hidden="true">
          <span className="season-orb orb-one" />
          <span className="season-orb orb-two" />
          <span className="season-orb orb-three" />
          <span className="season-particle particle-1" />
          <span className="season-particle particle-2" />
          <span className="season-particle particle-3" />
          <span className="season-particle particle-4" />
          <span className="season-particle particle-5" />
          <span className="season-particle particle-6" />
        </div>
        <article className={`calendar-shell theme-${themeMode}`}>
          <div className="ambient ambient-one" aria-hidden="true" />
          <div className="ambient ambient-two" aria-hidden="true" />

          <header className="topbar">
            <div>
              <p className="eyebrow">Interactive calendar</p>
              <h1>Seasonal planner</h1>
            </div>
            <div className="topbar-controls">
              <div className="topbar-meta">
                <span>Monthly artwork</span>
                <strong>{activeArtwork.sourceLabel}</strong>
              </div>
              <button
                type="button"
                className="theme-toggle"
                onClick={() =>
                  setThemeMode((current) => (current === "light" ? "dark" : "light"))
                }
                aria-label={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
              >
                {themeMode === "light" ? "Dark mode" : "Light mode"}
              </button>
            </div>
          </header>

          <section className="hero-panel">
            <div className="hero-photo">
              <Image
                src={activeArtwork.localImage}
                alt={`${activeArtwork.month} nature photography`}
                fill
                priority
                className="poster-image"
                sizes="(max-width: 900px) 100vw, 60vw"
              />
              <div className="hero-scrim" />
            </div>

            <div className="hero-content">
              <div className="hero-kicker">
                <span>{visibleMonth.getFullYear()}</span>
                <span>{activeArtwork.location}</span>
              </div>
              <div className="hero-title-block">
                <h2>{activeArtwork.month}</h2>
                <p>{activeArtwork.mood}</p>
              </div>
              <div className="hero-credit">
                <span>Photo by {activeArtwork.photographer}</span>
                <a href={activeArtwork.sourceUrl} target="_blank" rel="noreferrer">
                  View source
                </a>
              </div>
            </div>
          </section>

          <div className="month-rail" aria-label="Jump to month">
            {monthNames.map((month, index) => (
              <button
                key={month}
                type="button"
                className={index === visibleMonth.getMonth() ? "is-active" : ""}
                onClick={() =>
                  setVisibleMonth(new Date(visibleMonth.getFullYear(), index, 1))
                }
              >
                <span>{month.slice(0, 3)}</span>
              </button>
            ))}
          </div>

          <div className="calendar-body">
            <section className="grid-column glass-panel">
              <header className="planner-header">
                <div>
                  <p className="eyebrow">Calendar</p>
                  <h3>
                    {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                  </h3>
                </div>
                <div className="month-controls">
                  <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
                    Prev
                  </button>
                  <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
                    Next
                  </button>
                </div>
              </header>

              <div className="weekdays" aria-hidden="true">
                {weekdayNames.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="calendar-grid" role="grid" aria-label="Calendar date range picker">
                {days.map((day) => {
                  const isStart = sameDay(day.date, rangeStart);
                  const isEnd = sameDay(day.date, rangeEnd);
                  const inRange = isWithinRange(day.date, rangeStart, rangeEnd);
                  const iso = toIsoDate(day.date);
                  const hasNote = visibleNotes.some(
                    (note) => iso >= note.start && iso <= note.end
                  );
                  const singleDayNote = visibleNotes.find(
                    (note) => note.start === iso && note.end === iso
                  );
                  const hasStarredNote = visibleNotes.some(
                    (note) => note.starred && iso >= note.start && iso <= note.end
                  );

                  return (
                    <button
                      key={iso}
                      type="button"
                      className={[
                        "day-cell",
                        day.currentMonth ? "" : "is-muted",
                        isStart ? "is-start" : "",
                        isEnd ? "is-end" : "",
                        inRange ? "is-range" : "",
                        hasNote ? "has-note" : "",
                        hasStarredNote ? "is-starred" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => selectDate(day.date)}
                      aria-pressed={isStart || isEnd || inRange}
                    >
                      <span className="day-number">{day.date.getDate()}</span>
                      {singleDayNote ? (
                        <span className="day-preview">
                          {singleDayNote.text.length > 24
                            ? `${singleDayNote.text.slice(0, 24)}...`
                            : singleDayNote.text}
                        </span>
                      ) : null}
                      {hasStarredNote ? <span className="star-badge">★</span> : null}
                      {hasNote ? <span className="note-dot" /> : null}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="notes-column">
              <div className="glass-panel inspector-panel">
                <div className="notes-heading">
                  <div>
                    <p className="eyebrow">
                      {noteMode === "single" ? "Selected day" : "Selected range"}
                    </p>
                    <h4>{heroCaption}</h4>
                  </div>
                  <div className="notes-actions">
                    {noteMode === "multiple" && (rangeStart || rangeEnd) ? (
                      <button
                        type="button"
                        className="range-mode-link"
                        onClick={clearSelectedDates}
                      >
                        Clear selected dates
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="range-mode-link"
                      onClick={() =>
                        changeNoteMode(noteMode === "single" ? "multiple" : "single")
                      }
                    >
                      {noteMode === "single" ? "Use multiple days" : "Back to single day"}
                    </button>
                  </div>
                </div>

                <p className="notes-hint">{selectionLabel}</p>

                <label className="notes-label" htmlFor="note-text">
                  Memo for{" "}
                  {rangeStart && rangeEnd
                    ? formatRange(toIsoDate(rangeStart), toIsoDate(rangeEnd))
                    : "the selected dates"}
                </label>
                <textarea
                  id="note-text"
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="Packing list, launch checklist, shot list, route plan..."
                  rows={5}
                />
                <button
                  type="button"
                  className="save-note"
                  onClick={saveNote}
                  disabled={!rangeStart || !rangeEnd || !noteText.trim()}
                >
                  Save note
                </button>
              </div>

              <div className="glass-panel notes-list-panel">
                <div className="saved-notes-header">
                  <div>
                    <p className="eyebrow">Saved notes</p>
                    <span>{visibleNotes.length} entries</span>
                  </div>
                  {visibleNotes.length > 0 ? (
                    <button
                      type="button"
                      className="clear-notes-button"
                      onClick={clearAllVisibleNotes}
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>
                <div className="note-list" aria-live="polite">
                  {visibleNotes.length === 0 ? (
                    <p className="empty-state">
                      No notes for this month yet. Pick a day or a range and leave yourself a cue.
                    </p>
                  ) : (
                    visibleNotes.map((note) => (
                      <article key={note.id} className="note-item">
                        <div>
                          <p className="note-range">{formatRange(note.start, note.end)}</p>
                          <p className="note-copy">{note.text}</p>
                        </div>
                        <details className="note-menu">
                          <summary aria-label="Note options">•••</summary>
                          <div className="note-menu-popover">
                            <button type="button" onClick={() => toggleStarred(note.id)}>
                              {note.starred ? "Unstar" : "Star"}
                            </button>
                            <button type="button" onClick={() => deleteNote(note.id)}>
                              Delete
                            </button>
                          </div>
                        </details>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
