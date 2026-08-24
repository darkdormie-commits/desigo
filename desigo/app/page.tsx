'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight, Bell, Bookmark, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleUserRound, Compass, Globe2, Heart, IndianRupee, Layers3, MapPin, Menu, Search,
  ShieldCheck, Sparkles, Star, Utensils, Users, X, Zap, Coffee, ShoppingCart, BookOpen,
  Trophy, PartyPopper, HeartHandshake, LayoutGrid, GraduationCap, BadgeCheck, Landmark, Disc3,
} from 'lucide-react';

const images = {
  diwali: 'https://images.pexels.com/photos/29422092/pexels-photo-29422092.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  food: 'https://images.pexels.com/photos/941869/pexels-photo-941869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  thali: 'https://images.pexels.com/photos/8818723/pexels-photo-8818723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  students: 'https://images.pexels.com/photos/5554257/pexels-photo-5554257.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

type View = 'home' | 'map' | 'events' | 'food' | 'community' | 'profile';
type EventCard = { title: string; category: string; date: string; time: string; location: string; image: string; color: string };

const eventCards: EventCard[] = [
  { title: 'Diwali Celebration 2026', category: 'Cultural', date: 'OCT 21', time: '6:00 PM', location: 'Tbilisi Event Hall', image: images.diwali, color: '#e9784e' },
  { title: 'Bollywood Night', category: 'Bollywood', date: 'SEP 15', time: '8:00 PM', location: 'Club Tbilisi', image: images.thali, color: '#1c6d56' },
  { title: 'Inter-University Cricket', category: 'Cricket', date: 'SEP 28', time: '9:00 AM', location: 'Tbilisi Sports Ground', image: images.students, color: '#d1dd62' },
  { title: 'Indian Food Festival', category: 'Food', date: 'OCT 05', time: '12:00 PM', location: 'Vake Park', image: images.food, color: '#e8b65b' },
];

const categories: [string, typeof Utensils][] = [
  ['All', LayoutGrid], ['Indian Food', Utensils], ['Cafes', Coffee], ['Grocery', ShoppingCart],
  ['Universities', BookOpen], ['Cricket', Trophy], ['Events', PartyPopper], ['Organizations', HeartHandshake],
];

const universities = ['Tbilisi State Medical University', 'European University', 'University of Georgia', 'Georgian National University SEU'];

// Medical colleges in Tbilisi commonly considered by Indian students for MBBS.
// Status changes yearly (NMC approval, intake policy) — always shown as "verify before applying".
type College = { name: string; type: 'Private' | 'Public'; note: string; status: 'open' | 'closed-new-intl' };
const tbilisiColleges: College[] = [
  { name: 'Georgian American University (GAU)', type: 'Private', note: 'Strong FMGE track record among Tbilisi private universities.', status: 'open' },
  { name: 'Caucasus International University (CIU)', type: 'Private', note: 'Established Indian student community in Tbilisi.', status: 'open' },
  { name: 'Tbilisi Medical Academy (TMA)', type: 'Private', note: 'Smaller private medical program based in Tbilisi.', status: 'open' },
  { name: 'Alte University', type: 'Private', note: 'Private university with an English-medium MBBS track.', status: 'open' },
  { name: 'East European University', type: 'Private', note: 'Frequently shortlisted by Indian MBBS applicants.', status: 'open' },
  { name: 'Caucasus University', type: 'Private', note: 'Private university with a medical faculty in Tbilisi.', status: 'open' },
  { name: 'University of Georgia', type: 'Private', note: 'Private university offering an MBBS program.', status: 'open' },
  { name: 'Grigol Robakidze University', type: 'Private', note: 'Private university with an international medical faculty.', status: 'open' },
  { name: 'David Tvildiani Medical University (DTMU)', type: 'Private', note: 'Long-running medical school, US clinical clerkship ties.', status: 'open' },
  { name: 'Tbilisi State Medical University (TSMU)', type: 'Public', note: 'Historically Georgia\u2019s top medical school.', status: 'closed-new-intl' },
  { name: 'Ivane Javakhishvili Tbilisi State University (TSU)', type: 'Public', note: 'Public university, MBBS track.', status: 'closed-new-intl' },
];

export default function Home() {
  const { profile, user, signIn, signUp, signOut } = useAuth();
  const [view, setView] = useState<View>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Tbilisi');
  const [university, setUniversity] = useState('');
  const [program, setProgram] = useState('Medicine');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [likedBusinesses, setLikedBusinesses] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredEvents = useMemo(() => eventCards.filter((event) => {
    const matchesSearch = `${event.title} ${event.category} ${event.location}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'Events' || event.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('indian ', '').replace('s', ''));
    return matchesSearch && matchesCategory;
  }), [search, selectedCategory]);

  const openCommunity = () => { setShowAuth(true); setAuthMode(user ? 'welcome' : 'welcome'); };
  const handleAuth = async () => {
    setAuthError('');
    const result = authMode === 'signup' ? await signUp(email, password) : await signIn(email, password);
    if (result.error) setAuthError(result.error);
    else if (authMode === 'signup') { setAuthMode('welcome'); setOnboardingStep(0); }
    else { setShowAuth(false); setAuthMode('welcome'); }
  };
  const finishOnboarding = async () => {
    if (user && name) {
      await supabase.from('users').upsert({ id: user.id, name, email, city, program, university_id: null, year: 'Year 1', semester: 'Semester 1' });
    }
    setShowAuth(false);
    setView('home');
  };
  const toggleLike = (title: string) => setLikedEvents((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);

  return (
    <main className="min-h-screen bg-[#f6f5f0]">
      <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 sm:px-8">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_36px_rgba(30,52,38,.08)] backdrop-blur-xl sm:px-6">
          <button onClick={() => setView('home')} className="flex items-center gap-3 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d6b4d] text-sm font-black text-[#d8ee61]">D</span>
            <span className="text-[15px] font-black tracking-[.18em] text-[#143b2e]">DESIGO</span>
          </button>
          <div className="hidden items-center gap-1 md:flex">
            {([['home', 'Home'], ['map', 'Map'], ['events', 'Events'], ['food', 'Food'], ['community', 'Community']] as [View, string][]).map(([item, label]) => (
              <button key={item} onClick={() => setView(item)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${view === item ? 'bg-[#eaf2df] text-[#0d6b4d]' : 'text-[#68736d] hover:bg-[#f1f3ed] hover:text-[#183c2e]'}`}>{label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Notifications" className="hidden rounded-xl p-2.5 text-[#66726c] hover:bg-[#f0f2ed] sm:block"><Bell size={18} /></button>
            <button onClick={() => user ? setView('profile') : openCommunity()} className="flex items-center gap-2 rounded-xl border border-[#dfe6dc] bg-white px-3 py-2 text-sm font-bold text-[#183c2e] transition hover:border-[#0d6b4d]">
              <CircleUserRound size={18} className="text-[#0d6b4d]" /><span className="hidden sm:inline">{profile?.name || 'Join DesiGo'}</span>
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe6dc] bg-white text-[#183c2e] transition hover:border-[#0d6b4d] md:hidden">
              <motion.span animate={{ rotate: mobileMenu ? 90 : 0 }} className="flex flex-col items-center justify-center gap-[3px]">
                <span className={`h-[2px] w-4 rounded-full bg-current transition ${mobileMenu ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`h-[2px] w-4 rounded-full bg-current transition ${mobileMenu ? 'opacity-0' : ''}`} />
                <span className={`h-[2px] w-4 rounded-full bg-current transition ${mobileMenu ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </motion.span>
            </button>
          </div>
        </nav>
        <div className="tricolor-bar mx-auto mt-1.5 h-[3px] max-w-[220px] rounded-full opacity-70" />
        <AnimatePresence>{mobileMenu && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto mt-2 max-w-[1400px] rounded-2xl border border-white bg-white p-2 shadow-xl md:hidden">{(['home', 'map', 'events', 'food', 'community', 'profile'] as View[]).map((item) => <button key={item} onClick={() => { setView(item); setMobileMenu(false); }} className="block w-full rounded-xl px-4 py-3 text-left text-sm font-bold capitalize text-[#183c2e] hover:bg-[#eef3e9]">{item}</button>)}</motion.div>}</AnimatePresence>
      </header>

      {view === 'home' && <HomeView profileName={profile?.name} onEnter={openCommunity} onView={setView} search={search} setSearch={setSearch} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} filteredEvents={filteredEvents} likedEvents={likedEvents} toggleLike={toggleLike} />}
      {view === 'map' && <MapView selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
      {view === 'events' && <EventsView filteredEvents={filteredEvents} search={search} setSearch={setSearch} likedEvents={likedEvents} toggleLike={toggleLike} />}
      {view === 'food' && <FoodView likedBusinesses={likedBusinesses} setLikedBusinesses={setLikedBusinesses} />}
      {view === 'community' && <CommunityView />}
      {view === 'profile' && <ProfileView profile={profile} user={user} onSignOut={signOut} onJoin={openCommunity} />}

      <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_14px_40px_rgba(24,54,39,.16)] backdrop-blur-xl md:hidden">
        {([['home', Compass], ['map', Globe2], ['events', CalendarDays], ['community', Users], ['profile', CircleUserRound] ] as [View, typeof Compass][]).map(([item, Icon]) => <button key={item} onClick={() => setView(item)} className={`rounded-xl p-3 ${view === item ? 'bg-[#0d6b4d] text-[#d8ee61]' : 'text-[#69746c]'}`} aria-label={item}><Icon size={19} /></button>)}
      </div>

      <AnimatePresence>{showAuth && <AuthModal mode={authMode} setMode={setAuthMode} step={onboardingStep} setStep={setOnboardingStep} name={name} setName={setName} city={city} setCity={setCity} university={university} setUniversity={setUniversity} program={program} setProgram={setProgram} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={authError} onAuth={handleAuth} onFinish={finishOnboarding} onClose={() => { setShowAuth(false); setOnboardingStep(0); }} user={user} />}</AnimatePresence>
    </main>
  );
}

function HomeView({ profileName, onEnter, onView, search, setSearch, selectedCategory, setSelectedCategory, filteredEvents, likedEvents, toggleLike }: { profileName?: string; onEnter: () => void; onView: (view: View) => void; search: string; setSearch: (value: string) => void; selectedCategory: string; setSelectedCategory: (value: string) => void; filteredEvents: EventCard[]; likedEvents: string[]; toggleLike: (title: string) => void }) {
  const [wheelOpen, setWheelOpen] = useState(false);
  return <>
    <section className="relative min-h-[670px] overflow-hidden bg-[#f6f5f0] px-5 pb-16 pt-36 sm:px-8 lg:min-h-[760px]">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" /><div className="absolute -right-20 -top-16 h-[480px] w-[480px] rounded-full bg-[#dceccf] blur-3xl" /><div className="absolute bottom-0 left-[-100px] h-[300px] w-[420px] rounded-full bg-[#f4dac7] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1fr_500px] lg:gap-20">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9e7d5] bg-white/70 px-3 py-2 text-xs font-bold tracking-wide text-[#0d6b4d]"><Sparkles size={14} /> DISCOVER YOUR COMMUNITY</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="max-w-2xl text-5xl font-black leading-[.98] tracking-[-.06em] text-[#163b2e] sm:text-7xl">Everything Indian<br /><span className="text-[#e9784e]">in Georgia.</span><br />One place.</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18 }} className="mt-7 max-w-lg text-base leading-7 text-[#69746d] sm:text-lg">Events. Food. Students. Businesses. Community. Discover what&apos;s happening around you and find your people — all in one place.</motion.p>
          <div className="mt-9 flex flex-wrap items-center gap-3"><button onClick={onEnter} className="group flex items-center gap-3 rounded-2xl bg-[#0d6b4d] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_22px_rgba(13,107,77,.22)] transition hover:-translate-y-1">Enter the Community <ArrowRight size={17} className="transition group-hover:translate-x-1" /></button><button onClick={() => onView('map')} className="rounded-2xl border border-[#d4ded5] bg-white/70 px-5 py-3.5 text-sm font-bold text-[#183c2e] transition hover:bg-white">Explore as Guest</button></div>
          <div className="mt-11 flex items-center gap-4 text-xs font-semibold text-[#768078]"><div className="flex -space-x-2">{['#e9784e','#0d6b4d','#f2c45c','#527d9f'].map((color) => <span key={color} style={{ background: color }} className="h-8 w-8 rounded-full border-2 border-[#f6f5f0]" />)}</div><span>Join 1,200+ Indians building community in Georgia</span></div>
        </div>
        <motion.div initial={{ opacity: 0, scale: .94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8, ease: 'easeOut' }} className="relative mx-auto h-[380px] w-full max-w-[500px] lg:h-[480px]">
          <div className="absolute left-[12%] top-[8%] h-[74%] w-[72%] rounded-[46%_54%_50%_50%] bg-[#0d6b4d] shadow-[25px_30px_0_#c9df62] rotate-[22deg]" /><div className="absolute left-[26%] top-[22%] h-[55%] w-[44%] rounded-[50%] border border-white/20 bg-[#1d7c5c]/60 backdrop-blur-sm rotate-[22deg]" />
          <div className="absolute left-[42%] top-[28%] h-4 w-4 rounded-full bg-[#f6d171] shadow-[0_0_0_10px_rgba(246,209,113,.14)] pulse-ring" /><div className="absolute bottom-[20%] right-[14%] flex items-center gap-2 rounded-2xl border border-white/60 bg-white/85 px-3 py-2 text-xs font-bold text-[#183c2e] shadow-lg backdrop-blur-md"><MapPin size={14} className="text-[#e9784e]" /> Tbilisi, Georgia</div><div className="absolute left-[4%] top-[17%] rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-xs font-bold text-[#183c2e] shadow-lg backdrop-blur-md">India <ArrowRight size={13} className="mx-1 inline text-[#e9784e]" /> Community</div>
          <div className="absolute bottom-[5%] left-[28%] text-center"><div className="text-4xl font-black tracking-[-.08em] text-[#183c2e]">D</div><div className="text-[10px] font-bold tracking-[.25em] text-[#0d6b4d]">DESIGO</div></div>
        </motion.div>
      </div>
    </section>
    <section className="relative z-10 -mt-2 px-5 sm:px-8"><div className="mx-auto max-w-[1400px] rounded-[28px] bg-[#163b2e] p-5 shadow-[0_20px_50px_rgba(22,59,46,.18)] sm:p-7"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d8ee61]">{profileName ? `Good to see you, ${profileName}` : 'Your community, curated'}</p><h2 className="mt-1 text-xl font-black text-white">What&apos;s happening in Georgia today?</h2></div><Zap className="text-[#d8ee61]" size={24} /></div><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91ab9b]" size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events, restaurants, universities..." className="w-full rounded-2xl border border-white/10 bg-white/10 py-3.5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-[#9cb1a4] focus:border-[#d8ee61]" /></div><div className="mt-5 flex items-center gap-2"><div className="hide-scrollbar flex flex-1 gap-2 overflow-x-auto pb-1">{categories.map(([label, Icon]) => <button key={label} onClick={() => setSelectedCategory(label)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${selectedCategory === label ? 'bg-[#d8ee61] text-[#163b2e]' : 'bg-white/10 text-[#d7e2d9] hover:bg-white/20'}`}><Icon size={15} />{label}</button>)}</div><button onClick={() => setWheelOpen(true)} aria-label="Open category wheel" className="glass-dark flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#d8ee61] transition hover:scale-105 hover:bg-white/20"><Disc3 size={19} /></button></div></div></section>
    <AnimatePresence>{wheelOpen && <CategoryWheel selected={selectedCategory} onSelect={(label) => { setSelectedCategory(label); setWheelOpen(false); }} onClose={() => setWheelOpen(false)} />}</AnimatePresence>
    <section className="px-5 pb-28 pt-16 sm:px-8"><div className="mx-auto max-w-[1400px]"><SectionHeading eyebrow="HAPPENING SOON" title="Make plans worth remembering" action="View all events →" onClick={() => onView('events')} /><div className="hide-scrollbar mt-7 grid gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">{filteredEvents.map((event, index) => <EventCard key={event.title} event={event} index={index} liked={likedEvents.includes(event.title)} onLike={() => toggleLike(event.title)} />)}</div>{filteredEvents.length === 0 && <EmptyState text="No events match that search yet." />}</div></section>
    <section className="bg-[#e8eee4] px-5 py-20 sm:px-8"><div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0d6b4d]">DESI MAP</p><h2 className="mt-3 max-w-md text-4xl font-black tracking-[-.05em] text-[#163b2e] sm:text-5xl">Find your next favorite place.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#69746d]">From your go-to chai spot to the next cricket match — see what&apos;s around you, all on one living map.</p><button onClick={() => onView('map')} className="mt-7 flex items-center gap-2 rounded-2xl bg-[#0d6b4d] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-1">Open Desi Map <ArrowRight size={16} /></button></div><MiniMap onClick={() => onView('map')} /></div></section>
    <section className="px-5 py-20 sm:px-8"><div className="mx-auto max-w-[1400px]"><SectionHeading eyebrow="EXPLORE DESIGO" title="Your people, your places" /><div className="mt-7 grid gap-4 sm:grid-cols-3"><FeatureCard icon={<Utensils />} title="Indian Food" text="Find restaurants, tiffin, grocery and sweets verified by the community." color="#f1d6c5" onClick={() => onView('food')} /><FeatureCard icon={<GraduationIcon />} title="Student Life" text="Connect with university communities and find your people in Georgia." color="#dce8c7" onClick={() => onView('community')} /><FeatureCard icon={<Users />} title="Community" text="Stay close to announcements, organizations and what matters to you." color="#d9e2ee" onClick={() => onView('community')} /></div></div></section>
  </>;
}

function SectionHeading({ eyebrow, title, action, onClick }: { eyebrow: string; title: string; action?: string; onClick?: () => void }) { return <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0d6b4d]">{eyebrow}</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em] text-[#163b2e] sm:text-4xl">{title}</h2></div>{action && <button onClick={onClick} className="hidden shrink-0 text-sm font-bold text-[#0d6b4d] sm:block">{action}</button>}</div>; }
function EventCard({ event, index, liked, onLike }: { event: EventCard; index: number; liked: boolean; onLike: () => void }) { return <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }} className="group min-w-[280px] overflow-hidden rounded-3xl border border-[#e4e7e0] bg-white shadow-[0_8px_25px_rgba(40,57,45,.05)]"><div className="relative h-48 overflow-hidden"><img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#183c2e]">{event.category}</div><button onClick={onLike} aria-label="Save event" className={`absolute right-3 top-3 rounded-lg p-2 backdrop-blur-md transition ${liked ? 'bg-[#e9784e] text-white' : 'bg-white/85 text-[#183c2e] hover:bg-white'}`}><Heart size={16} fill={liked ? 'currentColor' : 'none'} /></button></div><div className="p-4"><h3 className="font-black text-[#183c2e]">{event.title}</h3><div className="mt-3 space-y-2 text-xs font-semibold text-[#78827b]"><p className="flex items-center gap-2"><CalendarDays size={14} className="text-[#e9784e]" /> {event.date} · {event.time}</p><p className="flex items-center gap-2"><MapPin size={14} className="text-[#0d6b4d]" /> {event.location}</p></div></div></motion.article>; }
function MiniMap({ onClick }: { onClick: () => void }) { return <button onClick={onClick} className="group relative h-[320px] overflow-hidden rounded-[30px] border border-white bg-[#dce7df] text-left shadow-[0_16px_35px_rgba(48,76,56,.12)]"><div className="map-grid absolute inset-0 opacity-90" /><div className="map-road one" /><div className="map-road two" /><div className="map-road three" /><div className="map-road four" /><MapPinMarker left="22%" top="38%" color="#e9784e" label="Delhi Darbar" /><MapPinMarker left="64%" top="23%" color="#0d6b4d" label="TSMU" /><MapPinMarker left="73%" top="68%" color="#e0ae42" label="Cricket" /><div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-[#183c2e] shadow-lg backdrop-blur-md">Tbilisi · 12 places nearby</div><div className="absolute right-4 top-4 rounded-xl bg-[#163b2e] px-3 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">Open full map <ArrowRight size={13} className="ml-1 inline" /></div></button>; }
function MapPinMarker({ left, top, color, label }: { left: string; top: string; color: string; label: string }) { return <div style={{ left, top }} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"><div style={{ background: color }} className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white text-white shadow-lg"><MapPin size={17} fill="currentColor" /></div><div className="mt-1 rounded-lg bg-white/90 px-2 py-1 text-[9px] font-bold text-[#183c2e] shadow-sm">{label}</div></div>; }
function FeatureCard({ icon, title, text, color, onClick }: { icon: React.ReactNode; title: string; text: string; color: string; onClick: () => void }) { return <button onClick={onClick} style={{ background: color }} className="group rounded-3xl p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/75 text-[#183c2e]">{icon}</div><h3 className="mt-7 text-xl font-black text-[#183c2e]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#526159]">{text}</p><ArrowRight size={18} className="mt-6 text-[#183c2e] transition group-hover:translate-x-1" /></button>; }
function GraduationIcon() { return <span className="text-xl">🎓</span>; }
function EmptyState({ text }: { text: string }) { return <div className="rounded-3xl border border-dashed border-[#cfd9cf] bg-white/50 p-10 text-center text-sm font-semibold text-[#6d786f]">{text}</div>; }

function CategoryWheel({ selected, onSelect, onClose }: { selected: string; onSelect: (label: string) => void; onClose: () => void }) {
  const radius = 128;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b1f17]/55 p-4 backdrop-blur-sm">
      <motion.div onClick={(event) => event.stopPropagation()} initial={{ scale: .7, opacity: 0, rotate: -14 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: .7, opacity: 0 }} transition={{ type: 'spring', damping: 18, stiffness: 220 }} className="glass-dark relative flex h-[320px] w-[320px] items-center justify-center rounded-full sm:h-[380px] sm:w-[380px]">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"><X size={16} /></button>
        <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full bg-[#d8ee61] text-center text-[#163b2e] shadow-[0_8px_24px_rgba(0,0,0,.25)]">
          <Disc3 size={18} /><span className="mt-1 text-[9px] font-black uppercase tracking-wide">Filter</span>
        </div>
        {categories.map(([label, Icon], index) => {
          const angle = (index / categories.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const active = selected === label;
          return (
            <motion.button key={label} onClick={() => onSelect(label)} whileHover={{ scale: 1.12 }} whileTap={{ scale: .94 }} style={{ transform: `translate(${x}px, ${y}px)` }} className={`absolute flex h-[62px] w-[62px] flex-col items-center justify-center gap-1 rounded-full border text-[9px] font-bold shadow-lg transition sm:h-[72px] sm:w-[72px] ${active ? 'border-[#d8ee61] bg-[#d8ee61] text-[#163b2e]' : 'border-white/25 bg-white/95 text-[#183c2e]'}`}>
              <Icon size={16} />{label.split(' ')[0]}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function MapView({ selectedCategory, setSelectedCategory }: { selectedCategory: string; setSelectedCategory: (value: string) => void }) { return <div className="px-5 pb-28 pt-32 sm:px-8"><div className="mx-auto max-w-[1400px]"><SectionHeading eyebrow="EXPLORE GEORGIA" title="Desi Map" /><p className="mt-3 max-w-xl text-[#6d786f]">A living map of places, people and moments that make Georgia feel a little more like home.</p><div className="hide-scrollbar mt-7 flex gap-2 overflow-x-auto pb-2">{categories.slice(0, 8).map(([label, Icon]) => <button key={label} onClick={() => setSelectedCategory(label)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${selectedCategory === label ? 'border-[#0d6b4d] bg-[#0d6b4d] text-white' : 'border-[#dde5dc] bg-white text-[#526159]'}`}><Icon size={15} /> {label}</button>)}</div><div className="relative mt-4 h-[620px] overflow-hidden rounded-[32px] border border-white bg-[#dce7df] shadow-[0_18px_45px_rgba(48,76,56,.12)]"><div className="map-grid absolute inset-0" /><div className="map-road one" /><div className="map-road two" /><div className="map-road three" /><div className="map-road four" />{[['22%','38%','#e9784e','Delhi Darbar'],['64%','23%','#0d6b4d','TSMU'],['73%','68%','#e0ae42','Cricket Ground'],['42%','70%','#527d9f','Indian Grocery'],['84%','44%','#d974a0','Bollywood Night']].map(([left, top, color, label]) => <MapPinMarker key={label} left={left} top={top} color={color} label={label} />)}<div className="absolute left-4 top-4 flex gap-2"><button className="rounded-xl bg-white/90 p-3 text-[#183c2e] shadow-md"><Layers3 size={18} /></button><button className="rounded-xl bg-white/90 p-3 text-[#183c2e] shadow-md"><MapPin size={18} /></button></div><div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md"><p className="text-xs font-bold text-[#0d6b4d]">{selectedCategory === 'All' ? 'ALL PLACES' : selectedCategory.toUpperCase()}</p><p className="mt-1 text-sm font-black text-[#183c2e]">12 discoveries nearby</p></div></div></div></div>; }

function EventsView({ filteredEvents, search, setSearch, likedEvents, toggleLike }: { filteredEvents: EventCard[]; search: string; setSearch: (value: string) => void; likedEvents: string[]; toggleLike: (title: string) => void }) { const eventFilters = ['All', 'Today', 'This weekend', 'Cultural', 'Cricket', 'Student', 'Food']; return <div className="px-5 pb-28 pt-32 sm:px-8"><div className="mx-auto max-w-[1400px]"><SectionHeading eyebrow="FIND YOUR PEOPLE" title="Events in Georgia" /><div className="mt-7 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#869188]" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-full rounded-2xl border border-[#dde5dc] bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#0d6b4d]" /></div><button className="flex items-center justify-center gap-2 rounded-2xl bg-[#0d6b4d] px-5 py-3.5 text-sm font-bold text-white"><CalendarDays size={17} /> Add Event</button></div><div className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">{eventFilters.map((filter, index) => <button key={filter} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ${index === 0 ? 'bg-[#163b2e] text-white' : 'bg-white text-[#6d786f] ring-1 ring-[#e1e7df]'}`}>{filter}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filteredEvents.map((event, index) => <EventCard key={event.title} event={event} index={index} liked={likedEvents.includes(event.title)} onLike={() => toggleLike(event.title)} />)}</div></div></div>; }

function FoodView({ likedBusinesses, setLikedBusinesses }: { likedBusinesses: string[]; setLikedBusinesses: React.Dispatch<React.SetStateAction<string[]>> }) { const foods = [{ name: 'Delhi Darbar', type: 'North Indian', place: 'Rustaveli Avenue', image: images.food, verified: false }, { name: 'Spice Garden', type: 'North Indian', place: 'Vake, Tbilisi', image: images.thali, verified: false }, { name: 'Namaste Cafe', type: 'Indian Cafe', place: 'Old Town', image: images.diwali, verified: false }, { name: 'Tiffin Service Tbilisi', type: 'Home-style Tiffin', place: 'Saburtalo', image: images.students, verified: false }]; const toggle = (name: string) => setLikedBusinesses((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]); return <div className="px-5 pb-28 pt-32 sm:px-8"><div className="mx-auto max-w-[1400px]"><SectionHeading eyebrow="TASTE OF HOME" title="Indian Food in Georgia" /><p className="mt-3 max-w-xl text-[#6d786f]">Discover places for a proper thali, a quick chai, or the ingredients to cook home.</p><div className="hide-scrollbar mt-7 flex gap-2 overflow-x-auto pb-2">{['All', 'Restaurants', 'Cafes', 'Tiffin', 'Grocery', 'Sweets', 'Vegetarian', 'Vegan'].map((filter) => <button key={filter} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ${filter === 'All' ? 'bg-[#163b2e] text-white' : 'bg-white text-[#6d786f] ring-1 ring-[#e1e7df]'}`}>{filter}</button>)}</div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{foods.map((food, index) => <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} key={food.name} className="overflow-hidden rounded-3xl border border-[#e4e7e0] bg-white"><div className="relative h-48"><img src={food.image} alt={food.name} className="h-full w-full object-cover" /><button onClick={() => toggle(food.name)} className={`absolute right-3 top-3 rounded-xl p-2.5 ${likedBusinesses.includes(food.name) ? 'bg-[#e9784e] text-white' : 'bg-white/90 text-[#183c2e]'}`}><Bookmark size={16} fill={likedBusinesses.includes(food.name) ? 'currentColor' : 'none'} /></button></div><div className="p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-black text-[#183c2e]">{food.name}</h3>{food.verified && <ShieldCheck size={15} className="text-[#0d6b4d]" />}</div><p className="mt-1 text-xs font-semibold text-[#0d6b4d]">{food.type}</p><p className="mt-3 flex items-center gap-1.5 text-xs text-[#78827b]"><MapPin size={14} /> {food.place}</p><p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-[#a1784c]">Community listed · verify before visiting</p></div></motion.article>)}</div></div></div>; }

function MedicalCollegesSection() {
  return (
    <div className="mb-14">
      <SectionHeading eyebrow="MBBS FOR INDIAN STUDENTS" title="Medical colleges in Tbilisi" />
      <p className="mt-3 max-w-2xl text-[#6d786f]">A starting list of Tbilisi-based medical universities Indian NEET-qualified students commonly shortlist for MBBS. NMC approval and intake policy change yearly &mdash; always verify current status directly with the university and at nmc.org.in before applying.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tbilisiColleges.map((college, index) => (
          <motion.article key={college.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} className="flex flex-col rounded-3xl border border-[#e4e7e0] bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf2df] text-[#0d6b4d]"><Landmark size={19} /></div>
              <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${college.type === 'Private' ? 'bg-[#eaf2df] text-[#0d6b4d]' : 'bg-[#f1e6d6] text-[#a1784c]'}`}>{college.type}</span>
            </div>
            <h3 className="mt-4 text-base font-black leading-tight text-[#183c2e]">{college.name}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#78827b]"><MapPin size={13} /> Tbilisi, Georgia</p>
            <p className="mt-3 text-sm leading-6 text-[#6d786f]">{college.note}</p>
            <div className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${college.status === 'open' ? 'bg-[#dce8c7] text-[#3f6b2f]' : 'bg-[#f3d9d2] text-[#a1432c]'}`}>
              {college.status === 'open' ? <BadgeCheck size={13} /> : <X size={13} />}
              {college.status === 'open' ? 'Open for new intl. intake' : 'Closed to new intl. students (2026)'}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function CommunityView() { return <div className="px-5 pb-28 pt-32 sm:px-8"><div className="mx-auto max-w-[1400px]"><MedicalCollegesSection /><SectionHeading eyebrow="STAY IN THE LOOP" title="Community board" /><div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.55fr]"><div className="space-y-4">{[{ title: 'Embassy Advisory: Registration for Indian Nationals', source: 'Embassy of India, Tbilisi', date: 'AUG 20', color: '#e8d6c7' }, { title: 'University Orientation Week', source: 'Tbilisi State Medical University', date: 'AUG 22', color: '#dce8c7' }, { title: 'Cricket Tournament Registration Open', source: 'Indian Cricket Club Georgia', date: 'AUG 23', color: '#d9e2ee' }].map((item) => <article key={item.title} style={{ background: item.color }} className="rounded-3xl p-6"><div className="flex items-start justify-between gap-5"><div><span className="rounded-lg bg-white/65 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#526159]">{item.date}</span><h3 className="mt-4 max-w-lg text-xl font-black text-[#183c2e]">{item.title}</h3><p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#5f6c63]"><ShieldCheck size={15} className="text-[#0d6b4d]" /> {item.source}</p></div><ArrowRight className="text-[#183c2e]" size={20} /></div></article>)}</div><div className="rounded-3xl bg-[#163b2e] p-7 text-white"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8ee61] text-[#163b2e]"><Users size={22} /></div><h3 className="mt-8 text-2xl font-black">Your community is built by you.</h3><p className="mt-3 text-sm leading-6 text-[#c4d6c9]">Know something happening? Share it with Indians across Georgia and help someone feel at home.</p><button className="mt-7 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#163b2e]">Share an update <ArrowRight size={15} /></button></div></div></div></div>; }

function ProfileView({ profile, user, onSignOut, onJoin }: { profile: ReturnType<typeof useAuth>['profile']; user: ReturnType<typeof useAuth>['user']; onSignOut: () => Promise<void>; onJoin: () => void }) { return <div className="px-5 pb-28 pt-32 sm:px-8"><div className="mx-auto max-w-[900px]">{!user ? <div className="rounded-[32px] bg-[#163b2e] p-10 text-center text-white"><CircleUserRound className="mx-auto text-[#d8ee61]" size={42} /><h2 className="mt-5 text-3xl font-black">Your DesiGo profile</h2><p className="mx-auto mt-3 max-w-md text-[#c6d8cc]">Join to save events, personalize your experience, and connect with your university community.</p><button onClick={onJoin} className="mt-7 rounded-2xl bg-[#d8ee61] px-5 py-3.5 text-sm font-black text-[#163b2e]">Enter the Community <ArrowRight size={16} className="ml-1 inline" /></button></div> : <><SectionHeading eyebrow="YOUR DESIGO" title={`Welcome, ${profile?.name || 'member'}`} /><div className="mt-8 grid gap-5 sm:grid-cols-2"><div className="rounded-3xl bg-white p-6 ring-1 ring-[#e4e7e0]"><p className="text-xs font-bold uppercase tracking-wide text-[#0d6b4d]">PROFILE</p><div className="mt-6 space-y-4 text-sm"><p><span className="text-[#8a948c]">City</span><br /><strong>{profile?.city || 'Tbilisi'}</strong></p><p><span className="text-[#8a948c]">Program</span><br /><strong>{profile?.program || 'Add your program'}</strong></p><p><span className="text-[#8a948c]">University</span><br /><strong>{universities[0]}</strong></p></div><button className="mt-6 w-full rounded-xl border border-[#dce5dc] py-3 text-sm font-bold text-[#183c2e]">Edit profile</button></div><div className="rounded-3xl bg-[#e8eee4] p-6"><p className="text-xs font-bold uppercase tracking-wide text-[#0d6b4d]">SAVED ITEMS</p><div className="mt-5 flex items-center gap-3"><div className="rounded-xl bg-white p-3 text-[#e9784e]"><Heart size={18} fill="currentColor" /></div><div><p className="font-black text-[#183c2e]">Your collection</p><p className="text-sm text-[#6d786f]">Events and places you love</p></div></div><button className="mt-7 flex items-center gap-2 text-sm font-bold text-[#0d6b4d]">View saved items <ArrowRight size={15} /></button></div></div><button onClick={onSignOut} className="mt-7 text-sm font-bold text-[#e9784e]">Sign out</button></>}</div></div>; }

function AuthModal({ mode, setMode, step, setStep, name, setName, city, setCity, university, setUniversity, program, setProgram, email, setEmail, password, setPassword, error, onAuth, onFinish, onClose, user }: { mode: 'welcome' | 'login' | 'signup'; setMode: (value: 'welcome' | 'login' | 'signup') => void; step: number; setStep: (value: number) => void; name: string; setName: (value: string) => void; city: string; setCity: (value: string) => void; university: string; setUniversity: (value: string) => void; program: string; setProgram: (value: string) => void; email: string; setEmail: (value: string) => void; password: string; setPassword: (value: string) => void; error: string; onAuth: () => void; onFinish: () => void; onClose: () => void; user: ReturnType<typeof useAuth>['user'] }) { const next = () => setStep(step + 1); return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#102e48]/45 p-4 backdrop-blur-sm"><motion.div initial={{ opacity: 0, y: 25, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }} className="relative w-full max-w-[520px] overflow-hidden rounded-[32px] bg-[#f6f5f0] shadow-2xl"><button onClick={onClose} className="absolute right-5 top-5 z-10 rounded-xl bg-white/75 p-2 text-[#526159]"><X size={18} /></button><div className="bg-[#163b2e] px-7 pb-8 pt-9 text-white"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d8ee61] font-black text-[#163b2e]">D</div><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#d8ee61]">DESIGO</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em]">{mode === 'welcome' ? 'Come on in.' : mode === 'login' ? 'Welcome back.' : step > 0 ? 'Make it yours.' : 'Create your place.'}</h2><p className="mt-2 text-sm text-[#bfd2c4]">{mode === 'welcome' ? 'A little less searching. A lot more belonging.' : 'Everything Indian in Georgia, one place.'}</p></div><div className="p-7">{mode === 'welcome' && !user && <div className="space-y-3"><button onClick={() => setMode('signup')} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d6b4d] py-3.5 text-sm font-bold text-white">Create your profile <ArrowRight size={16} /></button><button onClick={() => setMode('login')} className="w-full rounded-2xl border border-[#d8e1d8] bg-white py-3.5 text-sm font-bold text-[#183c2e]">I already have an account</button><button onClick={onClose} className="w-full py-2 text-sm font-semibold text-[#78827b]">Continue as guest</button></div>}{mode === 'welcome' && user && <Onboarding step={step} setStep={setStep} name={name} setName={setName} city={city} setCity={setCity} university={university} setUniversity={setUniversity} program={program} setProgram={setProgram} next={next} onFinish={onFinish} />}{(mode === 'login' || (mode === 'signup' && step === 0)) && <div className="space-y-4"><label className="block text-sm font-bold text-[#183c2e]">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3 outline-none focus:border-[#0d6b4d]" placeholder="you@example.com" /></label><label className="block text-sm font-bold text-[#183c2e]">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3 outline-none focus:border-[#0d6b4d]" placeholder="At least 6 characters" /></label>{error && <p className="text-sm font-semibold text-[#d65e3c]">{error}</p>}<button onClick={onAuth} className="w-full rounded-2xl bg-[#0d6b4d] py-3.5 text-sm font-bold text-white">{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} className="ml-1 inline" /></button><button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="w-full text-sm font-semibold text-[#0d6b4d]">{mode === 'login' ? 'New here? Create an account' : 'Already a member? Sign in'}</button></div>}</div></motion.div></motion.div>; }

function Onboarding({ step, setStep, name, setName, city, setCity, university, setUniversity, program, setProgram, next, onFinish }: { step: number; setStep: (value: number) => void; name: string; setName: (value: string) => void; city: string; setCity: (value: string) => void; university: string; setUniversity: (value: string) => void; program: string; setProgram: (value: string) => void; next: () => void; onFinish: () => void }) { const steps = [{ title: 'What should we call you?', sub: 'Your name helps your community feel a little closer.', content: <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3.5 outline-none focus:border-[#0d6b4d]" /> }, { title: 'Where do you live?', sub: 'We will use this to show you what is close by.', content: <select value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3.5 outline-none focus:border-[#0d6b4d]"><option>Tbilisi</option><option>Batumi</option><option>Kutaisi</option><option>Other</option></select> }, { title: 'Where do you study?', sub: 'Find your people at university.', content: <><select value={university} onChange={(event) => setUniversity(event.target.value)} className="w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3.5 outline-none focus:border-[#0d6b4d]"><option value="">Select your university</option>{universities.map((item) => <option key={item}>{item}</option>)}</select><button className="mt-3 text-xs font-bold text-[#0d6b4d]">I don&apos;t see my university</button></> }, { title: 'What are you studying?', sub: 'This helps us personalize your DesiGo.', content: <select value={program} onChange={(event) => setProgram(event.target.value)} className="w-full rounded-xl border border-[#dce5dc] bg-white px-4 py-3.5 outline-none focus:border-[#0d6b4d]"><option>Medicine</option><option>Dentistry</option><option>Business Administration</option><option>Computer Science</option><option>Other</option></select> }]; const current = steps[step]; return <div><div className="mb-6 flex gap-1.5">{steps.map((_, index) => <div key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-[#0d6b4d]' : 'bg-[#dce5dc]'}`} />)}</div>{step < steps.length ? <><h3 className="text-2xl font-black text-[#183c2e]">{current.title}</h3><p className="mt-2 text-sm text-[#78827b]">{current.sub}</p><div className="mt-6">{current.content}</div><button onClick={next} className="mt-7 w-full rounded-2xl bg-[#0d6b4d] py-3.5 text-sm font-bold text-white">Continue <ArrowRight size={16} className="ml-1 inline" /></button></> : <div className="py-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d8ee61] text-[#0d6b4d]"><Check size={30} /></div><h3 className="mt-6 text-2xl font-black text-[#183c2e]">Welcome to DesiGo{ name ? `, ${name.split(' ')[0]}` : '' }.</h3><p className="mt-2 text-sm leading-6 text-[#78827b]">Your community in Georgia is ready when you are.</p><button onClick={onFinish} className="mt-7 w-full rounded-2xl bg-[#0d6b4d] py-3.5 text-sm font-bold text-white">Enter DesiGo <ArrowRight size={16} className="ml-1 inline" /></button></div>}</div>; }
