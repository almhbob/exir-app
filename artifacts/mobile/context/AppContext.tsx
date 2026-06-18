import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "patient" | "doctor" | null;

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  specialtyEn: string;
  rating: number;
  reviewCount: number;
  experience: number;
  price: number;
  available: boolean;
  distance: string;
  bio: string;
  languages: string[];
  certifications: string[];
  avatar: string;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  address: string;
  notes: string;
  price: number;
  rated?: boolean;
  type?: "home" | "online";
}

export interface JobListing {
  id: string;
  title: string;
  facility: string;
  location: string;
  type: "full_time" | "part_time" | "freelance";
  specialty: string;
  salary: string;
  posted: string;
  urgent: boolean;
  description: string;
}

export interface MedicalResult {
  id: string;
  title: string;
  category: "lab" | "xray" | "prescription" | "report" | "other";
  cloudinaryUrl: string;
  publicId: string;
  uploadedAt: string;
  notes?: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  doctorId: string;
  doctorName: string;
  stars: number;
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  bloodType: string;
  age: string;
  specialty?: string;
  experience?: string;
  licenseNumber?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  medicalResults?: MedicalResult[];
}

interface AppContextType {
  isLoggedIn: boolean;
  userRole: UserRole;
  userProfile: UserProfile;
  bookings: Booking[];
  ratings: Rating[];
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  cancelBooking: (id: string) => Promise<void>;
  addRating: (rating: Rating) => Promise<void>;
  markBookingRated: (bookingId: string) => Promise<void>;
  doctors: DoctorProfile[];
  jobs: JobListing[];
  specialties: { id: string; name: string; icon: string; count: number }[];
}

const defaultProfile: UserProfile = {
  name: "",
  phone: "",
  address: "",
  bloodType: "A+",
  age: "",
};

const MOCK_DOCTORS: DoctorProfile[] = [
  {
    id: "d1",
    name: "د. أحمد الخالد",
    specialty: "طب عام",
    specialtyEn: "General Practice",
    rating: 4.9,
    reviewCount: 284,
    experience: 12,
    price: 120,
    available: true,
    distance: "1.2 كم",
    bio: "طبيب عام متخصص بالرعاية الأولية والأمراض المزمنة. خبرة واسعة في الزيارات المنزلية وعلاج الحالات الحادة والمزمنة.",
    languages: ["العربية", "الإنجليزية"],
    certifications: ["بورد طب الأسرة", "شهادة الإسعافات الأولية"],
    avatar: "AK",
  },
  {
    id: "d2",
    name: "د. سارة المنصور",
    specialty: "طب الأطفال",
    specialtyEn: "Pediatrics",
    rating: 4.8,
    reviewCount: 196,
    experience: 9,
    price: 150,
    available: true,
    distance: "2.1 كم",
    bio: "متخصصة في طب الأطفال حديثي الولادة والرضع والأطفال حتى سن 18. خبرة في الأمراض الشائعة والمتابعة التنموية.",
    languages: ["العربية", "الإنجليزية", "الفرنسية"],
    certifications: ["بورد طب الأطفال", "شهادة الرضاعة الطبيعية"],
    avatar: "SM",
  },
  {
    id: "d3",
    name: "د. محمد الرشيد",
    specialty: "أمراض الباطنة",
    specialtyEn: "Internal Medicine",
    rating: 4.7,
    reviewCount: 152,
    experience: 15,
    price: 180,
    available: true,
    distance: "3.5 كم",
    bio: "استشاري أمراض باطنة متخصص بالسكري وأمراض القلب والغدد الصماء. يقدم خدمة زيارة منزلية شاملة.",
    languages: ["العربية"],
    certifications: ["بورد الباطنة", "زمالة أمراض السكري"],
    avatar: "MR",
  },
  {
    id: "d4",
    name: "د. نورة العمري",
    specialty: "أمراض الجلد",
    specialtyEn: "Dermatology",
    rating: 4.9,
    reviewCount: 310,
    experience: 8,
    price: 160,
    available: false,
    distance: "4.0 كم",
    bio: "متخصصة بأمراض الجلد والتجميل والشعر والأظافر. تقدم تشخيصاً دقيقاً وعلاجاً فعالاً للحالات الجلدية.",
    languages: ["العربية", "الإنجليزية"],
    certifications: ["بورد أمراض الجلد", "شهادة الليزر الطبي"],
    avatar: "NA",
  },
  {
    id: "d5",
    name: "د. خالد العتيبي",
    specialty: "العظام والمفاصل",
    specialtyEn: "Orthopedics",
    rating: 4.6,
    reviewCount: 98,
    experience: 11,
    price: 200,
    available: true,
    distance: "5.2 كم",
    bio: "جراح عظام متخصص بإصابات الملاعب والمفاصل الصناعية وعلاج آلام الظهر.",
    languages: ["العربية", "الإنجليزية"],
    certifications: ["بورد جراحة العظام", "زمالة المفاصل الصناعية"],
    avatar: "KA",
  },
  {
    id: "d6",
    name: "د. ريم السالم",
    specialty: "القلب والأوعية",
    specialtyEn: "Cardiology",
    rating: 4.8,
    reviewCount: 203,
    experience: 14,
    price: 220,
    available: true,
    distance: "2.8 كم",
    bio: "استشارية قلبية متخصصة بتشخيص وعلاج أمراض القلب التاجية والفشل القلبي.",
    languages: ["العربية", "الإنجليزية"],
    certifications: ["بورد أمراض القلب", "زمالة القسطرة القلبية"],
    avatar: "RS",
  },
  {
    id: "d7",
    name: "د. عبدالله الحربي",
    specialty: "الأنف والأذن والحنجرة",
    specialtyEn: "ENT",
    rating: 4.7,
    reviewCount: 134,
    experience: 7,
    price: 140,
    available: true,
    distance: "1.8 كم",
    bio: "متخصص بأمراض الأذن والأنف والحنجرة والشخير وانقطاع التنفس أثناء النوم.",
    languages: ["العربية"],
    certifications: ["بورد الأنف والأذن والحنجرة"],
    avatar: "AH",
  },
  {
    id: "d8",
    name: "د. منى الشهري",
    specialty: "الصحة النفسية",
    specialtyEn: "Psychiatry",
    rating: 4.9,
    reviewCount: 167,
    experience: 10,
    price: 190,
    available: true,
    distance: "3.1 كم",
    bio: "طبيبة نفسية متخصصة بالاضطرابات المزاجية والقلق والاكتئاب واضطرابات النوم.",
    languages: ["العربية", "الإنجليزية"],
    certifications: ["بورد الطب النفسي", "شهادة العلاج المعرفي السلوكي"],
    avatar: "MS",
  },
];

