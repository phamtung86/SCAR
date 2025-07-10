// lib/utils/time-format.ts

export function formatTime(date: Date | string | number | null | undefined): string {
  if (!date) return '';

  try {
    let parsedDate: Date;

    if (typeof date === 'string') {
      // Trường hợp chuỗi là số timestamp
      if (!isNaN(Number(date)) && date.length > 10) {
        parsedDate = new Date(Number(date));
      } else {
        parsedDate = new Date(date);
      }
    } else if (typeof date === 'number') {
      parsedDate = new Date(date);
    } else {
      parsedDate = date;
    }

    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    return parsedDate.toLocaleTimeString('vi-VN', options);
  } catch (err) {
    console.error("Lỗi formatTime:", err);
    return '';
  }
}


export function formatDateToDate(date: Date | string | null | undefined): string {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return parsedDate.toLocaleString('vi-VN', options);
  } catch (err) {
    console.error("Lỗi formatDateToDate:", err);
    return '';
  }
}

export function formatDateToDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    return parsedDate.toLocaleString('vi-VN', options);
  } catch (err) {
    console.error("Lỗi formatDateToDateTime:", err);
    return '';
  }
}
