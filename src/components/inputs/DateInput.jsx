import { useMemo } from 'react';
import { DatePicker } from '../../utils/date-picker.util';
import { dayjs } from '../../utils/dayjs.util.js';

export const DateInput = ({ value, onChange, placeholder }) => {
    const date = useMemo(() => (value ? dayjs(value) : undefined), [value]);

    const handleChange = (date) => {
        onChange?.(date ? dayjs(date).toISOString() : undefined);
    };

    return (
        <DatePicker showTime className="date-input" value={date} onChange={handleChange} placeholder={placeholder} />
    );
};
