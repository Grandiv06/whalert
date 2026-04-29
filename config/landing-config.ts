/**
 * Landing section configuration and default content.
 * Used as fallback when DB is empty and for type/reference.
 */

export interface LandingPlatformItem {
  id: number;
  title: string | null;
  description: string | null;
  imageAddress: string | null;
}

export interface LandingStatItem {
  id: number;
  title: string | null;
  desc: string | null;
}

export const defaultStats: LandingStatItem[] = [
  { id: 1, title: "سیگنال‌های منتشر شده", desc: "۹۸٪" },
  { id: 2, title: "نرخ موفقیت", desc: "۹۲٪" },
  { id: 3, title: "کاربران فعال", desc: "۸۵٪" },
  { id: 4, title: "رضایت کاربران", desc: "۹۸٪" },
  { id: 5, title: "سال فعالیت", desc: "۵+" },
];

export interface LandingUserItem {
  id: number;
  name: string | null;
  imageAddress: string | null;
}

/** Mock traders data (21 items) — used by landing trader section instead of API */
export const defaultUsers: LandingUserItem[] = [
  { id: 1, name: "علی رضایی", imageAddress: "/images/1.jpg" },
  { id: 2, name: "محمد حسینی", imageAddress: "/images/1.jpg" },
  { id: 3, name: "امیر کریمی", imageAddress: "/images/1.jpg" },
  { id: 4, name: "سعید مرادی", imageAddress: "/images/1.jpg" },
  { id: 5, name: "مهدی رحیمی", imageAddress: "/images/1.jpg" },
  { id: 6, name: "رضا احمدی", imageAddress: "/images/1.jpg" },
  { id: 7, name: "حسین قاسمی", imageAddress: "/images/1.jpg" },
  { id: 8, name: "آرش محمدی", imageAddress: "/images/1.jpg" },
  { id: 9, name: "احسان توکلی", imageAddress: "/images/1.jpg" },
  { id: 10, name: "نیما سلیمانی", imageAddress: "/images/1.jpg" },
  { id: 11, name: "مجتبی عزیزی", imageAddress: "/images/1.jpg" },
  { id: 12, name: "فرهاد کاظمی", imageAddress: "/images/1.jpg" },
  { id: 13, name: "یوسف جلالی", imageAddress: "/images/1.jpg" },
  { id: 14, name: "مصطفی رستمی", imageAddress: "/images/1.jpg" },
  { id: 15, name: "پیام شفیعی", imageAddress: "/images/1.jpg" },
  { id: 16, name: "سامان حیدری", imageAddress: "/images/1.jpg" },
  { id: 17, name: "پویا اسکندری", imageAddress: "/images/1.jpg" },
  { id: 18, name: "مجید عباسی", imageAddress: "/images/1.jpg" },
  { id: 19, name: "حمید نوری", imageAddress: "/images/1.jpg" },
  { id: 20, name: "بهنام زارع", imageAddress: "/images/1.jpg" },
  { id: 21, name: "کاوه ملکی", imageAddress: "/images/1.jpg" },
];

export const defaultPlatforms: LandingPlatformItem[] = [
  {
    id: 1,
    title: "پلتفرم",
    description: "ساده و حرفه ای",
    imageAddress: "/images/platform1.svg",
  },
  {
    id: 2,
    title: "ارسال فوری",
    description: "سیگنال ها",
    imageAddress: "/images/platform2.svg",
  },
  {
    id: 3,
    title: "ردیابی",
    description: "عملکرد معامله گران",
    imageAddress: "/images/platform3.svg",
  },
  {
    id: 4,
    title: "سیگنال های",
    description: "دقیق و قابل اعتماد",
    imageAddress: "/images/platform4.svg",
  },
];

export interface LandingBlogItem {
  id: number;
  title: string | null;
  description: string | null;
  imageAddress: string | null;
}

/** Blog mock data (black-trader style) — used when API returns empty */
export const defaultBlogs: LandingBlogItem[] = [
  {
    id: 1,
    title: "لورم ایپسوم متن ساختگی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از",
    imageAddress: "/images/mobileCrypto.jpg",
  },
  {
    id: 2,
    title: "لورم ایپسوم متن ساختگی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از",
    imageAddress: "/images/coin.jpg",
  },
  {
    id: 3,
    title: "لورم ایپسوم متن ساختگی",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از",
    imageAddress: "/images/bitCoin.jpg",
  },
];

export interface LandingCommentProfile {
  imageAddress?: string | null;
  fullName?: string | null;
  date?: string | null;
}

export interface LandingCommentItem {
  id: number;
  rate: number | null;
  description: string | null;
  date?: string | null;
  profile: LandingCommentProfile | null;
}

/** Default comments for landing section when API returns empty */
export const defaultComments: LandingCommentItem[] = [
  {
    id: 1,
    rate: 5,
    description:
      "سیگنال‌های دقیق و به موقع. با والرت سودهای خوبی گرفتم و راضی هستم.",
    date: "۱۴۰۳/۰۶/۱۵",
    profile: {
      imageAddress: "/images/traders/person1.jpg",
      fullName: "علی رضایی",
      date: "۱۴۰۳/۰۶/۱۵",
    },
  },
  {
    id: 2,
    rate: 5,
    description:
      "پشتیبانی عالی و سیگنال‌های با کیفیت. به همه توصیه می‌کنم.",
    date: "۱۴۰۳/۰۶/۱۰",
    profile: {
      imageAddress: "/images/person1.jpg",
      fullName: "محمد حسینی",
      date: "۱۴۰۳/۰۶/۱۰",
    },
  },
  {
    id: 3,
    rate: 4,
    description: "نرخ موفقیت بالا و گزارش‌های شفاف. ممنون از تیم والرت.",
    date: "۱۴۰۳/۰۵/۲۸",
    profile: {
      imageAddress: "/images/traders/1.jpg",
      fullName: "امیر کریمی",
      date: "۱۴۰۳/۰۵/۲۸",
    },
  },
];
