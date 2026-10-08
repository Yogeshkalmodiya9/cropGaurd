import { ScanResult, FarmPlot, NotificationItem, FarmerProfile } from '../types';
import { VERIFIED_TREATMENT_DATABASE } from './treatmentDatabase';

export const SAMPLE_IMAGES = {
  soybean: '/src/assets/images/soybean_leaf_sample_1791436289725.jpg',
  tomato: '/src/assets/images/tomato_leaf_blight_1791434006717.jpg',
  potato: '/src/assets/images/potato_leaf_blight_1791434019668.jpg',
  chilli: '/src/assets/images/chilli_leaf_healthy_1791434035118.jpg',
  farmBackdrop: '/src/assets/images/farm_cta_backdrop_1791434046244.jpg',
};

// Dynamic date helper: Guaranteed NEVER to produce future dates
export function formatPastDate(daysAgo: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.max(0, daysAgo));
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getCurrentDateStr(): string {
  return formatPastDate(0);
}

export function getCurrentTimestampStr(): string {
  const d = new Date();
  const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dateStr}, ${timeStr}`;
}

// Strict validator to ensure no future dates ever leak into the UI
export function isFutureDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return parsed > today.getTime();
  }
  
  // Parse format like "12 Oct 2026"
  const match = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthStr = match[2].toLowerCase();
    const year = parseInt(match[3], 10);
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIdx = months.indexOf(monthStr);
    if (monthIdx !== -1) {
      const d = new Date(year, monthIdx, day, 23, 59, 59);
      return d.getTime() > today.getTime();
    }
  }
  return false;
}

export function sanitizeAndSortScans(scans: ScanResult[]): ScanResult[] {
  return scans
    .filter((s) => !isFutureDate(s.date))
    .sort((a, b) => {
      const da = Date.parse(a.date) || 0;
      const db = Date.parse(b.date) || 0;
      return db - da; // Newest first
    });
}

// Official Supported Crops and their Crop-Specific Diseases
export const SUPPORTED_CROPS = [
  { id: 'Soybean', name: 'Soybean', hindi: 'सोयाबीन', icon: '🌱' },
  { id: 'Tomato', name: 'Tomato', hindi: 'टमाटर', icon: '🍅' },
  { id: 'Potato', name: 'Potato', hindi: 'आलू', icon: '🥔' },
  { id: 'Chilli', name: 'Chilli', hindi: 'मिर्च', icon: '🌶️' },
  { id: 'Cotton', name: 'Cotton', hindi: 'कपास', icon: '🌾' },
  { id: 'Maize', name: 'Maize', hindi: 'मक्का', icon: '🌽' },
  { id: 'Wheat', name: 'Wheat', hindi: 'गेहूं', icon: '🌾' },
  { id: 'Rice', name: 'Rice', hindi: 'धान', icon: '🌾' }
];

export const INITIAL_SCANS: ScanResult[] = [
  {
    id: 'scan-soybean-01',
    date: formatPastDate(0), // Today (e.g. 8 Oct 2026)
    timestamp: `${formatPastDate(0)}, 10:15 AM`,
    crop: 'Soybean',
    cropIcon: '🌱',
    disease: 'Frogeye Leaf Spot',
    farmerConditionName: 'Patte par bhure daag (Leaf Spot)',
    status: 'Diseased',
    confidence: 93,
    severity: 'Medium',
    severityExplanation: 'Patte ka noticeable hissa affected dikh raha hai.',
    affectedArea: 18,
    riskLevel: 'Moderate',
    imageUrl: SAMPLE_IMAGES.soybean,
    kyaHoRahaHai: 'AI ke analysis ke according is soybean ke patte par fungal rog ke lakshan dikh rahe hain. Agar dhyan nahi diya gaya to ye paas ke paudhon tak fail sakta hai.',
    patteMeinKyaDikhRahaHai: 'Patte par chhote gol bhure daag aur peele ghere dikh rahe hain jo soybean ki fashal mein aam tor par aate hain.',
    abhiKyaKarein: [
      'Zyada kharab pattiyon ko tod kar khet se door phenkein.',
      'Dhyan dein ki patte lambe samay tak geele na rahein.',
      'Khet mein hawa ka aana-jaana accha banayein.',
      'Paas ke soybean paudhon par bhi regular nazar rakhein.'
    ],
    kaiseFailneSeRokein: [
      'Sinchaai karte waqt upar se paani na chhidkein, drip ka use karein.',
      'Agli baar bimari-mukt certified beej ka hi chayan karein.',
      'Khet ki medhon aur aas-paas kharpatwar saaf rakhein.'
    ],
    symptomExplanation: 'Patte par chhote gol bhure daag aur peele ghere dikh rahe hain jo fungal infection ke sanket hain.',
    immediateActions: [
      'Kharab pattiyon ko khet se door hatayein.',
      'Patte par zyada nami na jamne dein.',
      'Aas-paas ke paudhon ki jaanch karein.'
    ],
    organicOptions: [
      'Neem tel (0.5%) ka chhidkaw subah ya shaam karein (label ke anusaar).',
      'Bio-fungicide (Trichoderma ya Bacillus) ka upyog karein.',
      'Paudhon ke beech acchi hawa aane dein.'
    ],
    chemicalCategory: {
      category: 'Recommended Fungicide Category (Foliar Protectant)',
      examples: 'Carbendazim ya Mancozeb category (label instructions follow karein)',
      instructions: 'Is rog ke liye recommended category ka use karein aur product ke label par diye instructions follow karein. Khud se koi dosage tay na karein.'
    },
    preventionTips: [
      'Fasal chakra (crop rotation) apnayein.',
      'Khet mein paani jama na hone dein.',
      'Pramanit beejon ka hi chayan karein.'
    ],
    expertHelpTips: [
      'Agar daag 3 se 4 dino mein bahut tezi se badhein.',
      'Agar tano ya phaliyon par bhi nishaan dikhein.',
      'Sahi regional chemical dawa ke liye Krishi Vigyan Kendra se sampark karein.'
    ],
    attentionPoints: [
      { x: 42, y: 38, radius: 18, intensity: 0.92 },
      { x: 58, y: 56, radius: 22, intensity: 0.95 },
      { x: 36, y: 65, radius: 15, intensity: 0.85 }
    ],
    fieldPlot: 'Plot A - Sector 1',
    isValidCrop: true,
    validationStatus: 'valid',
    technicalDiseaseName: 'Cercospora sojina Hara',
    verifiedTreatment: VERIFIED_TREATMENT_DATABASE['Soybean']['Frogeye Leaf Spot'],
    source: VERIFIED_TREATMENT_DATABASE['Soybean']['Frogeye Leaf Spot'].source,
    sourceUrl: VERIFIED_TREATMENT_DATABASE['Soybean']['Frogeye Leaf Spot'].sourceUrl,
    lastVerifiedDate: VERIFIED_TREATMENT_DATABASE['Soybean']['Frogeye Leaf Spot'].lastVerifiedDate
  },
  {
    id: 'scan-tomato-01',
    date: formatPastDate(2), // 2 days ago
    timestamp: `${formatPastDate(2)}, 02:40 PM`,
    crop: 'Tomato',
    cropIcon: '🍅',
    disease: 'Early Blight',
    farmerConditionName: 'Patte par peele aur bhure chakkatte',
    status: 'Diseased',
    confidence: 91,
    severity: 'Medium',
    severityExplanation: 'Patte ka noticeable hissa affected dikh raha hai.',
    affectedArea: 16,
    riskLevel: 'Moderate',
    imageUrl: SAMPLE_IMAGES.tomato,
    kyaHoRahaHai: 'AI ke analysis ke according tomato ke patte par gol chakkatte dikh rahe hain jo aam fungal rog ke sanket hain.',
    patteMeinKyaDikhRahaHai: 'Patte par gol bhure nishaan aur peeli borders saaf dikh rahi hain.',
    abhiKyaKarein: [
      'Kharab pattiya tod kar khet se door dalein.',
      'Paani zameen par dein, pattiyon par na chhidkein.',
      'Aas-paas ke tomato paudhon ko monitor karein.'
    ],
    kaiseFailneSeRokein: [
      'Paudhon ke beech 50-60 cm ki doori rakhein.',
      'Khet mein acche hawa-paani ka nikas rakhein.'
    ],
    symptomExplanation: 'Dark circular spots with chlorotic yellow borders visible on leaf blade.',
    immediateActions: [
      'Remove heavily affected leaves promptly.',
      'Improve air circulation around plant canopy.'
    ],
    organicOptions: [
      'Neem oil spray (product label ke anusaar).',
      'Bio-fungicide formulation.'
    ],
    chemicalCategory: {
      category: 'Suitable Protectant Fungicide Category',
      examples: 'Mancozeb or Copper hydroxide category',
      instructions: 'Product ke label instructions strictly follow karein.'
    },
    preventionTips: ['Disease-free seedlings ka use karein.'],
    expertHelpTips: ['Agar 5 din baad bhi sudhaar na ho.'],
    attentionPoints: [
      { x: 44, y: 36, radius: 16, intensity: 0.92 },
      { x: 56, y: 54, radius: 20, intensity: 0.95 }
    ],
    fieldPlot: 'Plot B - North Valley',
    isValidCrop: true,
    validationStatus: 'valid',
    technicalDiseaseName: 'Alternaria solani',
    verifiedTreatment: VERIFIED_TREATMENT_DATABASE['Tomato']['Early Blight'],
    source: VERIFIED_TREATMENT_DATABASE['Tomato']['Early Blight'].source,
    sourceUrl: VERIFIED_TREATMENT_DATABASE['Tomato']['Early Blight'].sourceUrl,
    lastVerifiedDate: VERIFIED_TREATMENT_DATABASE['Tomato']['Early Blight'].lastVerifiedDate
  },
  {
    id: 'scan-chilli-01',
    date: formatPastDate(4), // 4 days ago
    timestamp: `${formatPastDate(4)}, 11:20 AM`,
    crop: 'Chilli',
    cropIcon: '🌶️',
    disease: 'Healthy',
    farmerConditionName: 'Swasth Patta (Koi rog nahi)',
    status: 'Healthy',
    confidence: 96,
    severity: 'Low',
    severityExplanation: 'Patta poori tarah swasth aur hara dikh raha hai.',
    affectedArea: 0,
    riskLevel: 'Low',
    imageUrl: SAMPLE_IMAGES.chilli,
    kyaHoRahaHai: 'Patta swasth hai aur chlorophyll ki matra bilkul normal hai. Koi rog ke lakshan nahi hain.',
    patteMeinKyaDikhRahaHai: 'Patte par chamakdar hari satah aur swasth nashein dikh rahi hain.',
    abhiKyaKarein: [
      'Khet ki normal dekhbhal jaari rakhein.',
      'Samay par santulit khad aur pani dein.'
    ],
    kaiseFailneSeRokein: [
      'Keede (thrips, aphids) se bachav ke liye yellow sticky traps lagayein.'
    ],
    symptomExplanation: 'Uniform green foliage with intact cuticle and zero necrosis.',
    immediateActions: ['Continue standard routine scouting.'],
    organicOptions: ['Seaweed tonic spray for vigor.'],
    chemicalCategory: {
      category: 'No chemical intervention required',
      examples: 'Nutritional foliar micro-nutrients only',
      instructions: 'Chemical spray ki zaroorat nahi hai.'
    },
    preventionTips: ['Inspect leaf undersides regularly.'],
    expertHelpTips: ['Agar patte mudne lagein.'],
    attentionPoints: [{ x: 50, y: 50, radius: 8, intensity: 0.1 }],
    fieldPlot: 'Plot C - South Terraces',
    isValidCrop: true,
    validationStatus: 'valid',
    technicalDiseaseName: 'Normal Capsicum annuum',
    verifiedTreatment: VERIFIED_TREATMENT_DATABASE['Chilli']['Healthy'],
    source: VERIFIED_TREATMENT_DATABASE['Chilli']['Healthy'].source,
    sourceUrl: VERIFIED_TREATMENT_DATABASE['Chilli']['Healthy'].sourceUrl,
    lastVerifiedDate: VERIFIED_TREATMENT_DATABASE['Chilli']['Healthy'].lastVerifiedDate
  },
  {
    id: 'scan-potato-01',
    date: formatPastDate(7), // 7 days ago
    timestamp: `${formatPastDate(7)}, 09:45 AM`,
    crop: 'Potato',
    cropIcon: '🥔',
    disease: 'Late Blight',
    farmerConditionName: 'Patte par kaale geelapan wale daag',
    status: 'Diseased',
    confidence: 94,
    severity: 'High',
    severityExplanation: 'Patte ka bada hissa affected dikh raha hai.',
    affectedArea: 38,
    riskLevel: 'Critical',
    imageUrl: SAMPLE_IMAGES.potato,
    kyaHoRahaHai: 'Aaloo ke patte par tezi se failne wale kaale daag dikh rahe hain jo geelapan ke dauran aate hain.',
    patteMeinKyaDikhRahaHai: 'Patte ke kinaro par kaale gile dhabbe aur patta sukhta hua dikh raha hai.',
    abhiKyaKarein: [
      'Bimari wale paudhon ko turant alag karein.',
      'Sinchaai turant rokein taaki nami kam ho.',
      'Krishi expert se emergency dawai ki salah lein.'
    ],
    kaiseFailneSeRokein: [
      'Bimari-grast pattiyon ko mitti mein na dabayein, khet se door destroy karein.'
    ],
    symptomExplanation: 'Water-soaked expanding necrotic lesions on leaf margins.',
    immediateActions: ['Quarantine affected haulms immediately.'],
    organicOptions: ['Copper bio-fungicide barrier.'],
    chemicalCategory: {
      category: 'Anti-Oomycete Systemic Fungicide Category',
      examples: 'Cymoxanil or Metalaxyl category',
      instructions: 'Label instructions strictly follow karein.'
    },
    preventionTips: ['Plant certified disease-free tubers.'],
    expertHelpTips: ['Emergency blight warnings par expert se consult karein.'],
    attentionPoints: [
      { x: 40, y: 45, radius: 22, intensity: 0.95 },
      { x: 62, y: 55, radius: 24, intensity: 0.9 }
    ],
    fieldPlot: 'Plot D - West Acre',
    isValidCrop: true,
    validationStatus: 'valid',
    technicalDiseaseName: 'Phytophthora infestans (Mont.) de Bary',
    verifiedTreatment: VERIFIED_TREATMENT_DATABASE['Potato']['Late Blight'],
    source: VERIFIED_TREATMENT_DATABASE['Potato']['Late Blight'].source,
    sourceUrl: VERIFIED_TREATMENT_DATABASE['Potato']['Late Blight'].sourceUrl,
    lastVerifiedDate: VERIFIED_TREATMENT_DATABASE['Potato']['Late Blight'].lastVerifiedDate
  }
];

export const PROGRESSION_TIMELINE = [
  { date: formatPastDate(6).slice(0, 6), label: formatPastDate(6), affectedArea: 5, severity: 'Low', scanId: 'prog-1', note: 'Shuruaati chhota dhabba' },
  { date: formatPastDate(4).slice(0, 6), label: formatPastDate(4), affectedArea: 12, severity: 'Low', scanId: 'prog-2', note: 'Dhabbe thode badhe' },
  { date: formatPastDate(2).slice(0, 6), label: formatPastDate(2), affectedArea: 22, severity: 'Medium', scanId: 'prog-3', note: 'Peele ghere banne lage' },
  { date: formatPastDate(0).slice(0, 6), label: formatPastDate(0), affectedArea: 38, severity: 'High', scanId: 'prog-4', note: 'Patti par bada daag fail gaya' },
];

export const FARM_PLOTS: FarmPlot[] = [
  {
    id: 'plot-a',
    name: 'Plot A - Sector 1',
    crop: 'Soybean',
    areaAcres: 16,
    status: 'Monitor',
    affectedPercentage: 18,
    lastScanDate: formatPastDate(0),
    soilMoisture: 65,
    canopyTemp: 27.2,
    coordinates: { row: 0, col: 0 }
  },
  {
    id: 'plot-b',
    name: 'Plot B - North Valley',
    crop: 'Tomato',
    areaAcres: 12,
    status: 'Monitor',
    affectedPercentage: 16,
    lastScanDate: formatPastDate(2),
    soilMoisture: 64,
    canopyTemp: 27.5,
    coordinates: { row: 0, col: 1 }
  },
  {
    id: 'plot-c',
    name: 'Plot C - South Terraces',
    crop: 'Chilli',
    areaAcres: 8,
    status: 'Healthy',
    affectedPercentage: 0,
    lastScanDate: formatPastDate(4),
    soilMoisture: 70,
    canopyTemp: 26.8,
    coordinates: { row: 1, col: 0 }
  },
  {
    id: 'plot-d',
    name: 'Plot D - West Acre',
    crop: 'Potato',
    areaAcres: 15,
    status: 'Critical',
    affectedPercentage: 38,
    lastScanDate: formatPastDate(7),
    soilMoisture: 58,
    canopyTemp: 29.1,
    coordinates: { row: 1, col: 1 }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Soybean monitoring alert',
    message: 'Soybean field (Plot A) par Leaf Spot lakshan dikhe hain. 4 din baad re-scan karein.',
    type: 'warning',
    timestamp: 'Aaj subah',
    read: false,
    scanId: 'scan-soybean-01'
  },
  {
    id: 'notif-2',
    title: 'High severity detected',
    message: 'Potato field (Plot D - West Acre) par tezi se daag badhe hain. Dhyan dein.',
    type: 'danger',
    timestamp: '1 din pehle',
    read: false,
    scanId: 'scan-potato-01'
  },
  {
    id: 'notif-3',
    title: 'Healthy crop update',
    message: 'Chilli crop (Plot C) bilkul swasth aur hari hai.',
    type: 'success',
    timestamp: '4 din pehle',
    read: true,
    scanId: 'scan-chilli-01'
  }
];

export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  name: 'Ramesh Patel',
  farmName: 'Green Valley Agrotech',
  location: 'Nashik Agro-Corridor, Block 4',
  totalAcres: 45,
  primaryCrops: ['Soybean', 'Tomato', 'Potato', 'Chilli'],
  phone: '+91 98230 45671',
  email: 'ramesh.greenvalley@agromail.com'
};
