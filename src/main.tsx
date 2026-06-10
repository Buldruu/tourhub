import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import './app.css';

type Lang = 'mn' | 'en';
type Txt = { mn: string; en: string };
type BookingType = 'tour' | 'hotel' | 'visa' | 'avia' | 'contact';
type BookingStatus = 'new' | 'processing' | 'done' | 'cancelled';
type Booking = {
  id: string;
  ts: number;
  type: BookingType;
  status: BookingStatus;
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  date?: string;
  pax?: string;
  budget?: string;
  country?: string;
  city?: string;
  hotelType?: string;
  from?: string;
  to?: string;
  service?: string;
  note?: string;
};

type BookingContext = {
  type: BookingType;
  title: Txt;
  badge: Txt;
  subtitle: Txt;
  button: Txt;
  preset?: string;
};

const cfg = {
  waLink: import.meta.env.VITE_WHATSAPP_LINK || 'https://wa.me/97699990000',
  fbLink: import.meta.env.VITE_FACEBOOK_MESSENGER_LINK || 'https://m.me/aylal',
  phone: import.meta.env.VITE_PHONE || '+976 9999-0000',
  adminUser: import.meta.env.VITE_ADMIN_USERNAME || '',
  adminPass: import.meta.env.VITE_ADMIN_PASSWORD || '',
};

const text = (v: Txt, lang: Lang) => v[lang];
const imgStyle = (url: string) => ({ ['--img' as string]: `url('${url}')` } as React.CSSProperties);
const pageBg = (url: string) => ({ ['--page-bg' as string]: `url('${url}')` } as React.CSSProperties);

const ui = {
  nav: [
    ['home', { mn: 'Нүүр', en: 'Home' }],
    ['destinations', { mn: 'Гадаад аялал', en: 'International' }],
    ['domestic', { mn: 'Дотоод аялал', en: 'Domestic' }],
    ['services', { mn: 'Үйлчилгээ', en: 'Services' }],
    ['avia', { mn: '✈ Авиа', en: '✈ Aviation' }],
    ['visa', { mn: 'Виз', en: 'Visa' }],
    ['hotel', { mn: 'Буудал', en: 'Hotels' }],
    ['tickets', { mn: 'Тасалбар', en: 'Tickets' }],
  ] as [string, Txt][],
  contact: { mn: 'Холбоо барих', en: 'Contact Us' },
  whatsapp: { mn: '💬 WhatsApp', en: '💬 WhatsApp' },
  book: { mn: 'Захиалах', en: 'Book now' },
  inquire: { mn: 'Лавлах', en: 'Ask' },
  sendWa: { mn: 'WhatsApp-аар илгээх', en: 'Send via WhatsApp' },
  orderNow: { mn: 'Аялал захиалах', en: 'Book a trip' },
  hotelOrder: { mn: 'Буудал захиалах', en: 'Book hotel' },
  ticketOrder: { mn: 'Тасалбар захиалах', en: 'Book tickets' },
  freeConsult: { mn: 'Үнэгүй зөвлөгөө авах', en: 'Get free consultation' },
  viewTours: { mn: 'Аялал үзэх →', en: 'View tours →' },
};

const pages = {
  home: {
    title: { mn: 'Нүүр | Aylal', en: 'Home | Aylal' },
    heroBadge: { mn: 'Монголоос дэлхий рүү', en: 'From Mongolia to the world' },
    heroTitleA: { mn: 'Аяллын бүрэн', en: 'Complete travel' },
    heroTitleB: { mn: 'үйлчилгээ', en: 'services' },
    heroAccent: { mn: 'нэг дор', en: 'in one place' },
    heroLead: { mn: 'Виз • Онгоцны тасалбар • Зочид буудал • Машин • Орчуулагч • Даатгал — Бүгдийг бид зохицуулна', en: 'Visa • Flights • Hotels • Transport • Translator • Insurance — we arrange everything for you' },
    stats: [
      ['2,500+', { mn: 'Аялагч', en: 'Travelers' }],
      ['15+', { mn: 'Улс орон', en: 'Countries' }],
      ['98%', { mn: 'Сэтгэл ханамж', en: 'Satisfaction' }],
    ] as [string, Txt][],
    sectionEyebrow: { mn: 'Бидний үйлчилгээ', en: 'Our services' },
    sectionTitle: { mn: 'Юу хийж өгөх вэ?', en: 'What can we arrange?' },
    sectionDesc: { mn: 'Аяллын бүх зүйлийг нэг компаниас шийднэ', en: 'Everything you need for travel, handled by one team' },
  },
  destinations: {
    title: { mn: 'Гадаад аялал | Aylal', en: 'International tours | Aylal' },
    badge: { mn: 'Гадаад аялал', en: 'International tours' },
    h1: { mn: 'Дэлхийн шилдэг газрууд', en: 'Top destinations around the world' },
    lead: { mn: 'Хамгийн их эрэлттэй, Монголчуудын дуртай аяллын чиглэлүүд', en: 'Popular destinations loved by Mongolian travelers' },
  },
  domestic: {
    title: { mn: 'Дотоод аялал | Aylal', en: 'Domestic tours | Aylal' },
    badge: { mn: 'Дотоод аялал', en: 'Domestic travel' },
    h1: { mn: 'Монгол орноо аялаарай', en: 'Explore Mongolia' },
    lead: { mn: 'Байгалийн гайхамшигт дүр зураг — гэр бүлээрээ, найзуудтайгаа', en: 'Beautiful nature trips for families, friends, and teams' },
  },
  services: {
    title: { mn: 'Үйлчилгээ | Aylal', en: 'Services | Aylal' },
    badge: { mn: 'Үйлчилгээ', en: 'Services' },
    h1: { mn: 'Аяллын бүрэн дэмжлэг', en: 'Full travel support' },
    lead: { mn: 'Бүх зүйлийг бид зохицуулна — та зөвхөн аялалаа мэдэрээрэй', en: 'We manage the details — you enjoy the journey' },
  },
  avia: {
    title: { mn: 'Авиа Үйлчилгээ | Aylal', en: 'Aviation service | Aylal' },
    badge: { mn: 'Aylal', en: 'Aylal' },
    h1: { mn: '✈ Авиа Үйлчилгээ', en: '✈ Aviation Service' },
    lead: { mn: '50+ агаарын тээвэрлэгчтэй хамтарч, хамгийн өрсөлдөхүйц үнэтэй нислэгийн тасалбар захиалж өгнө', en: 'We work with 50+ airlines to find competitive flight options for you' },
  },
  visa: {
    title: { mn: 'Виз | Aylal', en: 'Visa | Aylal' },
    badge: { mn: 'Визийн үйлчилгээ', en: 'Visa service' },
    h1: { mn: 'Визийн бэлтгэлийг бид хийнэ', en: 'We prepare your visa application' },
    lead: { mn: 'Бичиг баримтын бэлтгэлээс эхлээд мэдүүлэг өгөх хүртэл — бүрэн дэмжлэг', en: 'From document checklist to submission support — full guidance' },
  },
  hotel: {
    title: { mn: 'Зочид буудал | Aylal', en: 'Hotels | Aylal' },
    badge: { mn: 'Зочид буудал', en: 'Hotels' },
    h1: { mn: 'Буудал захиалга', en: 'Hotel booking' },
    lead: { mn: 'Таны төсөв, амралтын хэв маягт тохирсон буудлыг сонгож өгнө', en: 'We help choose accommodation that fits your budget and travel style' },
  },
  tickets: {
    title: { mn: 'Тасалбар | Aylal', en: 'Tickets | Aylal' },
    badge: { mn: 'Онгоцны тасалбар', en: 'Flight tickets' },
    h1: { mn: 'Тасалбар захиалга', en: 'Ticket booking' },
    lead: { mn: 'Хамгийн тохиромжтой нислэг, хамгийн сайн үнийг олж өгнө', en: 'We find suitable flights and better prices for your route' },
  },
  contact: {
    title: { mn: 'Холбоо барих | Aylal', en: 'Contact | Aylal' },
    badge: { mn: 'Холбоо барих', en: 'Contact' },
    h1: { mn: 'Бидэнтэй холбогдоорой', en: 'Get in touch with us' },
    lead: { mn: 'Формоо бөглөсөн даруйд мессеж манай багт шууд хүрнэ', en: 'Your message will be sent directly to our team' },
  },
};

