import { ClipboardList, Handshake, Headset, MessagesSquare, Route, ScanSearch } from 'lucide-react'
import type { FaqItem, GalleryTile, Photo, Principle, ProcessStep, Service, Testimonial } from './types'

/*
 * Marketing copy. Services and principles describe the PROPOSED offering from
 * the project brief — confirm each with the business before launch.
 */

export const CAPABILITIES = [
  'Load sourcing',
  'Rate negotiation',
  'Broker communication',
  'Rate confirmations',
  'Paperwork & invoicing support',
  'Lane planning',
  'Owner-operators',
  'Small fleets',
] as const

/** Equipment types to support — business-specific, confirm before launch. */
export const EQUIPMENT = ['Dry van', 'Reefer', 'Flatbed', 'Step deck', 'Power only', 'Box truck'] as const

export const SERVICES: Service[] = [
  {
    id: 'load-sourcing',
    code: 'SVC-01',
    title: 'Load sourcing',
    summary: 'We search the load boards and call brokers directly to find freight that fits your truck, lanes and schedule.',
    value: 'Less time refreshing load boards. More time loaded.',
    includes: ['Load board searches matched to your equipment', 'Direct broker outreach on your target lanes', 'Load options sent to you with the key details', 'Reload planning before you deliver'],
    icon: ScanSearch,
    visual: 'board',
  },
  {
    id: 'rate-negotiation',
    code: 'SVC-02',
    title: 'Rate negotiation',
    summary: 'We negotiate with brokers on your behalf, using lane context and your cost per mile — never booking below your floor.',
    value: 'A dispatcher in your corner on every call.',
    includes: ['Rate checks against current lane conditions', 'Negotiation to your agreed floor rate', 'Accessorials and detention terms clarified up front', 'No booking without your approval'],
    icon: Handshake,
    visual: 'negotiate',
  },
  {
    id: 'route-coordination',
    code: 'SVC-03',
    title: 'Route & load coordination',
    summary: 'Pickup windows, delivery appointments and reloads planned together, so one load sets up the next.',
    value: 'Fewer empty miles between loads.',
    includes: ['Pickup and delivery appointments scheduled', 'Back-to-back load sequencing', 'Deadhead kept in view when choosing loads', 'Home-time preferences built into the plan'],
    icon: Route,
    visual: 'route',
  },
  {
    id: 'dispatch-communication',
    code: 'SVC-04',
    title: 'Dispatch communication',
    summary: 'We handle check calls, updates and broker back-and-forth, and keep you informed without flooding your phone.',
    value: 'One point of contact. Clear updates.',
    includes: ['Broker check calls and status updates', 'Problem-solving on delays and changes', 'Updates by phone, text or email — your choice', 'Clear handoffs at pickup and delivery'],
    icon: MessagesSquare,
    visual: 'comms',
  },
  {
    id: 'documentation',
    code: 'SVC-05',
    title: 'Documentation & admin',
    summary: 'Rate confirmations, BOLs, PODs and carrier packets — collected, organized and sent where they need to go.',
    value: 'Paperwork that’s done, not piling up.',
    includes: ['Rate confirmations reviewed and filed', 'BOL and POD collection', 'Carrier packets and broker setups', 'Documents organized for invoicing or factoring'],
    icon: ClipboardList,
    visual: 'docs',
  },
  {
    id: 'carrier-support',
    code: 'SVC-06',
    title: 'Carrier support',
    summary: 'Help with broker setups, operational questions and the day-to-day details that come with running your own authority.',
    value: 'Back-office support that scales with you.',
    includes: ['Broker setup and onboarding help', 'Answers on day-to-day operational questions', 'Support as you add trucks or drivers', 'A consistent process as you grow'],
    icon: Headset,
    visual: 'support',
  },
]

export const PROCESS: ProcessStep[] = [
  {
    title: 'Tell us about your operation',
    body: 'Your truck, your equipment, your authority, and how you like to run — home time, regions, freight you will and won’t haul.',
    detail: 'Intro call',
  },
  {
    title: 'Set the ground rules',
    body: 'We agree on target lanes, minimum rates and how you want to communicate. Your preferences become our dispatch brief.',
    detail: 'Dispatch brief',
  },
  {
    title: 'We find and negotiate loads',
    body: 'We search, call and negotiate, then bring you the options that fit. You approve before anything is booked.',
    detail: 'Load offers',
  },
  {
    title: 'We run the back-office',
    body: 'Rate cons, broker packets, check calls and paperwork are handled while you drive.',
    detail: 'On the road',
  },
  {
    title: 'Grow on solid ground',
    body: 'As you add trucks or change lanes, the same organized process scales with your operation.',
    detail: 'Ongoing',
  },
]

