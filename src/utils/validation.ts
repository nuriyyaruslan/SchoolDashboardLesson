import type { FormRule } from 'antd'

/* ---------- Regex-lər ---------- */

// Azərbaycan və latın hərfləri, boşluq, defis və apostrof
const NAME_REGEX = /^[A-Za-zÇçƏəĞğIıİiÖöŞşÜü' -]+$/
// Ən azı iki söz: "Ad Soyad"
const FULL_NAME_REGEX = /^\S+(\s+\S+)+$/
// +994 + operator kodu + 7 rəqəm. Məs: +994501234567
const PHONE_REGEX = /^\+994(10|12|50|51|55|60|70|77|99)\d{7}$/
// Ən azı bir böyük hərf, bir kiçik hərf və bir rəqəm
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export const PASSWORD_MIN_LENGTH = 8

/* ---------- Ümumi qaydalar ---------- */

export const emailRules: FormRule[] = [
  { required: true, message: 'Email daxil edin' },
  { type: 'email', message: 'Email düzgün formatda deyil' },
  { max: 100, message: 'Email ən çox 100 simvol ola bilər' },
]

// Login zamanı şifrəyə yalnız "boş olmasın" yoxlaması kifayətdir
export const loginPasswordRules: FormRule[] = [
  { required: true, message: 'Şifrəni daxil edin' },
]

export const passwordRules: FormRule[] = [
  { required: true, message: 'Şifrəni daxil edin' },
  { min: PASSWORD_MIN_LENGTH, message: `Şifrə minimum ${PASSWORD_MIN_LENGTH} simvol olmalıdır` },
  { max: 64, message: 'Şifrə ən çox 64 simvol ola bilər' },
  {
    pattern: PASSWORD_REGEX,
    message: 'Şifrədə ən azı 1 böyük hərf, 1 kiçik hərf və 1 rəqəm olmalıdır',
  },
]

// Şifrənin təkrarı "password" sahəsi ilə eyni olmalıdır
export const confirmPasswordRules = (passwordField = 'password'): FormRule[] => [
  { required: true, message: 'Şifrəni təkrar daxil edin' },
  ({ getFieldValue }) => ({
    validator(_, value: string | undefined) {
      if (!value || getFieldValue(passwordField) === value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('Şifrələr eyni deyil'))
    },
  }),
]

const nameRules = (label: string): FormRule[] => [
  { required: true, whitespace: true, message: `${label} daxil edin` },
  { min: 3, message: `${label} minimum 3 simvol olmalıdır` },
  { max: 60, message: `${label} ən çox 60 simvol ola bilər` },
  { pattern: NAME_REGEX, message: `${label} yalnız hərflərdən ibarət olmalıdır` },
  { pattern: FULL_NAME_REGEX, message: 'Ad və soyadı boşluqla ayıraraq yazın' },
]

export const fullNameRules: FormRule[] = nameRules('Ad, soyad')

export const parentNameRules: FormRule[] = nameRules('Valideynin adı')

export const cityRules: FormRule[] = [
  { required: true, whitespace: true, message: 'Şəhəri daxil edin' },
  { min: 2, message: 'Şəhər adı minimum 2 simvol olmalıdır' },
  { max: 40, message: 'Şəhər adı ən çox 40 simvol ola bilər' },
  { pattern: NAME_REGEX, message: 'Şəhər adı yalnız hərflərdən ibarət olmalıdır' },
]

export const positionRules: FormRule[] = [
  { required: true, whitespace: true, message: 'Vəzifəni daxil edin' },
  { min: 2, message: 'Vəzifə minimum 2 simvol olmalıdır' },
  { max: 60, message: 'Vəzifə ən çox 60 simvol ola bilər' },
]

export const phoneRules: FormRule[] = [
  { required: true, message: 'Telefon nömrəsini daxil edin' },
  { pattern: PHONE_REGEX, message: 'Format: +994XXXXXXXXX (məs: +994501234567)' },
]

export const gradeRules: FormRule[] = [
  { required: true, message: 'Sinif seçin' },
]

export const lessonTimeRules: FormRule[] = [
  { required: true, message: 'Dərs vaxtını seçin' },
]

/* ---------- Input normalizasiyası ---------- */

// Telefon sahəsində yalnız "+" və rəqəmlərə icazə veririk
export const normalizePhone = (value: string): string => {
  const cleaned = value.replace(/[^\d+]/g, '')
  return cleaned.startsWith('+') ? '+' + cleaned.slice(1).replace(/\+/g, '') : cleaned.replace(/\+/g, '')
}

// Redaktə zamanı şifrə boş qala bilər — doldurulubsa adi qaydalar tətbiq olunur
export const optionalPasswordRules: FormRule[] = passwordRules.filter(
  (rule) => !(typeof rule === 'object' && 'required' in rule),
)
