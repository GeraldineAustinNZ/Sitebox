export interface PricingBreakdown {
  weeks: number;
  weeklyRate: number;
  rentalPrice: number;
  deliveryFee: number;
  pickupFee: number;
  addonsCost: number;
  totalPrice: number;
}

export interface AddOnsSelection {
  hasPremiumLock: boolean;
  hasWheelClamp: boolean;
  hasGpsSecurity: boolean;
}

export interface ServiceAreaFee {
  area: string;
  deliveryFee: number;
}

export const SERVICE_AREAS: ServiceAreaFee[] = [
  { area: 'Wanaka', deliveryFee: 90 },
  { area: 'Queenstown', deliveryFee: 150 },
  { area: 'Cromwell', deliveryFee: 120 },
  { area: 'Albert Town', deliveryFee: 90 },
  { area: 'Hawea', deliveryFee: 100 },
  { area: 'Cardrona', deliveryFee: 110 },
  { area: 'Other', deliveryFee: 0 },
];

export const PICKUP_FEE = 90;

export const ADDON_PRICES = {
  PREMIUM_LOCK: 25,
  WHEEL_CLAMP_PER_WEEK: 15,
  GPS_SECURITY_PER_WEEK: 10,
};

export const BUNDLE_DISCOUNT_RATE = 0.10;

export function calculateWeeks(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.ceil(diffDays / 7));
}

export function getWeeklyRate(weeks: number, bookingType: 'standard' | 'trade'): number {
  if (bookingType === 'trade') {
    return 220;
  }

  if (weeks === 1) return 260;
  if (weeks === 2) return 250;
  if (weeks === 3) return 240;
  if (weeks === 4) return 230;
  return 210;
}

export function calculateAddOnsCost(
  weeks: number,
  addOns: AddOnsSelection
): number {
  const { hasPremiumLock, hasWheelClamp, hasGpsSecurity } = addOns;

  if (!hasPremiumLock && !hasWheelClamp && !hasGpsSecurity) {
    return 0;
  }

  let cost = 0;

  if (hasPremiumLock) {
    cost += ADDON_PRICES.PREMIUM_LOCK;
  }

  if (hasWheelClamp) {
    cost += ADDON_PRICES.WHEEL_CLAMP_PER_WEEK * weeks;
  }

  if (hasGpsSecurity) {
    cost += ADDON_PRICES.GPS_SECURITY_PER_WEEK * weeks;
  }

  const allSelected = hasPremiumLock && hasWheelClamp && hasGpsSecurity;
  if (allSelected) {
    cost = cost * (1 - BUNDLE_DISCOUNT_RATE);
  }

  return Math.round(cost * 100) / 100;
}

export function calculatePricing(
  startDate: Date,
  endDate: Date,
  deliveryAddress: string,
  bookingType: 'standard' | 'trade' = 'standard',
  addOns?: AddOnsSelection
): PricingBreakdown {
  const weeks = calculateWeeks(startDate, endDate);
  const weeklyRate = getWeeklyRate(weeks, bookingType);

  let rentalPrice = 0;

  if (bookingType === 'trade') {
    rentalPrice = weeklyRate * weeks;
  } else {
    if (weeks === 1) {
      rentalPrice = 260;
    } else if (weeks === 2) {
      rentalPrice = 500;
    } else if (weeks === 3) {
      rentalPrice = 720;
    } else if (weeks === 4) {
      rentalPrice = 920;
    } else if (weeks >= 5 && weeks <= 8) {
      rentalPrice = 920 + (weeks - 4) * 210;
    } else {
      rentalPrice = weeklyRate * weeks;
    }
  }

  const serviceArea = SERVICE_AREAS.find((sa) =>
    deliveryAddress.toLowerCase().includes(sa.area.toLowerCase())
  );

  const deliveryFee = serviceArea?.deliveryFee || 90;
  const pickupFee = deliveryFee;

  const addonsCost = addOns
    ? calculateAddOnsCost(weeks, addOns)
    : 0;

  const totalPrice = rentalPrice + deliveryFee + pickupFee + addonsCost;

  return {
    weeks,
    weeklyRate,
    rentalPrice,
    deliveryFee,
    pickupFee,
    addonsCost,
    totalPrice,
  };
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