export const PRINCIPLES: Principle[] = [
  {
    numeral: 'I',
    title: 'Personal, not a call queue',
    body: 'You talk to people who know your truck, your lanes and your limits — not a different voice every time.',
  },
  {
    numeral: 'II',
    title: 'You stay in control',
    body: 'Loads are presented to you for approval. Your floor rate, your home time, your call.',
  },
  {
    numeral: 'III',
    title: 'Organized by default',
    body: 'Every load, document and conversation kept in order, so nothing gets lost between pickup and payment.',
  },
  {
    numeral: 'IV',
    title: 'Transparent from day one',
    body: 'Clear terms, clear fees and clear communication. No surprises buried in the fine print.',
  },
  {
    numeral: 'V',
    title: 'Built around your time',
    body: 'Your driving hours are limited. We take the phone calls and admin so those hours go into miles.',
  },
]

export const FAQ: FaqItem[] = [
  {
    q: 'What does a truck dispatcher actually do for me?',
    a: 'We find loads that fit your equipment and lanes, negotiate rates with brokers, handle the communication and paperwork around each load, and keep your schedule organized — so you can focus on driving.',
  },
  {
    q: 'Who do you work with?',
    a: 'Owner-operators running their own authority and small-to-growing fleets. If you’re just getting started, talk to us — we’ll tell you honestly whether we’re a good fit.',
  },
  {
    q: 'How is dispatch service priced?',
    a: 'Dispatch services are commonly priced as a percentage of each load’s gross or as a flat weekly fee. Our exact pricing will be published here and confirmed in writing before you start.',
    needsConfirmation: true,
  },
  {
    q: 'Do I have to accept every load you find?',
    a: 'No. We bring you load options that match the preferences we agreed on, and you approve before anything is booked.',
  },
  {
    q: 'Is there a long-term contract?',
    a: 'Agreement length and cancellation terms will be confirmed here. Whatever they are, you’ll see them in writing before signing anything.',
    needsConfirmation: true,
  },
  {
    q: 'What equipment types do you dispatch?',
    a: 'We plan to support dry van, reefer, flatbed, step deck, power only and box trucks. Confirm your specific setup with us on the intro call.',
    needsConfirmation: true,
  },
  {
    q: 'What do I need to get started?',
    a: 'Typically your MC/DOT authority, certificate of insurance, W-9 and a signed dispatch agreement. We’ll send a full checklist after the intro call.',
  },
  {
    q: 'How will we communicate?',
    a: 'Phone, text and email — whatever works for you on the road. We agree on update preferences up front so you hear from us when it matters.',
  },
]

const photo = (src: string, widths: [number, number], width: number, height: number, alt: string): Photo => ({
  src,
  widths,
  width,
  height,
  alt,
})

export const PHOTOS = {
  hero: photo('hero', [1280, 2200], 2200, 1467, 'A semi-truck on an open highway under a dramatic, storm-lit sky'),
  dusk: photo('dusk', [800, 1400], 1400, 931, 'A long-nose semi-truck driving on a wet highway at dusk with headlights on'),
  desert: photo('desert', [800, 1400], 1400, 727, 'A semi-truck parked on an open desert lot at golden hour'),
  mountain: photo('mountain', [800, 1400], 1400, 928, 'A truck and trailer climbing a winding mountain road'),
  trailer: photo('trailer', [600, 1100], 1100, 1649, 'The side of a dry-van trailer on the highway at sunset'),
  cab: photo('cab', [800, 1400], 1400, 933, 'A driver at the wheel with a phone mounted for navigation'),
  yard: photo('yard', [800, 1400], 1400, 745, 'Aerial view of rows of trailers parked in a freight yard at night'),
  scania: photo('scania', [800, 1400], 1400, 933, 'A white cab-over truck hauling a trailer on a sunny two-lane road'),
} satisfies Record<string, Photo>

export const GALLERY: GalleryTile[] = [
  { kind: 'photo', photo: PHOTOS.dusk, caption: 'Dusk run', shape: 'wide' },
  { kind: 'type', eyebrow: 'Hours of service', text: 'Your 11 driving hours belong on the road — not on hold with a broker.' },
  { kind: 'photo', photo: PHOTOS.trailer, caption: 'Fifty-three feet of trust', shape: 'tall' },
  { kind: 'terminal' },
  { kind: 'photo', photo: PHOTOS.mountain, caption: 'Grade ahead', shape: 'wide' },
  { kind: 'photo', photo: PHOTOS.cab, caption: 'Dispatch, on the line', shape: 'square' },
  { kind: 'route' },
  { kind: 'photo', photo: PHOTOS.yard, caption: 'The yard after dark', shape: 'wide' },
  { kind: 'photo', photo: PHOTOS.desert, caption: 'Staged for pickup', shape: 'wide' },
]

/**
 * Only add real, attributable client testimonials (with permission).
 * The section stays hidden while this list is empty.
 */
export const TESTIMONIALS: Testimonial[] = []
