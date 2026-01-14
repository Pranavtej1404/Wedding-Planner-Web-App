export interface Vendor {
    id: number;
    userId: number;
    businessName: string;
    category: string;
    rating: number;
    priceRange: string;
    location: string;
    isVerified: boolean;
}

export interface ServiceType {
    id: number;
    vendorId: number;
    title: string;
    description: string;
    price: number;
    durationMinutes: number;
    isActive: boolean;
}

export interface Booking {
    id: number;
    userId: number;
    vendorId: number;
    serviceId: number;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
}

export interface DashboardStats {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
}