const MOCK_JOBS: JobListing[] = [
  {
    id: "j1",
    title: "طبيب عائلة زيارات منزلية",
    facility: "منصة اكسير",
    location: "الرياض - جميع الأحياء",
    type: "freelance",
    specialty: "طب عام",
    salary: "800 - 2,500 ر.س / يوم",
    posted: "منذ يومين",
    urgent: true,
    description: "نبحث عن أطباء عامة للانضمام لمنصة اكسير وتقديم خدمات الزيارات المنزلية.",
  },
  {
    id: "j2",
    title: "ممرض/ة منزلي",
    facility: "مركز الرعاية الصحية المتكاملة",
    location: "جدة",
    type: "part_time",
    specialty: "التمريض",
    salary: "4,500 - 7,000 ر.س / شهر",
    posted: "منذ 3 أيام",
    urgent: true,
    description: "مطلوب ممرضون/ممرضات مؤهلون لتقديم الرعاية التمريضية المنزلية للمرضى المزمنين.",
  },
  {
    id: "j3",
    title: "فني مختبر متنقل",
    facility: "مختبرات الحياة الطبية",
    location: "الرياض",
    type: "freelance",
    specialty: "التحاليل المخبرية",
    salary: "600 - 1,200 ر.س / يوم",
    posted: "منذ 5 أيام",
    urgent: false,
    description: "فرصة لفنيي المختبرات للعمل بشكل مستقل في أخذ عينات الدم والتحاليل المنزلية.",
  },
  {
    id: "j4",
    title: "طبيب أطفال - عيادة منزلية",
    facility: "منصة اكسير",
    location: "الدمام - الخبر",
    type: "freelance",
    specialty: "طب الأطفال",
    salary: "1,200 - 3,000 ر.س / يوم",
    posted: "اليوم",
    urgent: true,
    description: "فرصة ذهبية لأطباء الأطفال للعمل بحرية وتحقيق دخل مرتفع من خلال منصتنا.",
  },
  {
    id: "j5",
    title: "أخصائي علاج طبيعي منزلي",
    facility: "مركز النهضة للعلاج الطبيعي",
    location: "الرياض",
    type: "part_time",
    specialty: "العلاج الطبيعي",
    salary: "5,000 - 9,000 ر.س / شهر",
    posted: "منذ أسبوع",
    urgent: false,
    description: "نوفر فرص عمل لأخصائيي العلاج الطبيعي لتقديم جلسات منزلية لمرضى التأهيل.",
  },
  {
    id: "j6",
    title: "صيدلاني توصيل دوائي",
    facility: "صيدليات الدواء السريع",
    location: "جدة",
    type: "full_time",
    specialty: "الصيدلة",
    salary: "6,000 - 9,500 ر.س / شهر",
    posted: "منذ 4 أيام",
    urgent: false,
    description: "صيدلانيون لإدارة الوصفات الطبية وضمان سلامة توصيل الأدوية للمرضى منزلياً.",
  },
  {
    id: "j7",
    title: "طبيب طوارئ - خدمات منزلية 24/7",
    facility: "خدمة الاستجابة السريعة",
    location: "الرياض",
    type: "freelance",
    specialty: "الطوارئ",
    salary: "1,800 - 4,500 ر.س / يوم",
    posted: "منذ يوم",
    urgent: true,
    description: "خدمة طبية طارئة منزلية تعمل على مدار الساعة. نحتاج أطباء طوارئ متمرسين.",
  },
  {
    id: "j8",
    title: "معالج نفسي / مرشد أسري",
    facility: "مركز الصحة النفسية الحديث",
    location: "الرياض - جدة",
    type: "freelance",
    specialty: "الصحة النفسية",
    salary: "700 - 1,500 ر.س / جلسة",
    posted: "منذ 6 أيام",
    urgent: false,
    description: "فرصة لمعالجين نفسيين ومرشدين أسريين لتقديم جلسات منزلية وعبر الفيديو.",
  },
];

