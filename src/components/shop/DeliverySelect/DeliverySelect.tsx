"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DeliverySelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentDate = new Date();
  const today = currentDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  const tomorrowDate = tomorrow.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDeliveryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    onChange(newValue);

    // Reset selected date if the selection is changed to TODAY or TOMORROW
    if (newValue !== "SPECIFIC_DATE") {
      setSelectedDate(null);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date); // Handle null as well
  };

  return (
    <div className="delivery-select">
      <label>Chọn hình thức giao hàng</label>
      <select value={value} onChange={handleDeliveryChange} required>
        <option value="TODAY">
          Giao trong ngày - {today}
        </option>
        <option value="TOMORROW">
          Giao ngày mai - {tomorrowDate}
        </option>
        <option value="SPECIFIC_DATE">Giao vào ngày cụ thể</option>
      </select>

      {value === "SPECIFIC_DATE" && (
        <div className="calendar-container">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()} // Ensure it doesn't allow past dates
          />
          {selectedDate && (
            <p>
              Giao vào ngày {selectedDate.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliverySelect;