const overview = [
  { icon: '🌏', route: 'destinations', title: { mn: 'Гадаад аялал', en: 'International tours' }, desc: { mn: 'Солонгос, Япон, Турк, Европ, Дубай зэрэг 15+ улс', en: 'Korea, Japan, Turkey, Europe, Dubai and 15+ countries' } },
  { icon: '🏔️', route: 'domestic', title: { mn: 'Дотоод аялал', en: 'Domestic tours' }, desc: { mn: 'Хөвсгөл, Тэрэлж, Говь, Алтай — Монголоо аялаарай', en: 'Khuvsgul, Terelj, Gobi, Altai — explore Mongolia' } },
  { icon: '🚗', route: 'services', title: { mn: 'Үйлчилгээ', en: 'Services' }, desc: { mn: 'Машин, орчуулагч, хөтөч, даатгал — бүрэн дэмжлэг', en: 'Transport, translators, guides, insurance — full support' } },
  { icon: '📋', type: 'visa' as BookingType, title: { mn: 'Виз мэдүүлэг', en: 'Visa application' }, desc: { mn: '8+ улсын виз бэлтгэл — 98% амжилтын хувь', en: 'Visa preparation for 8+ countries' } },
  { icon: '🏨', type: 'hotel' as BookingType, title: { mn: 'Буудал захиалга', en: 'Hotel booking' }, desc: { mn: 'Luxury-аас эхлээд хямд хостел хүртэл', en: 'From luxury hotels to budget hostels' } },
  { icon: '✈️', type: 'avia' as BookingType, title: { mn: 'Тасалбар', en: 'Tickets' }, desc: { mn: 'Хамгийн сайн үнэтэй нислэгийн тасалбар', en: 'Flight tickets with competitive prices' } },
  { icon: '📞', route: 'contact', title: { mn: 'Холбоо барих', en: 'Contact' }, desc: { mn: 'WhatsApp, Messenger, утас — хүссэн аргаар', en: 'WhatsApp, Messenger, phone — your choice' } },
  { icon: '🎁', dark: true, type: 'tour' as BookingType, title: { mn: 'Бүрэн багц', en: 'Full package' }, desc: { mn: 'Виз+тасалбар+буудал+машин нэг дор хямдралтай', en: 'Visa + tickets + hotel + car in one package' } },
];