const SPECIALTIES = [
  { id: "s1", name: "طب عام", icon: "heart", count: 48 },
  { id: "s2", name: "الأطفال", icon: "users", count: 32 },
  { id: "s3", name: "الباطنة", icon: "activity", count: 27 },
  { id: "s4", name: "الجلدية", icon: "sun", count: 21 },
  { id: "s5", name: "القلب", icon: "heart", count: 18 },
  { id: "s6", name: "العظام", icon: "zap", count: 15 },
  { id: "s7", name: "نفسية", icon: "cloud", count: 24 },
  { id: "s8", name: "العيون", icon: "eye", count: 12 },
];

const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  userRole: null,
  userProfile: defaultProfile,
  bookings: [],
  ratings: [],
  login: async () => {},
  logout: async () => {},
  setUserRole: () => {},
  setUserProfile: () => {},
  addBooking: () => {},
  updateBookingStatus: () => {},
  cancelBooking: async () => {},
  addRating: async () => {},
  markBookingRated: async () => {},
  doctors: MOCK_DOCTORS,
  jobs: MOCK_JOBS,
  specialties: SPECIALTIES,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile>(defaultProfile);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [loggedInData, roleData, profileData, bookingsData, ratingsData] =
        await Promise.all([
          AsyncStorage.getItem("isLoggedIn"),
          AsyncStorage.getItem("userRole"),
          AsyncStorage.getItem("userProfile"),
          AsyncStorage.getItem("bookings"),
          AsyncStorage.getItem("ratings"),
        ]);
      if (loggedInData === "true") setIsLoggedIn(true);
      if (roleData) setUserRoleState(roleData as UserRole);
      if (profileData) setUserProfileState(JSON.parse(profileData));
      if (bookingsData) setBookings(JSON.parse(bookingsData));
      if (ratingsData) setRatings(JSON.parse(ratingsData));
    } catch {}
  }

  async function login(phone: string) {
    setIsLoggedIn(true);
    const updated = { ...userProfile, phone };
    setUserProfileState(updated);
    await Promise.all([
      AsyncStorage.setItem("isLoggedIn", "true"),
      AsyncStorage.setItem("userProfile", JSON.stringify(updated)),
    ]);
  }

  async function logout() {
    setIsLoggedIn(false);
    setUserRoleState(null);
    setUserProfileState(defaultProfile);
    setBookings([]);
    setRatings([]);
    await AsyncStorage.multiRemove([
      "isLoggedIn",
      "userRole",
      "userProfile",
      "bookings",
      "ratings",
    ]);
  }

  async function setUserRole(role: UserRole) {
    setUserRoleState(role);
    if (role) {
      await AsyncStorage.setItem("userRole", role);
    } else {
      await AsyncStorage.removeItem("userRole");
    }
  }

  async function setUserProfile(partial: Partial<UserProfile>) {
    const updated = { ...userProfile, ...partial };
    setUserProfileState(updated);
    await AsyncStorage.setItem("userProfile", JSON.stringify(updated));
  }

  async function addBooking(booking: Booking) {
    const updated = [booking, ...bookings];
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  }

  async function updateBookingStatus(id: string, status: Booking["status"]) {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  }

  async function cancelBooking(id: string) {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b
    );
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  }

  async function addRating(rating: Rating) {
    const updated = [rating, ...ratings];
    setRatings(updated);
    await AsyncStorage.setItem("ratings", JSON.stringify(updated));
  }

  async function markBookingRated(bookingId: string) {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, rated: true } : b
    );
    setBookings(updated);
    await AsyncStorage.setItem("bookings", JSON.stringify(updated));
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        userRole,
        userProfile,
        bookings,
        ratings,
        login,
        logout,
        setUserRole,
        setUserProfile,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        addRating,
        markBookingRated,
        doctors: MOCK_DOCTORS,
        jobs: MOCK_JOBS,
        specialties: SPECIALTIES,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
