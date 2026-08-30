// Greek Sign Language (GSL / Ελληνική Νοηματική Γλώσσα) Alphabet & Word Dictionary

export interface GslLetter {
  index: number
  letter: string
  name: string
  enName: string
  sound: string
  description: string
  fingersTip: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const GSL_ALPHABET: GslLetter[] = [
  { index: 1, letter: 'Α', name: 'Άλφα', enName: 'Alpha', sound: 'a', description: 'Κλειστή γροθιά με τον αντίχειρα όρθιο στο πλάι.', fingersTip: 'Fist with thumb alongside index finger pointing up', difficulty: 'easy' },
  { index: 2, letter: 'Β', name: 'Βήτα', enName: 'Beta', sound: 'v', description: '4 δάχτυλα όρθια και ενωμένα, αντίχειρας διπλωμένος στην παλάμη.', fingersTip: 'Four fingers up and together, thumb across palm', difficulty: 'easy' },
  { index: 3, letter: 'Γ', name: 'Γάμμα', enName: 'Gamma', sound: 'gh', description: 'Δείκτης και αντίχειρας σχηματίζουν ορθή γωνία (σχήμα Γ).', fingersTip: 'Index and thumb at right angle pointing down/forward', difficulty: 'easy' },
  { index: 4, letter: 'Δ', name: 'Δέλτα', enName: 'Delta', sound: 'dh', description: 'Δείκτης όρθιος, υπόλοιπα δάχτυλα ακουμπούν τον αντίχειρα σε κύκλο.', fingersTip: 'Index pointing straight up, other fingers touch thumb tip', difficulty: 'medium' },
  { index: 5, letter: 'Ε', name: 'Έψιλον', enName: 'Epsilon', sound: 'e', description: 'Όλα τα δάχτυλα λυγισμένα με τα νύχια να ακουμπούν τον αντίχειρα.', fingersTip: 'All fingers curved tightly, resting on thumb', difficulty: 'medium' },
  { index: 6, letter: 'Ζ', name: 'Ζήτα', enName: 'Zeta', sound: 'z', description: 'Δείκτης προτεταμένος σχηματίζει νοητά ένα ζικ-ζακ Ζ στον αέρα.', fingersTip: 'Index finger extended tracing the Z pattern', difficulty: 'easy' },
  { index: 7, letter: 'Η', name: 'Ήτα', enName: 'Eta', sound: 'i', description: 'Δείκτης και μέσος όρθιοι και ενωμένοι οριζόντια/μπροστά.', fingersTip: 'Index and middle finger extended together horizontally', difficulty: 'easy' },
  { index: 8, letter: 'Θ', name: 'Θήτα', enName: 'Theta', sound: 'th', description: 'Όλα τα δάχτυλα σχηματίζουν κύκλο, ο αντίχειρας μπαίνει ανάμεσα σε δείκτη & μέσο.', fingersTip: 'Hand formed in oval shape with thumb between fingers', difficulty: 'hard' },
  { index: 9, letter: 'Ι', name: 'Γιώτα', enName: 'Iota', sound: 'i', description: 'Μικρό δαχτυλάκι (μικρό) όρθιο, υπόλοιπα δάχτυλα σε γροθιά.', fingersTip: 'Pinky finger straight up, all other fingers closed', difficulty: 'easy' },
  { index: 10, letter: 'Κ', name: 'Κάππα', enName: 'Kappa', sound: 'k', description: 'Δείκτης και μέσος όρθιοι ανοιχτοί (σχήμα V), αντίχειρας ανάμεσά τους.', fingersTip: 'Index up, middle forward, thumb supporting middle finger', difficulty: 'medium' },
  { index: 11, letter: 'Λ', name: 'Λάμδα', enName: 'Lambda', sound: 'l', description: 'Δείκτης και αντίχειρας ανοιχτοί σε σχήμα L (ή Λ).', fingersTip: 'Thumb and index finger open wide forming an L/Lambda', difficulty: 'easy' },
  { index: 12, letter: 'Μ', name: 'Μι', enName: 'Mu', sound: 'm', description: 'Τρία δάχτυλα διπλωμένα πάνω από τον αντίχειρα.', fingersTip: 'Thumb tucked under three folded fingers', difficulty: 'medium' },
  { index: 13, letter: 'Ν', name: 'Νι', enName: 'Nu', sound: 'n', description: 'Δύο δάχτυλα διπλωμένα πάνω από τον αντίχειρα.', fingersTip: 'Thumb tucked under two folded fingers', difficulty: 'medium' },
  { index: 14, letter: 'Ξ', name: 'Ξι', enName: 'Xi', sound: 'x', description: 'Δείκτης λυγισμένος σε σχήμα γάντζου.', fingersTip: 'Index finger hooked/curved forward like a hook', difficulty: 'medium' },
  { index: 15, letter: 'Ο', name: 'Όμικρον', enName: 'Omicron', sound: 'o', description: 'Όλα τα δάχτυλα καμπυλωμένα ακουμπούν τον αντίχειρα σχηματίζοντας Ο.', fingersTip: 'All fingers curved to touch thumb forming a round O', difficulty: 'easy' },
  { index: 16, letter: 'Π', name: 'Πι', enName: 'Pi', sound: 'p', description: 'Δείκτης και μέσος στραμμένοι προς τα κάτω (σαν πόδια Π).', fingersTip: 'Index and middle fingers pointing downwards like columns', difficulty: 'medium' },
  { index: 17, letter: 'Ρ', name: 'Ρο', enName: 'Rho', sound: 'r', description: 'Δείκτης και μέσος σταυρωμένοι όρθιοι (σταύρωμα δακτύλων).', fingersTip: 'Index and middle fingers crossed over each other', difficulty: 'medium' },
  { index: 18, letter: 'Σ', name: 'Σίγμα', enName: 'Sigma', sound: 's', description: 'Σφιχτή γροθιά με τον αντίχειρα διπλωμένο μπροστά από όλα τα δάχτυλα.', fingersTip: 'Tight fist with thumb folded across the front of fingers', difficulty: 'easy' },
  { index: 19, letter: 'Τ', name: 'Ταύ', enName: 'Tau', sound: 't', description: 'Αντίχειρας προεξέχει ανάμεσα στον δείκτη και τον μέσο σε γροθιά.', fingersTip: 'Thumb peeking out between index and middle fingers', difficulty: 'medium' },
  { index: 20, letter: 'Υ', name: 'Ύψιλον', enName: 'Upsilon', sound: 'y', description: 'Αντίχειρας και μικρό δαχτυλάκι ανοιχτά (σήμα shaka/κέρας).', fingersTip: 'Thumb and pinky finger extended out, middle fingers closed', difficulty: 'easy' },
  { index: 21, letter: 'Φ', name: 'Φι', enName: 'Phi', sound: 'f', description: 'Δείκτης και αντίχειρας σχηματίζουν κύκλο, υπόλοιπα 3 δάχτυλα όρθια.', fingersTip: 'Thumb and index circle (OK sign) with 3 fingers spread up', difficulty: 'medium' },
  { index: 22, letter: 'Χ', name: 'Χι', enName: 'Chi', sound: 'ch', description: 'Δείκτης ελαφρώς λυγισμένος οριζόντια.', fingersTip: 'Index finger partially bent horizontally', difficulty: 'medium' },
  { index: 23, letter: 'Ψ', name: 'Ψι', enName: 'Psi', sound: 'ps', description: 'Τρία μεσαία δάχτυλα όρθια και ανοιχτά (τρίαινα Ψ), αντίχειρας κρατά μικρό.', fingersTip: 'Three middle fingers straight up like a trident', difficulty: 'medium' },
  { index: 24, letter: 'Ω', name: 'Ωμέγα', enName: 'Omega', sound: 'o', description: 'Παλάμη ανοιχτή με τα δάχτυλα ελαφρώς καμπυλωμένα σε σχήμα καμάρας Ω.', fingersTip: 'Curved arch handshape forming the horseshoe shape of Omega', difficulty: 'hard' },
]

export interface GslWord {
  id: string
  word: string
  translationEn: string
  translationEl: string
  emoji: string
  level: 1 | 2 | 3 | 4
  hint: string
}

export const GSL_WORDS: GslWord[] = [
  // Level 1: 2-3 Letters
  { id: 'w1', word: 'ΓΗ', translationEn: 'Earth', translationEl: 'Γη', emoji: '🌍', level: 1, hint: 'Our home planet' },
  { id: 'w2', word: 'ΦΩΣ', translationEn: 'Light', translationEl: 'Φως', emoji: '💡', level: 1, hint: 'Illuminates the world' },
  { id: 'w3', word: 'ΖΩΗ', translationEn: 'Life', translationEl: 'Ζωή', emoji: '🌱', level: 1, hint: 'The gift of living' },
  { id: 'w4', word: 'ΝΟΥΣ', translationEn: 'Mind', translationEl: 'Νους', emoji: '🧠', level: 1, hint: 'Thought & intellect' },
  { id: 'w5', word: 'ΕΝΑ', translationEn: 'One', translationEl: 'Ένα', emoji: '1️⃣', level: 1, hint: 'Number 1' },
  { id: 'w6', word: 'ΝΑΙ', translationEn: 'Yes', translationEl: 'Ναι', emoji: '✅', level: 1, hint: 'Affirmation' },

  // Level 2: 4 Letters
  { id: 'w7', word: 'ΝΕΡΟ', translationEn: 'Water', translationEl: 'Νερό', emoji: '💧', level: 2, hint: 'Essential for life' },
  { id: 'w8', word: 'ΗΛΙΟΣ', translationEn: 'Sun', translationEl: 'Ήλιος', emoji: '☀️', level: 2, hint: 'Shines bright in Greece' },
  { id: 'w9', word: 'ΣΠΙΤΙ', translationEn: 'Home', translationEl: 'Σπίτι', emoji: '🏠', level: 2, hint: 'Where the heart is' },
  { id: 'w10', word: 'ΨΩΜΙ', translationEn: 'Bread', translationEl: 'Ψωμί', emoji: '🍞', level: 2, hint: 'Daily staple food' },
  { id: 'w11', word: 'ΜΗΛΟ', translationEn: 'Apple', translationEl: 'Μήλο', emoji: '🍎', level: 2, hint: 'Crisp red fruit' },
  { id: 'w12', word: 'ΚΑΛΗ', translationEn: 'Good', translationEl: 'Καλή', emoji: '⭐', level: 2, hint: 'Positive & pleasant' },

  // Level 3: 5-6 Letters
  { id: 'w13', word: 'ΑΓΑΠΗ', translationEn: 'Love', translationEl: 'Αγάπη', emoji: '❤️', level: 3, hint: 'The greatest feeling' },
  { id: 'w14', word: 'ΕΛΠΙΔΑ', translationEn: 'Hope', translationEl: 'Ελπίδα', emoji: '🕊️', level: 3, hint: 'Belief in a brighter tomorrow' },
  { id: 'w15', word: 'ΕΛΛΑΔΑ', translationEn: 'Greece', translationEl: 'Ελλάδα', emoji: '🇬🇷', level: 3, hint: 'The land of blue and white' },
  { id: 'w16', word: 'ΕΙΡΗΝΗ', translationEn: 'Peace', translationEl: 'Ειρήνη', emoji: '✌️', level: 3, hint: 'Harmony without conflict' },
  { id: 'w17', word: 'ΘΑΛΑΣΣΑ', translationEn: 'Sea', translationEl: 'Θάλασσα', emoji: '🌊', level: 3, hint: 'The crystal Mediterranean waters' },
]

export const LETTER_TO_INDEX: Record<string, number> = {}
export const INDEX_TO_LETTER: Record<number, GslLetter> = {}

GSL_ALPHABET.forEach((item) => {
  LETTER_TO_INDEX[item.letter] = item.index
  INDEX_TO_LETTER[item.index] = item
})