const destinations = [
  { name: { mn: 'Өмнөд Солонгос', en: 'South Korea' }, info: { mn: 'Сөүл • Жэжү • Бусан', en: 'Seoul • Jeju • Busan' }, tag: { mn: 'Хамгийн эрэлттэй', en: 'Most popular' }, img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80', lg: true },
  { name: { mn: 'Япон', en: 'Japan' }, info: { mn: 'Токио • Осака • Киото', en: 'Tokyo • Osaka • Kyoto' }, tag: { mn: 'Соёл & Технологи', en: 'Culture & technology' }, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', lg: true },
  { name: { mn: 'Тайланд', en: 'Thailand' }, info: { mn: 'Бангкок • Пүүкет • Паттайа', en: 'Bangkok • Phuket • Pattaya' }, img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80' },
  { name: { mn: 'Турк', en: 'Turkey' }, info: { mn: 'Истанбул • Каппадокиа • Анталиа', en: 'Istanbul • Cappadocia • Antalya' }, img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80' },
  { name: { mn: 'Европ тур', en: 'Europe tour' }, info: { mn: 'Париж • Рома • Барселона', en: 'Paris • Rome • Barcelona' }, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80' },
  { name: { mn: 'Дубай', en: 'Dubai' }, info: { mn: 'Бурж Халифа • Дезерт сафари', en: 'Burj Khalifa • Desert safari' }, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { name: { mn: 'АНУ', en: 'United States' }, info: { mn: 'Нью Йорк • ЛА • Лас Вегас', en: 'New York • LA • Las Vegas' }, img: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600&q=80' },
  { name: { mn: 'Малайз', en: 'Malaysia' }, info: { mn: 'Куала Лумпур • Лангкави', en: 'Kuala Lumpur • Langkawi' }, img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
];

const domestic = [
  { duration: { mn: '3–5 хоног', en: '3–5 days' }, name: { mn: 'Хөвсгөл нуур', en: 'Khuvsgul Lake' }, desc: { mn: 'Цэнхэр нуурын эрэг, морь унах, загасчлах, гэрт хонох', en: 'Blue lake shore, horse riding, fishing, ger stay' }, img: 'https://images.unsplash.com/photo-1575408264798-ed0cb3338943?w=700&q=80' },
  { duration: { mn: '1–2 хоног', en: '1–2 days' }, name: { mn: 'Тэрэлж', en: 'Terelj' }, desc: { mn: 'Арьяабалын сүм, Мэлхий хад, морь унах, гэр буудал', en: 'Aryabal temple, Turtle Rock, horse riding, ger camp' }, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=700&q=80' },
  { duration: { mn: '5–7 хоног', en: '5–7 days' }, name: { mn: 'Говь', en: 'Gobi' }, desc: { mn: 'Хонгорын элс, Ёлын ам, Баянзаг — цөлийн адал явдал', en: 'Khongor dunes, Yol valley, Bayanzag — desert adventure' }, img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=700&q=80' },
  { duration: { mn: '4–6 хоног', en: '4–6 days' }, name: { mn: 'Алтай таван богд', en: 'Altai Tavan Bogd' }, desc: { mn: 'Мөсөн голоор аялах, бүргэдчин, уулын адал явдал', en: 'Glacier trekking, eagle hunters, mountain adventure' }, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80' },
  { duration: { mn: '3–4 хоног', en: '3–4 days' }, name: { mn: 'Орхон, Хархорум', en: 'Orkhon & Kharkhorin' }, desc: { mn: 'Орхоны хүрхрээ, Эрдэнэ зуу хийд, түүхэн газрууд', en: 'Orkhon waterfall, Erdene Zuu monastery, historic sites' }, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80' },
  { duration: { mn: '2–3 хоног', en: '2–3 days' }, name: { mn: 'Хустайн нуруу', en: 'Khustai National Park' }, desc: { mn: 'Тахь үзэх, байгалийн цогцолбор, гэр буудал', en: 'Wild horses, nature reserve, ger camp' }, img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80' },
];

const serviceCards = [
  { icon: '🚗', title: { mn: 'Машин түрээс', en: 'Car rental' }, desc: { mn: 'Жолоочтой болон жолоочгүй машин түрээс. Аяллын чиглэлд тохирсон SUV, микро автобус бэлэн.', en: 'Rental cars with or without driver. SUVs and vans for your itinerary.' } },
  { icon: '🗣️', title: { mn: 'Орчуулагч', en: 'Translator' }, desc: { mn: 'Англи, Солонгос, Япон, Хятад, Орос хэлний мэргэжлийн орчуулагч, хөтөч дагуулна.', en: 'Professional English, Korean, Japanese, Chinese, and Russian translators.' } },
  { icon: '🧭', title: { mn: 'Хөтөч / Гайд', en: 'Guide' }, desc: { mn: 'Орон нутгийг мэддэг, туршлагатай хөтөч таны аялалыг удирдан чиглүүлнэ.', en: 'Experienced local guides lead your trip safely and smoothly.' } },
  { icon: '🛡️', title: { mn: 'Аяллын даатгал', en: 'Travel insurance' }, desc: { mn: 'Эрүүл мэнд, нислэг цуцлалт, ачаа алдагдлын даатгал бүрэн хариуцна.', en: 'Coverage for health, flight cancellation, and lost luggage.' } },
  { icon: '📋', title: { mn: 'Виз мэдүүлэг', en: 'Visa application' }, desc: { mn: 'Бичиг баримт бэлтгэл, материал шалгалт, ярилцлагын бэлтгэл зөвлөгөө.', en: 'Document preparation, checklist review, and interview guidance.' } },
  { icon: '🎁', title: { mn: 'Бүрэн багц', en: 'Full package' }, desc: { mn: 'Виз + тасалбар + буудал + машин + орчуулагч — нэг багцаар, хямд үнээр авах боломж.', en: 'Visa + tickets + hotel + car + translator in one package.' } },
];

const aviaServices = [
  { icon: '🎫', title: { mn: 'Тасалбар захиалга', en: 'Ticket booking' }, desc: { mn: 'Дотоод болон олон улсын нислэгийн тасалбарыг хамгийн өрсөлдөхүйц үнээр. Хямд үнийн баталгаа.', en: 'Domestic and international tickets at competitive rates.' }, action: { mn: 'Захиалах →', en: 'Book →' } },
  { icon: '🏅', title: { mn: 'Бизнес / Нэгдүгээр анги', en: 'Business / First class' }, desc: { mn: 'Korean Air, Emirates, Turkish Airlines-ийн бизнес болон нэгдүгээр ангийн суудал онцгой үнэтэй.', en: 'Premium cabin options from Korean Air, Emirates, Turkish Airlines and more.' }, action: { mn: 'Захиалах →', en: 'Book →' } },
  { icon: '👨‍👩‍👧‍👦', title: { mn: 'Групп нислэг', en: 'Group flights' }, desc: { mn: '10+ хүний бүлэг аялалд тусгай хөнгөлөлт болон онцгой суудлын зохицуулалт.', en: 'Special group fares and seating support for 10+ travelers.' }, action: { mn: 'Захиалах →', en: 'Book →' } },
  { icon: '🔄', title: { mn: 'Нислэг өөрчлөлт & Цуцлалт', en: 'Changes & cancellation' }, desc: { mn: 'Нислэг хойшлогдсон, цуцлагдсан тохиолдолд дахин захиалга болон буцаалт шуурхай хийнэ.', en: 'Fast rebooking and refund support for schedule changes.' }, action: { mn: 'Лавлах →', en: 'Ask →' } },
  { icon: '🛂', title: { mn: 'Нисэх буудлын угтах', en: 'Airport meet & greet' }, desc: { mn: 'Чингис хаан нисэх буудал дээр угтах, гааль, буудал хүргэх VIP үйлчилгээ.', en: 'VIP arrival support, customs assistance, and hotel transfer.' }, action: { mn: 'Захиалах →', en: 'Book →' } },
  { icon: '⏰', title: { mn: '24/7 Дэмжлэг', en: '24/7 support' }, desc: { mn: 'Нислэгийн өмнө, үед, дараа нь үүсэх аливаа асуудалд цаг хязгаарлалтгүй туслалцаа.', en: 'Support before, during, and after your flight.' }, action: { mn: 'Холбогдох →', en: 'Contact →' }, dark: true },
];

const airlines = [
  { logo: '🇰🇷', name: 'Korean Air', desc: { mn: 'Солонгос, Японы тэргүүлэх агаарын тээвэрлэгч. Инчон–Улаанбаатар шууд нислэг.', en: 'A leading Korean airline with direct Incheon–Ulaanbaatar flights.' }, tags: ['SkyTeam', 'Soleil Miles'] },
  { logo: '🇲🇳', name: 'MIAT Mongolian Airlines', desc: { mn: 'Монголын үндэсний агаарын тээвэрлэгч. Улаанбаатараас Европ, Ази руу шууд нислэг.', en: 'Mongolia’s national airline with direct flights to Europe and Asia.' }, tags: ['National', 'Oneworld'] },
  { logo: '🇹🇷', name: 'Turkish Airlines', desc: { mn: 'Дэлхийн 300+ улс руу нислэгтэй. Европ, Африк, Америк руу хамгийн их сонголт.', en: 'Global airline with broad connections across Europe, Africa, and America.' }, tags: ['Star Alliance', 'Miles&Smiles'] },
  { logo: '🇦🇪', name: 'Emirates', desc: { mn: 'Дубайгаас дэлхийн 150+ улс руу. Luxury business болон first class сонголттой.', en: 'Premium connections via Dubai with business and first class options.' }, tags: ['Skywards', 'Award Winner'] },
  { logo: '🇯🇵', name: 'Japan Airlines (JAL)', desc: { mn: 'Японы тэргүүлэх агаарын тээвэрлэгч. Токио, Осака, Хоккайдо руу шилдэг сонголт.', en: 'Top choice for Tokyo, Osaka, Hokkaido and other Japan routes.' }, tags: ['JAL Mileage', 'Oneworld'] },
  { logo: '🇹🇭', name: 'Thai Airways', desc: { mn: 'Тайландын үндэсний тээвэрлэгч. Бангкок, Пүүкет руу хамгийн олон нислэг.', en: 'Thailand’s flag carrier with many Bangkok and Phuket routes.' }, tags: ['Royal Orchid', 'Star Alliance'] },
];

const quickRoutes = [
  { mn: '🇰🇷 Солонгос', en: '🇰🇷 South Korea' }, { mn: '🇯🇵 Япон', en: '🇯🇵 Japan' }, { mn: '🇹🇭 Тайланд', en: '🇹🇭 Thailand' }, { mn: '🇹🇷 Турк', en: '🇹🇷 Turkey' }, { mn: '🇦🇪 Дубай', en: '🇦🇪 Dubai' }, { mn: '🇺🇸 АНУ', en: '🇺🇸 USA' }, { mn: '🇪🇺 Европ', en: '🇪🇺 Europe' }, { mn: '✈ Бусад чиглэл', en: '✈ Other route' },
];

const visaSteps = [
  ['01', { mn: 'Урьдчилсан шалгалт', en: 'Initial review' }, { mn: 'Материалаа илгээгээрэй, бид шалгаад чеклист өгнө', en: 'Send your materials and we will review them with a checklist' }],
  ['02', { mn: 'Бичиг баримт бэлтгэх', en: 'Document preparation' }, { mn: 'Маягт бөглөх, тайлбар бичиг, ярилцлагын бэлтгэл', en: 'Forms, explanation letters, and interview preparation' }],
  ['03', { mn: 'Мэдүүлэг өгөх', en: 'Submission support' }, { mn: 'Элчин сайдын яам / VFS руу бүрдүүлэлт хийх', en: 'Embassy or VFS submission guidance' }],
] as [string, Txt, Txt][];

const hotelCards = [
  { icon: '💎', title: { mn: 'Luxury буудал', en: 'Luxury hotels' }, desc: { mn: '5 одтой зочид буудал, resort, SPA — онцгой амралт хүсвэл', en: '5-star hotels, resorts and SPA stays for premium trips' } },
  { icon: '🏨', title: { mn: 'Дундаж буудал', en: 'Mid-range hotels' }, desc: { mn: '3–4 одтой, байршил сайтай, цэвэрхэн, тохилог буудлууд', en: 'Clean 3–4 star hotels in convenient locations' } },
  { icon: '🏠', title: { mn: 'Хямд сонголт', en: 'Budget options' }, desc: { mn: 'Hostel, Airbnb, гэст хаус — төсөвт ээлтэй сонголтууд', en: 'Hostels, Airbnb and guesthouses for budget-friendly trips' } },
];

const ticketRoutes = [
  ['UBN','ICN',{mn:'Улаанбаатар — Сөүл',en:'Ulaanbaatar — Seoul'},'MIAT, Korean Air','~$350–650'],
  ['UBN','NRT',{mn:'Улаанбаатар — Токио',en:'Ulaanbaatar — Tokyo'},'MIAT, ANA','~$450–800'],
  ['UBN','IST',{mn:'Улаанбаатар — Истанбул',en:'Ulaanbaatar — Istanbul'},'Turkish Airlines','~$500–900'],
  ['UBN','BKK',{mn:'Улаанбаатар — Бангкок',en:'Ulaanbaatar — Bangkok'},'MIAT, Thai Airways','~$400–700'],
  ['UBN','FRA',{mn:'Улаанбаатар — Франкфурт',en:'Ulaanbaatar — Frankfurt'},'MIAT, Lufthansa','~$600–1100'],
] as [string,string,Txt,string,string][];

const formText = {
  name: { mn: 'Нэр *', en: 'Name *' }, phone: { mn: 'Утас *', en: 'Phone *' }, email: { mn: 'Имэйл', en: 'Email' }, service: { mn: 'Үйлчилгээ *', en: 'Service *' }, destination: { mn: 'Чиглэл / Газар', en: 'Destination / Place' }, date: { mn: 'Аялах хугацаа', en: 'Travel date' }, pax: { mn: 'Хүний тоо', en: 'Travelers' }, budget: { mn: 'Төсөв (ойролцоо)', en: 'Budget estimate' }, note: { mn: 'Нэмэлт мэдээлэл', en: 'Additional notes' }, country: { mn: 'Улс', en: 'Country' }, city: { mn: 'Хот', en: 'City' }, hotelType: { mn: 'Буудлын төрөл', en: 'Hotel type' }, from: { mn: 'Хаанаас', en: 'From' }, to: { mn: 'Хаашаа', en: 'To' }, close: { mn: 'Хаах', en: 'Close' }, successTitle: { mn: 'Захиалга хүлээн авлаа', en: 'Request received' }, successMsg: { mn: 'Манай баг таны мэдээллийг шалгаад удахгүй холбогдоно.', en: 'Our team will review your request and contact you soon.' }, noteBottom: { mn: 'Захиалга admin dashboard дээр хадгалагдаж, WhatsApp мессеж бэлтгэгдэнэ.', en: 'The request is saved to the admin dashboard and a WhatsApp message is prepared.' },
};

function bookingCtx(type: BookingType, lang: Lang, preset?: Txt): BookingContext {
  const base = {
    tour: { badge: { mn: 'Аялал захиалга', en: 'Tour booking' }, title: { mn: 'Аялал захиалах', en: 'Book a trip' }, subtitle: { mn: 'Аяллын мэдээллээ бөглөнө үү', en: 'Fill in your travel details' }, button: { mn: 'Захиалга илгээх', en: 'Send request' } },
    hotel: { badge: { mn: 'Буудал захиалга', en: 'Hotel booking' }, title: { mn: 'Буудал захиалах', en: 'Book a hotel' }, subtitle: { mn: 'Хот, огноо, ангиллаа сонгоно уу', en: 'Choose city, date, and category' }, button: { mn: 'Буудал захиалах', en: 'Book hotel' } },
    visa: { badge: { mn: 'Визийн үйлчилгээ', en: 'Visa service' }, title: { mn: 'Виз мэдүүлэх', en: 'Apply for visa support' }, subtitle: { mn: 'Улс, зорилго, огноогоо сонгоно уу', en: 'Choose country, purpose, and timing' }, button: { mn: 'Виз мэдүүлэх', en: 'Apply' } },
    avia: { badge: { mn: 'Авиа үйлчилгээ', en: 'Aviation service' }, title: { mn: 'Тасалбар захиалах', en: 'Book flight tickets' }, subtitle: { mn: 'Нислэгийн чиглэл, огноогоо оруулна уу', en: 'Enter route and flight date' }, button: { mn: 'Тасалбар захиалах', en: 'Book tickets' } },
    contact: { badge: { mn: 'Холбоо барих', en: 'Contact' }, title: { mn: 'Зөвлөгөө авах', en: 'Get consultation' }, subtitle: { mn: 'Мэдээллээ үлдээнэ үү', en: 'Leave your details' }, button: { mn: 'Илгээх', en: 'Send' } },
  }[type];
  return { type, ...base, preset: preset ? text(preset, lang) : undefined };
}

function useRoute() {
  const [route, setRoute] = useState(() => location.hash.replace(/^#\/?/, '') || 'home');
  useEffect(() => {
    const update = () => setRoute(location.hash.replace(/^#\/?/, '') || 'home');
    addEventListener('hashchange', update);
    return () => removeEventListener('hashchange', update);
  }, []);
  return route;
}

function A({ route, children, className }: { route: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={`#/${route === 'home' ? '' : route}`}>{children}</a>;
}

function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('aylal_lang') as Lang) || 'mn');
  const [booking, setBooking] = useState<BookingContext | null>(null);
  const route = useRoute();

  useEffect(() => {
    localStorage.setItem('aylal_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const nav = document.getElementById('navBar');
    const checkNav = () => nav?.classList.toggle('nav-bar--scrolled', scrollY > 40);
    const float = document.getElementById('floatCta');
    const checkFloat = () => float?.classList.toggle('is-visible', scrollY > 400);
    addEventListener('scroll', checkNav, { passive: true });
    addEventListener('scroll', checkFloat, { passive: true });
    checkNav(); checkFloat();
    return () => { removeEventListener('scroll', checkNav); removeEventListener('scroll', checkFloat); };
  }, [route]);

  useEffect(() => {
    const items = document.querySelectorAll('[data-anim]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [route, lang]);

  useEffect(() => {
    const pageKey = route in pages ? route as keyof typeof pages : route === 'admin' ? 'home' : 'home';
    document.title = route === 'admin' ? 'Admin | Aylal' : text(pages[pageKey].title, lang);
  }, [route, lang]);

  if (route === 'admin') return <Admin lang={lang} setLang={setLang} />;

  return <>
    <Header route={route} lang={lang} setLang={setLang} />
    <main>
      {route === 'destinations' && <Destinations lang={lang} openBooking={setBooking} />}
      {route === 'domestic' && <Domestic lang={lang} openBooking={setBooking} />}
      {route === 'services' && <Services lang={lang} openBooking={setBooking} />}
      {route === 'avia' && <Avia lang={lang} openBooking={setBooking} />}
      {route === 'visa' && <Visa lang={lang} openBooking={setBooking} />}
      {route === 'hotel' && <Hotel lang={lang} openBooking={setBooking} />}
      {route === 'tickets' && <Tickets lang={lang} openBooking={setBooking} />}
      {route === 'contact' && <Contact lang={lang} />}
      {!['destinations','domestic','services','avia','visa','hotel','tickets','contact'].includes(route) && <Home lang={lang} openBooking={setBooking} />}
    </main>
    <Footer lang={lang} />
    <div className="float-cta" id="floatCta"><a className="float-cta__btn" href={cfg.waLink} target="_blank" rel="noreferrer">{text(ui.whatsapp, lang)}</a></div>
    <BookingModal lang={lang} ctx={booking} close={() => setBooking(null)} />
  </>;
}

function Header({ route, lang, setLang }: { route: string; lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  const langToggle = <div className="lang-toggle"><button className={`lang-btn ${lang === 'mn' ? 'active' : ''}`} onClick={() => setLang('mn')}>МН</button><button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button></div>;
  return <>
    <header className="nav-bar" id="navBar">
      <div className="wrap nav-bar__inner">
        <A route="home" className="logo"><span className="logo__icon">✈</span><span className="logo__text">Aylal</span></A>
        <nav className="nav">
          {ui.nav.map(([r, label]) => <A key={r} route={r} className={route === r || (route === '' && r === 'home') ? 'is-active' : ''}>{text(label, lang)}</A>)}
        </nav>
        <div className="nav-right">{langToggle}<A route="contact" className="nav__cta">{text(ui.contact, lang)}</A></div>
        <button className={`menu-btn ${open ? 'is-open' : ''}`} aria-label="menu" onClick={() => setOpen(!open)}><span></span><span></span><span></span></button>
      </div>
    </header>
    <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
      <nav className="mobile-menu__nav">
        {ui.nav.map(([r, label]) => <A key={r} route={r} className={route === r ? 'is-active' : ''}>{text(label, lang)}</A>)}
        <A route="contact" className="mobile-menu__cta">{text(ui.contact, lang)}</A>
        <div className="lang-toggle lang-toggle--mobile"><button className={`lang-btn ${lang === 'mn' ? 'active' : ''}`} onClick={() => setLang('mn')}>МН</button><button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button></div>
      </nav>
    </div>
  </>;
}

function Footer({ lang }: { lang: Lang }) {
  return <footer className="footer"><div className="wrap footer__inner"><div className="footer__brand"><span className="logo__icon">✈</span><span className="logo__text">Aylal</span></div><nav className="footer__links">{ui.nav.slice(1,5).map(([r,l]) => <A key={r} route={r}>{text(l,lang)}</A>)}<A route="contact">{text(ui.contact,lang)}</A></nav><p className="footer__copy">© {new Date().getFullYear()} Aylal • {lang === 'mn' ? 'Улаанбаатар, Монгол' : 'Ulaanbaatar, Mongolia'}</p></div></footer>;
}

function PageHeader({ lang, p, bg }: { lang: Lang; p: { badge: Txt; h1: Txt; lead: Txt }; bg: string }) {
  return <section className="page-header" style={pageBg(bg)}><div className="wrap page-header__inner"><span className="page-header__badge">{text(p.badge, lang)}</span><h1 className="page-header__title">{text(p.h1, lang)}</h1><p className="page-header__lead">{text(p.lead, lang)}</p></div></section>;
}

function Home({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  const p = pages.home;
  return <>
    <section className="hero"><div className="hero__bg"></div><div className="hero__grain"></div><div className="wrap hero__content"><p className="hero__badge" data-anim="fade-up">{text(p.heroBadge, lang)}</p><h1 className="hero__title" data-anim="fade-up" data-delay="1">{text(p.heroTitleA, lang)}<br />{text(p.heroTitleB, lang)} <span className="text-accent">{text(p.heroAccent, lang)}</span></h1><p className="hero__lead" data-anim="fade-up" data-delay="2">{text(p.heroLead, lang)}</p><div className="hero__actions" data-anim="fade-up" data-delay="3"><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('tour', lang))}>{text(ui.freeConsult, lang)}</button><A route="destinations" className="btn btn--glass">{text(ui.viewTours, lang)}</A></div><div className="hero__stats" data-anim="fade-up" data-delay="4">{p.stats.map(([n,l],i) => <React.Fragment key={n}><div className="hero__stat"><strong>{n}</strong><span>{text(l,lang)}</span></div>{i<2 && <div className="hero__stat-line"></div>}</React.Fragment>)}</div></div><div className="hero__scroll-hint"><span>Scroll</span><div className="hero__scroll-line"></div></div></section>
    <section className="section"><div className="wrap"><div className="section__head" data-anim="fade-up"><p className="section__eyebrow">{text(p.sectionEyebrow, lang)}</p><h2 className="section__title">{text(p.sectionTitle, lang)}</h2><p className="section__desc">{text(p.sectionDesc, lang)}</p></div><div className="overview-grid" data-anim="fade-up" data-delay="1">{overview.map((o) => o.route ? <A key={text(o.title,lang)} route={o.route} className="ov-card"><div className="ov-card__icon">{o.icon}</div><h3 className="ov-card__title">{text(o.title,lang)}</h3><p className="ov-card__desc">{text(o.desc,lang)}</p></A> : <button key={text(o.title,lang)} className={`ov-card card-button ${o.dark ? 'ov-card--dark' : ''}`} onClick={() => openBooking(bookingCtx(o.type!, lang, o.title))}><div className="ov-card__icon">{o.icon}</div><h3 className="ov-card__title">{text(o.title,lang)}</h3><p className="ov-card__desc">{text(o.desc,lang)}</p></button>)}</div></div></section>
  </>;
}

function Destinations({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  return <><PageHeader lang={lang} p={pages.destinations} bg="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80" /><section className="section"><div className="wrap"><div className="dest-grid" data-anim="fade-up">{destinations.map((d) => <div key={text(d.name,lang)} className={`dest-card ${d.lg ? 'dest-card--lg' : ''}`} style={imgStyle(d.img)}><div className="dest-card__overlay">{d.tag && <span className="dest-card__tag">{text(d.tag, lang)}</span>}<h3 className="dest-card__name">{text(d.name, lang)}</h3><p className="dest-card__info">{text(d.info, lang)}</p></div><button className="dest-card__book" onClick={() => openBooking(bookingCtx('tour', lang, d.name))}>{lang === 'mn' ? 'Захиалах →' : 'Book →'}</button></div>)}</div><div style={{ textAlign:'center', marginTop:36 }} data-anim="fade-up" data-delay="1"><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('tour', lang))}>{text(ui.orderNow, lang)}</button></div></div></section></>;
}

function Domestic({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  return <><PageHeader lang={lang} p={pages.domestic} bg="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80" /><section className="section"><div className="wrap"><div className="domestic-grid" data-anim="fade-up">{domestic.map((d) => <button key={text(d.name,lang)} className="dom-card link-button" onClick={() => openBooking(bookingCtx('tour', lang, d.name))}><div className="dom-card__img" style={imgStyle(d.img)}></div><div className="dom-card__body"><span className="dom-card__duration">{text(d.duration, lang)}</span><h3 className="dom-card__name">{text(d.name, lang)}</h3><p className="dom-card__desc">{text(d.desc, lang)}</p></div></button>)}</div><div style={{ textAlign:'center', marginTop:36 }} data-anim="fade-up" data-delay="1"><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('tour', lang))}>{text(ui.orderNow, lang)}</button></div></div></section></>;
}

function Services({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  return <><PageHeader lang={lang} p={pages.services} bg="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1600&q=80" /><section className="section"><div className="wrap"><div className="svc-grid" data-anim="fade-up">{serviceCards.map((s) => <div key={text(s.title,lang)} className="svc-card"><div className="svc-card__icon svc-card__icon--gold">{s.icon}</div><h3 className="svc-card__title">{text(s.title,lang)}</h3><p className="svc-card__desc">{text(s.desc,lang)}</p></div>)}</div><div style={{textAlign:'center',marginTop:36}}><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('contact', lang))}>{lang==='mn'?'Үйлчилгээ лавлах':'Ask about services'}</button></div></div></section><section className="section section--alt"><div className="wrap"><div className="section__head"><p className="section__eyebrow">{lang==='mn'?'Авиа үйлчилгээ':'Aviation service'}</p><h2 className="section__title">{lang==='mn'?'Нислэгийн бүрэн шийдэл':'Complete flight solution'}</h2><p className="section__desc">{lang==='mn'?'Онгоцны тасалбар захиалгаас эхлээд нисэх буудлын угтах үйлчилгээ хүртэл — бид таны аялалыг агаараас хөтөлнө':'From ticket booking to airport meet & greet — we manage your flight needs'}</p></div><div className="avia-svc-grid">{aviaServices.map(a => <div key={text(a.title,lang)} className={`avia-svc-card ${a.dark ? 'avia-svc-card--dark' : ''}`}><div className="avia-svc-card__icon">{a.icon}</div><h3>{text(a.title,lang)}</h3><p>{text(a.desc,lang)}</p><button className="btn btn--outline btn--sm" onClick={() => openBooking(bookingCtx('avia', lang, a.title))}>{text(a.action,lang)}</button></div>)}</div></div></section></>;
}

function Avia({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  return <><PageHeader lang={lang} p={pages.avia} bg="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1600&q=80" /><section className="section"><div className="wrap"><div className="avia-quickbook" data-anim="fade-up"><div className="avia-quickbook__head"><h2>{lang==='mn'?'🛫 Нислэг шуурхай захиалах':'🛫 Quick flight booking'}</h2><p>{lang==='mn'?'Улаанбаатараас дэлхийн 50+ улс руу':'From Ulaanbaatar to 50+ countries'}</p></div><div className="avia-quickbook__btns">{quickRoutes.map(r => <button key={r.mn} className={`avia-dest-btn ${r.mn.includes('Бусад') ? 'avia-dest-btn--all' : ''}`} onClick={() => openBooking(bookingCtx('avia', lang, r))}>{text(r,lang)}</button>)}</div></div></div></section><section className="section section--alt"><div className="wrap"><div className="section__head"><p className="section__eyebrow">{lang==='mn'?'Хамтрагч компаниуд':'Partner airlines'}</p><h2 className="section__title">{lang==='mn'?'Агаарын тээвэрлэгчид':'Airlines'}</h2><p className="section__desc">{lang==='mn'?'Дэлхийн тэргүүлэх 50+ агаарын тээвэрлэгчтэй гэрээт хамтрагч':'Partner access to 50+ leading airlines'}</p></div><div className="airline-grid">{airlines.map(a => <div className="airline-card" key={a.name}><div className="airline-card__logo">{a.logo}</div><div className="airline-card__body"><h3>{a.name}</h3><p>{text(a.desc,lang)}</p><div className="airline-card__tags">{a.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><button className="btn btn--outline btn--sm" onClick={() => openBooking(bookingCtx('avia', lang, {mn:a.name,en:a.name}))}>{text(ui.book,lang)}</button></div>)}</div></div></section><section className="section"><div className="wrap"><div className="section__head"><p className="section__eyebrow">{lang==='mn'?'Авиа үйлчилгээ':'Flight services'}</p><h2 className="section__title">{lang==='mn'?'Бидний санал болгодог зүйлс':'What we offer'}</h2></div><div className="avia-svc-grid">{aviaServices.map(a => <div key={text(a.title,lang)} className={`avia-svc-card ${a.dark ? 'avia-svc-card--dark' : ''}`}><div className="avia-svc-card__icon">{a.icon}</div><h3>{text(a.title,lang)}</h3><p>{text(a.desc,lang)}</p><button className="btn btn--outline btn--sm" onClick={() => openBooking(bookingCtx('avia', lang, a.title))}>{text(a.action,lang)}</button></div>)}</div></div></section><section className="section section--alt"><div className="wrap"><div className="avia-stats-row"><div className="avia-stat-item"><strong>50+</strong><span>{lang==='mn'?'Агаарын тээвэрлэгч':'Airlines'}</span></div><div className="avia-stat-divider"></div><div className="avia-stat-item"><strong>30+</strong><span>{lang==='mn'?'Нисэх буудал':'Airports'}</span></div><div className="avia-stat-divider"></div><div className="avia-stat-item"><strong>2,500+</strong><span>{lang==='mn'?'Аялагч':'Travelers'}</span></div><div className="avia-stat-divider"></div><div className="avia-stat-item"><strong>24/7</strong><span>{lang==='mn'?'Дэмжлэг':'Support'}</span></div></div></div></section></>;
}

function Visa({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  const countries = lang==='mn' ? ['🇺🇸 АНУ','🇨🇦 Канад','🇯🇵 Япон','🇰🇷 Солонгос','🇪🇺 Шенген','🇹🇷 Турк','🇦🇺 Австрали','🇬🇧 Их Британи'] : ['🇺🇸 USA','🇨🇦 Canada','🇯🇵 Japan','🇰🇷 Korea','🇪🇺 Schengen','🇹🇷 Turkey','🇦🇺 Australia','🇬🇧 UK'];
  return <><PageHeader lang={lang} p={pages.visa} bg="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1600&q=80" /><section className="section"><div className="wrap"><div className="split" data-anim="fade-up"><div className="split__text"><p className="section__eyebrow">{lang==='mn'?'Бидний давуу тал':'Our advantage'}</p><h2 className="section__title">{lang==='mn'?'8+ улсын виз бэлтгэл':'Visa preparation for 8+ countries'}</h2><p className="section__desc" style={{textAlign:'left'}}>{lang==='mn'?'Бичиг баримтын жагсаалт, материал шалгалт, ярилцлагын бэлтгэл зэрэг бүх үе шатыг мэргэжилтнүүд маань удирдана.':'Our specialists guide every step: document checklist, review, application and interview preparation.'}</p><div className="visa-countries">{countries.map(c => <span className="visa-tag" key={c}>{c}</span>)}</div><div className="visa-steps">{visaSteps.map(([n,t,d]) => <div className="visa-step" key={n}><span className="visa-step__num">{n}</span><div><strong>{text(t,lang)}</strong><p>{text(d,lang)}</p></div></div>)}</div><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('visa', lang))}>{lang==='mn'?'Виз мэдүүлэх':'Apply for visa support'}</button></div><div className="split__visual visa-visual"><div className="visa-visual__card"><div className="visa-visual__success">✓</div><p>{lang==='mn'?'Визийн зөвшөөрөл — 98% амжилттай':'Visa support — 98% success rate'}</p></div></div></div></div></section></>;
}

function Hotel({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  return <><PageHeader lang={lang} p={pages.hotel} bg="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" /><section className="section"><div className="wrap"><div className="hotel-grid" data-anim="fade-up">{hotelCards.map(h => <div className="hotel-card" key={text(h.title,lang)}><div className="hotel-card__icon">{h.icon}</div><div className="hotel-card__body"><h3 className="hotel-card__title">{text(h.title,lang)}</h3><p className="hotel-card__desc">{text(h.desc,lang)}</p></div><div className="hotel-card__action"><button className="btn btn--primary btn--sm" onClick={() => openBooking(bookingCtx('hotel', lang, h.title))}>{text(ui.book,lang)}</button></div></div>)}</div><div style={{textAlign:'center',marginTop:36}}><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('hotel', lang))}>{text(ui.hotelOrder,lang)}</button></div></div></section></>;
}

function Tickets({ lang, openBooking }: { lang: Lang; openBooking: (c: BookingContext) => void }) {
  return <><PageHeader lang={lang} p={pages.tickets} bg="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1600&q=80" /><section className="section"><div className="wrap"><div className="section__head" data-anim="fade-up"><p className="section__eyebrow">{lang==='mn'?'Эрэлттэй чиглэлүүд':'Popular routes'}</p><h2 className="section__title">{lang==='mn'?'Нислэгийн чиглэл & үнэ':'Routes & price estimate'}</h2></div><div className="ticket-routes" data-anim="fade-up" data-delay="1">{ticketRoutes.map(([from,to,name,airline,price]) => <div className="route" key={to}><div className="route__codes"><span className="route__code">{from}</span><span className="route__arrow">→</span><span className="route__code">{to}</span></div><div className="route__info"><span>{text(name,lang)}</span><span className="route__airline">{airline}</span></div><div className="route__price">{price}</div><button className="btn btn--outline btn--sm" onClick={() => openBooking(bookingCtx('avia', lang, name))}>{text(ui.inquire,lang)}</button></div>)}</div><p className="section__note">{lang==='mn'?'* Үнэ нь улирал, захиалгын хугацаанаас хамаарч өөрчлөгдөнө.':'* Prices vary by season and booking timing.'}</p><div style={{textAlign:'center',marginTop:24}}><button className="btn btn--primary" onClick={() => openBooking(bookingCtx('avia', lang))}>{text(ui.ticketOrder,lang)}</button></div></div></section></>;
}

function Contact({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false);
  const services = lang==='mn' ? ['Сонгоно уу','Гадаад аялал','Дотоод аялал','Визийн бэлтгэл','Онгоцны тасалбар','Зочид буудал','Машин түрээс','Орчуулагч','Бүрэн багц'] : ['Select','International tour','Domestic tour','Visa preparation','Flight tickets','Hotel booking','Car rental','Translator','Full package'];
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const lines = [lang==='mn'?'Сайн байна уу! Aylal-аар үйлчилгээ авмаар байна.':'Hello! I would like to request a Aylal service.','',`${text(formText.name,lang).replace(' *','')}: ${fd.get('name') || '—'}`,`${text(formText.phone,lang).replace(' *','')}: ${fd.get('phone') || '—'}`,`${text(formText.service,lang).replace(' *','')}: ${fd.get('service') || '—'}`,`${text(formText.destination,lang)}: ${fd.get('destination') || '—'}`,`${text(formText.date,lang)}: ${fd.get('date') || '—'}`,`${text(formText.pax,lang)}: ${fd.get('pax') || '—'}`,`${text(formText.budget,lang)}: ${fd.get('budget') || '—'}`,`${text(formText.note,lang)}: ${fd.get('note') || '—'}`]; window.open(`${cfg.waLink}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank'); setSent(true); };
  return <><PageHeader lang={lang} p={pages.contact} bg="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1600&q=80" /><section className="section"><div className="wrap"><div className="contact-layout" data-anim="fade-up"><div className="contact__info"><p className="section__eyebrow">{lang==='mn'?'Мэдээлэл':'Information'}</p><h2 className="section__title">{lang==='mn'?'Хэрхэн холбогдох вэ?':'How to contact us?'}</h2><p className="section__desc" style={{textAlign:'left'}}>{lang==='mn'?'Формоо бөглөсөн даруйд таны мэдээлэл WhatsApp-аар манай багт шууд хүрнэ. Бид ажлын 1–2 цагийн дотор хариу өгнө.':'Once you submit the form, your request is sent to our team via WhatsApp. We usually reply within 1–2 business hours.'}</p><div className="contact-methods"><a className="contact-method" href={cfg.waLink} target="_blank" rel="noreferrer"><span className="contact-method__icon">💬</span><div><strong>WhatsApp</strong><span>{lang==='mn'?'Шууд чатлах':'Start chat'}</span></div></a><a className="contact-method" href={cfg.fbLink} target="_blank" rel="noreferrer"><span className="contact-method__icon">📱</span><div><strong>Messenger</strong><span>{lang==='mn'?'Facebook хуудас':'Facebook page'}</span></div></a><div className="contact-method"><span className="contact-method__icon">📞</span><div><strong>{lang==='mn'?'Утас':'Phone'}</strong><span>{cfg.phone}</span></div></div><div className="contact-method"><span className="contact-method__icon">📍</span><div><strong>{lang==='mn'?'Хаяг':'Address'}</strong><span>{lang==='mn'?'Улаанбаатар, Монгол':'Ulaanbaatar, Mongolia'}</span></div></div></div></div><div className="contact__form-wrap"><form className="contact-form" onSubmit={onSubmit}><div className="form-group"><label>{text(formText.name,lang)}</label><input className="input" name="name" placeholder={lang==='mn'?'Таны нэр':'Your name'} required /></div><div className="form-row"><div className="form-group"><label>{text(formText.phone,lang)}</label><input className="input" name="phone" type="tel" placeholder="9911xxxx" required /></div><div className="form-group"><label>{text(formText.service,lang)}</label><select className="input" name="service" required>{services.map((s,i)=><option key={s} value={i===0?'':s} disabled={i===0}>{s}</option>)}</select></div></div><div className="form-row"><div className="form-group"><label>{text(formText.destination,lang)}</label><input className="input" name="destination" placeholder={lang==='mn'?'Жишээ: Солонгос, Тэрэлж':'Example: Korea, Terelj'} /></div><div className="form-group"><label>{text(formText.date,lang)}</label><select className="input" name="date"><option>{lang==='mn'?'2 долоо хоногт':'Within 2 weeks'}</option><option>{lang==='mn'?'1 сарын дотор':'Within 1 month'}</option><option>{lang==='mn'?'2–3 сарын дараа':'In 2–3 months'}</option><option>{lang==='mn'?'Тодорхойгүй':'Not sure'}</option></select></div></div><div className="form-row"><div className="form-group"><label>{text(formText.pax,lang)}</label><select className="input" name="pax"><option>1</option><option>2</option><option>3–4</option><option>5–10</option><option>10+</option></select></div><div className="form-group"><label>{text(formText.budget,lang)}</label><select className="input" name="budget"><option>₮500,000–1,000,000</option><option>₮1,000,000–3,000,000</option><option>₮3,000,000–5,000,000</option><option>₮5,000,000+</option><option>{lang==='mn'?'Тодорхойгүй':'Not sure'}</option></select></div></div><div className="form-group"><label>{text(formText.note,lang)}</label><textarea className="input" name="note" rows={4} placeholder={lang==='mn'?'Жишээ: Гэр бүлээрээ 4 хүн Солонгос явмаар байна...':'Example: Family of 4 wants to travel to Korea...'}></textarea></div><button className="btn btn--primary btn--full" type="submit">{text(ui.sendWa,lang)}</button><p className="form-note">{sent ? (lang==='mn'?'Мессеж бэлтгэгдлээ.':'Message prepared.') : (lang==='mn'?'Таны мэдээлэл манай багт мессежээр шууд хүрнэ.':'Your information will be sent directly to our team.')}</p></form></div></div></div></section></>;
}

function BookingModal({ lang, ctx, close }: { lang: Lang; ctx: BookingContext | null; close: () => void }) {
  const [done, setDone] = useState(false);
  useEffect(() => { setDone(false); }, [ctx]);
  if (!ctx) return null;
  const submit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const booking: Booking = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ts: Date.now(), type: ctx.type, status: 'new', name: String(fd.get('name') || ''), phone: String(fd.get('phone') || ''), email: String(fd.get('email') || ''), destination: String(fd.get('destination') || ctx.preset || ''), date: String(fd.get('date') || ''), pax: String(fd.get('pax') || ''), budget: String(fd.get('budget') || ''), country: String(fd.get('country') || ''), city: String(fd.get('city') || ''), hotelType: String(fd.get('hotelType') || ctx.preset || ''), from: String(fd.get('from') || 'UBN'), to: String(fd.get('to') || ctx.preset || ''), note: String(fd.get('note') || '') }; const list: Booking[] = JSON.parse(localStorage.getItem('aylal_bookings') || '[]'); localStorage.setItem('aylal_bookings', JSON.stringify([booking, ...list])); const lines = [lang==='mn'?'Сайн байна уу! Aylal захиалга илгээж байна.':'Hello! I would like to send a Aylal request.','',`${text(formText.name,lang).replace(' *','')}: ${booking.name}`,`${text(formText.phone,lang).replace(' *','')}: ${booking.phone}`,`${lang==='mn'?'Төрөл':'Type'}: ${typeLabel(booking.type, lang)}`, booking.destination ? `${text(formText.destination,lang)}: ${booking.destination}` : '', booking.country ? `${text(formText.country,lang)}: ${booking.country}` : '', booking.city ? `${text(formText.city,lang)}: ${booking.city}` : '', booking.hotelType ? `${text(formText.hotelType,lang)}: ${booking.hotelType}` : '', booking.from || booking.to ? `${text(formText.from,lang)}: ${booking.from || '—'} / ${text(formText.to,lang)}: ${booking.to || '—'}` : '', booking.date ? `${text(formText.date,lang)}: ${booking.date}` : '', booking.pax ? `${text(formText.pax,lang)}: ${booking.pax}` : '', booking.budget ? `${text(formText.budget,lang)}: ${booking.budget}` : '', booking.note ? `${text(formText.note,lang)}: ${booking.note}` : ''].filter(Boolean); window.open(`${cfg.waLink}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank'); setDone(true); };
  return <div className="bk-overlay is-open"><div className="bk-panel is-in"><button className="bk-close" onClick={close}>✕</button><div className="bk-header"><span className="bk-badge">{text(ctx.badge, lang)}</span><h2 className="bk-title">{text(ctx.title, lang)}</h2><p className="bk-subtitle">{text(ctx.subtitle, lang)}</p></div>{done ? <div className="bk-success"><div className="bk-success__icon">✓</div><h3>{text(formText.successTitle,lang)}</h3><p>{text(formText.successMsg,lang)}</p><button className="btn btn--primary" onClick={close}>{text(formText.close,lang)}</button></div> : <form className="bk-form" onSubmit={submit}><div className="bk-fields"><div className="bk-row"><Field label={text(formText.name,lang)} name="name" required /><Field label={text(formText.phone,lang)} name="phone" required /></div><Field label={text(formText.email,lang)} name="email" type="email" />{ctx.type==='avia' && <><div className="bk-row"><Field label={text(formText.from,lang)} name="from" defaultValue="UBN" /><Field label={text(formText.to,lang)} name="to" defaultValue={ctx.preset || ''} /></div><Field label={text(formText.date,lang)} name="date" type="date" /></>}{ctx.type==='hotel' && <><div className="bk-row"><Field label={text(formText.country,lang)} name="country" /><Field label={text(formText.city,lang)} name="city" /></div><Field label={text(formText.hotelType,lang)} name="hotelType" defaultValue={ctx.preset || ''} /><div className="bk-row"><Field label={text(formText.date,lang)} name="date" type="date" /><Field label={text(formText.pax,lang)} name="pax" /></div></>}{ctx.type==='visa' && <><div className="bk-row"><Field label={text(formText.country,lang)} name="country" defaultValue={ctx.preset || ''} /><Field label={text(formText.date,lang)} name="date" /></div><Field label={lang==='mn'?'Зорилго':'Purpose'} name="destination" /></>}{(ctx.type==='tour' || ctx.type==='contact') && <><Field label={text(formText.destination,lang)} name="destination" defaultValue={ctx.preset || ''} /><div className="bk-row"><Field label={text(formText.date,lang)} name="date" /><Field label={text(formText.pax,lang)} name="pax" /></div><Field label={text(formText.budget,lang)} name="budget" /></>}<div className="bk-group"><label>{text(formText.note, lang)}</label><textarea className="input" name="note" rows={3}></textarea></div></div><button className="btn btn--primary btn--full bk-submit" type="submit">💬 {text(ctx.button, lang)}</button><p className="bk-note">{text(formText.noteBottom, lang)}</p></form>}</div></div>;
}
function Field({ label, name, type='text', required=false, defaultValue='' }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) { return <div className="bk-group"><label>{label}</label><input className="input" name={name} type={type} required={required} defaultValue={defaultValue} /></div>; }
function typeLabel(type: BookingType, lang: Lang) { const m = { tour:{mn:'Аялал',en:'Tour'}, hotel:{mn:'Буудал',en:'Hotel'}, visa:{mn:'Виз',en:'Visa'}, avia:{mn:'Авиа',en:'Flight'}, contact:{mn:'Холбоо',en:'Contact'} }; return m[type][lang]; }

function Admin({ lang, setLang }: { lang: Lang; setLang: (l: Lang)=>void }) {
  const [logged, setLogged] = useState(localStorage.getItem('aylal_admin') === '1');
  const [err, setErr] = useState(false);
  const [page, setPage] = useState<'dashboard'|'bookings'|'tour'|'hotel'|'visa'|'avia'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(() => JSON.parse(localStorage.getItem('aylal_bookings') || '[]'));
  const save = (list: Booking[]) => { setBookings(list); localStorage.setItem('aylal_bookings', JSON.stringify(list)); };
  const login = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); if (cfg.adminUser && cfg.adminPass && fd.get('user') === cfg.adminUser && fd.get('pass') === cfg.adminPass) { localStorage.setItem('aylal_admin','1'); setLogged(true); } else setErr(true); };
  if (!logged) return <div className="login-page"><form className="login-card" onSubmit={login}><h1>Aylal Admin</h1><p>{lang==='mn'?'Admin эрхтэй хэрэглэгч л орно':'Admin users only'}</p>{err && <div className="login-error">{lang==='mn'?'Нэвтрэх нэр эсвэл нууц үг буруу':'Wrong username or password'}</div>}<div className="form-group"><label>{lang==='mn'?'Нэвтрэх нэр':'Username'}</label><input className="input" name="user" autoComplete="username" /></div><div className="form-group"><label>{lang==='mn'?'Нууц үг':'Password'}</label><input className="input" type="password" name="pass" autoComplete="current-password" /></div><button className="btn btn--primary btn--full" type="submit">{lang==='mn'?'Нэвтрэх':'Login'}</button><p style={{textAlign:'center',fontSize:12,marginTop:12}}>{lang==='mn'?'Demo нэвтрэх мэдээллийг README эсвэл .env файлаас тохируулна.':'Set demo login in README or .env.'}</p></form></div>;
  const filtered = page === 'dashboard' || page === 'bookings' ? bookings : bookings.filter(b => b.type === page);
  const count = (status?: BookingStatus) => status ? bookings.filter(b => b.status === status).length : bookings.length;
  const updateStatus = (id: string, status: BookingStatus) => save(bookings.map(b => b.id === id ? { ...b, status } : b));
  const del = (id: string) => { if (confirm(lang==='mn'?'Энэ захиалгыг устгах уу?':'Delete this booking?')) save(bookings.filter(b => b.id !== id)); };
  const exportCsv = () => { const rows = [['id','type','status','name','phone','destination','date','created'], ...bookings.map(b => [b.id,b.type,b.status,b.name,b.phone,b.destination || b.to || b.country || '',b.date || '',new Date(b.ts).toISOString()])]; const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'})); a.download='aylal-bookings.csv'; a.click(); };
  const labels = { dashboard:{mn:'Хянах самбар',en:'Dashboard'}, bookings:{mn:'Бүх захиалгууд',en:'All bookings'}, tour:{mn:'Аялал',en:'Tours'}, hotel:{mn:'Буудал',en:'Hotels'}, visa:{mn:'Виз',en:'Visa'}, avia:{mn:'Авиа',en:'Flights'} } as const;
  return <div className="admin-shell"><aside className="admin-sidebar"><A route="home" className="admin-brand"><span className="admin-brand__icon">✈</span><span className="admin-brand__text">Aylal Admin</span></A><div className="lang-toggle"><button className={`lang-btn ${lang==='mn'?'active':''}`} onClick={()=>setLang('mn')}>МН</button><button className={`lang-btn ${lang==='en'?'active':''}`} onClick={()=>setLang('en')}>EN</button></div><nav className="admin-nav">{Object.entries(labels).map(([k,v]) => <button key={k} className={page===k?'active':''} onClick={()=>setPage(k as typeof page)}>{text(v,lang)}</button>)}</nav><button className="admin-logout" onClick={()=>{localStorage.removeItem('aylal_admin');setLogged(false)}}>{lang==='mn'?'🚪 Гарах':'🚪 Logout'}</button></aside><main className="admin-main"><div className="admin-topbar"><h1>{text(labels[page],lang)}</h1><A route="home" className="btn btn--outline btn--sm">{lang==='mn'?'🌐 Сайт':'🌐 Website'}</A></div><div className="admin-content">{page==='dashboard' && <><div className="admin-grid"><Stat label={lang==='mn'?'Нийт захиалга':'Total bookings'} value={count()} /><Stat label={lang==='mn'?'Шинэ':'New'} value={count('new')} /><Stat label={lang==='mn'?'Хийгдэж байна':'Processing'} value={count('processing')} /><Stat label={lang==='mn'?'Дууссан':'Completed'} value={count('done')} /></div><BookingTable lang={lang} bookings={bookings.slice(0,8)} updateStatus={updateStatus} del={del} title={lang==='mn'?'Сүүлийн захиалгууд':'Recent bookings'} exportCsv={exportCsv} /></>}{page!=='dashboard' && <BookingTable lang={lang} bookings={filtered} updateStatus={updateStatus} del={del} title={text(labels[page],lang)} exportCsv={exportCsv} />}</div></main></div>;
}
function Stat({label,value}:{label:string;value:number}){return <div className="admin-stat"><span>{label}</span><strong>{value}</strong></div>}
function BookingTable({ lang, bookings, updateStatus, del, title, exportCsv }: { lang: Lang; bookings: Booking[]; updateStatus: (id:string,s:BookingStatus)=>void; del:(id:string)=>void; title:string; exportCsv:()=>void }) {
  const statusLabels: Record<BookingStatus, Txt> = { new:{mn:'Шинэ',en:'New'}, processing:{mn:'Хийгдэж байна',en:'Processing'}, done:{mn:'Дууссан',en:'Done'}, cancelled:{mn:'Цуцлагдсан',en:'Cancelled'} };
  return <div className="admin-card"><h2>{title}</h2><div className="admin-toolbar"><button className="btn btn--outline btn--sm" onClick={exportCsv}>⬇ CSV</button></div>{bookings.length===0 ? <div className="empty">{lang==='mn'?'Захиалга байхгүй':'No bookings yet'}</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{lang==='mn'?'Нэр':'Name'}</th><th>{lang==='mn'?'Утас':'Phone'}</th><th>{lang==='mn'?'Төрөл':'Type'}</th><th>{lang==='mn'?'Дэлгэрэнгүй':'Details'}</th><th>{lang==='mn'?'Огноо':'Date'}</th><th>{lang==='mn'?'Статус':'Status'}</th><th>{lang==='mn'?'Үйлдэл':'Actions'}</th></tr></thead><tbody>{bookings.map(b => <tr key={b.id}><td>{b.name || '—'}</td><td>{b.phone || '—'}</td><td>{typeLabel(b.type,lang)}</td><td>{b.destination || b.to || b.country || b.hotelType || b.note || '—'}</td><td>{new Date(b.ts).toLocaleDateString(lang==='mn'?'mn-MN':'en-US')}</td><td><span className={`pill ${b.status}`}>{text(statusLabels[b.status],lang)}</span></td><td><div className="admin-actions"><select className="input" style={{padding:'7px 10px'}} value={b.status} onChange={e=>updateStatus(b.id,e.target.value as BookingStatus)}>{Object.entries(statusLabels).map(([k,v]) => <option key={k} value={k}>{text(v,lang)}</option>)}</select><button onClick={()=>del(b.id)}>🗑</button></div></td></tr>)}</tbody></table></div>}</div>;
}

createRoot(document.getElementById('root')!).render(<App />);
