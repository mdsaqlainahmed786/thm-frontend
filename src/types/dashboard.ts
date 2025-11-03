export interface Statistics {
    statistics: StatisticsData
}

export interface StatisticsData {
    users: StatisticData
    posts: StatisticData
    businessProfiles: StatisticData
    reports: StatisticData
}

export interface StatisticData {
    count: number
    percentage: number
}

export interface BookingStatistics {
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
}