// src/components/Filters.tsx
interface FiltersProps {
  filterMonth: string;
  filterYear: string;
  setFilterMonth: (month: string) => void;
  setFilterYear: (year: string) => void;
}

const Filters = ({
  filterMonth,
  filterYear,
  setFilterMonth,
  setFilterYear,
}: FiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Months</option>
        {Array.from({ length: 12 }, (_, i) => {
          const month = (i + 1).toString().padStart(2, "0");
          return (
            <option key={month} value={month}>
              {month}
            </option>
          );
        })}
      </select>
      <input
        type="number"
        placeholder="Year"
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default Filters;
