package com.weddingplanner.backend.service;

import com.weddingplanner.algorithms.analytics.FenwickTree;
import com.weddingplanner.algorithms.analytics.PrefixSum;
import com.weddingplanner.backend.model.Booking;
import com.weddingplanner.backend.model.BookingStatus;
import com.weddingplanner.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private BookingRepository bookingRepository;

    private FenwickTree dailyRevenueTree;
    private PrefixSum historicalRevenueSum;
    private final int DAYS_IN_YEAR = 366;

    @PostConstruct
    public void init() {
        refreshAnalytics();
    }

    public void refreshAnalytics() {
        List<Booking> allBookings = bookingRepository.findAll();

        // Initialize BIT for real-time daily revenue tracking (last 365 days)
        dailyRevenueTree = new FenwickTree(DAYS_IN_YEAR);

        LocalDate today = LocalDate.now();

        for (Booking b : allBookings) {
            if (b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED) {
                LocalDate bookingDate = b.getStartTime().toLocalDate();
                long daysAgo = java.time.temporal.ChronoUnit.DAYS.between(bookingDate, today);

                if (daysAgo >= 0 && daysAgo < DAYS_IN_YEAR) {
                    int index = DAYS_IN_YEAR - 1 - (int) daysAgo;
                    dailyRevenueTree.update(index, b.getService().getPrice());
                }
            }
        }

        // Initialize Prefix Sum for historical static data (e.g. monthly revenue for
        // last 12 months)
        double[] monthlyData = new double[12];
        for (Booking b : allBookings) {
            if (b.getStatus() == BookingStatus.CONFIRMED || b.getStatus() == BookingStatus.COMPLETED) {
                LocalDate bookingDate = b.getStartTime().toLocalDate();
                if (bookingDate.getYear() == today.getYear()) {
                    int month = bookingDate.getMonthValue() - 1;
                    monthlyData[month] += b.getService().getPrice();
                }
            }
        }
        historicalRevenueSum = new PrefixSum(monthlyData);
    }

    public double getRevenueInRange(int startDay, int endDay) {
        return dailyRevenueTree.queryRange(startDay, endDay);
    }

    public double getMonthlyRevenue(int startMonth, int endMonth) {
        return historicalRevenueSum.getRangeSum(startMonth, endMonth);
    }

    public Map<String, Object> getTrendData() {
        Map<String, Object> trends = new HashMap<>();
        List<Double> daily = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            int dayIndex = DAYS_IN_YEAR - 30 + i;
            daily.add(dailyRevenueTree.queryRange(dayIndex, dayIndex));
        }
        trends.put("last30Days", daily);

        List<Double> monthly = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthly.add(historicalRevenueSum.getRangeSum(i, i));
        }
        trends.put("monthly", monthly);

        return trends;
    }
}
