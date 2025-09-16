package com.t2.util;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class CalculatorTime {

    /**
     * Lấy khoảng thời gian của chu kỳ hiện tại (dựa trên today).
     * - DAY: [today, today]
     * - WEEK: [thứ 2 tuần này, chủ nhật tuần này]
     * - MONTH: [ngày 1, ngày cuối tháng hiện tại]
     * - YEAR: [01/01, 31/12 năm hiện tại]
     */
    public static DateRange getDateRangeOfCurrentCycle(String timeRange) {
        LocalDate today = LocalDate.now();

        switch (timeRange) {
            case "DAY":
                return new DateRange(today, today);

            case "WEEK":
                return new DateRange(today.with(DayOfWeek.MONDAY), today.with(DayOfWeek.SUNDAY));

            case "MONTH":
                return new DateRange(
                        today.withDayOfMonth(1),
                        today.withDayOfMonth(today.lengthOfMonth())
                );

            case "YEAR":
                return new DateRange(
                        today.withDayOfYear(1),
                        today.withDayOfYear(today.lengthOfYear())
                );

            default:
                throw new IllegalArgumentException("Unknown cycle: " + timeRange);
        }
    }

    /**
     * Lấy ngày kết thúc của chu kỳ chứa start.
     * - DAY: start
     * - WEEK: start + 6 ngày
     * - MONTH: cuối tháng chứa start
     * - YEAR: cuối năm chứa start
     */
    public static LocalDate getCycleEndDate(LocalDate start, String timeRange) {
        switch (timeRange) {
            case "DAY":
                return start;
            case "WEEK":
                return start.plusDays(6);
            case "MONTH":
                return start.withDayOfMonth(start.lengthOfMonth());
            case "YEAR":
                return start.withDayOfYear(start.lengthOfYear());
            default:
                throw new IllegalArgumentException("Thời gian không hợp lệ");
        }
    }

    /**
     * Tính hạn kết thúc sau 1 chu kỳ kể từ start.
     * - DAY: start + 1 ngày
     * - WEEK: start + 1 tuần
     * - MONTH: start + 1 tháng
     * - YEAR: start + 1 năm
     */
    public static LocalDate addCycle(LocalDate start, String timeRange) {
        switch (timeRange) {
            case "DAY":
                return start.plusDays(1);
            case "WEEK":
                return start.plusWeeks(1);
            case "MONTH":
                return start.plusMonths(1);
            case "YEAR":
                return start.plusYears(1);
            default:
                throw new IllegalArgumentException("Thời gian không hợp lệ");
        }
    }

    public static LocalDate addDays(LocalDate start, int days) {
        return start.plusDays(days);
    }

}
