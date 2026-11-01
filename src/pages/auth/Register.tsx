import { Link, useNavigate } from 'react-router-dom'
import { App, Button, Form, Input, Select, TimePicker } from 'antd'
import AuthLayout from '../../layouts/AuthLayout'
import RoleSwitch from '../../components/auth/RoleSwitch'
import { useRoleParam } from '../../hooks/useRoleParam'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { registerStudent, registerTeacher } from '../../store/slices/authSlice'
import { GRADE_OPTIONS, ROLE_LABELS, ROUTES } from '../../constants'
import {
  PASSWORD_MIN_LENGTH,
  cityRules,
  confirmPasswordRules,
  emailRules,
  fullNameRules,
  gradeRules,
  lessonTimeRules,
  normalizePhone,
  parentNameRules,
  passwordRules,
  phoneRules,
  positionRules,
} from '../../utils/validation'
import { applyServerErrors } from '../../utils/formErrors'
import type { ApiError } from '../../types/api'
import type {
  RegisterFormValues,
  StudentRegisterFormValues,
  StudentRegisterRequest,
  TeacherRegisterFormValues,
  TeacherRegisterRequest,
  UserRole,
} from '../../types/auth'

const SIDE_CONTENT: Record<UserRole, { title: string; description: string; steps: string[] }> = {
  student: {
    title: 'Şagird hesabı yaradın',
    description: 'Bir neçə məlumat — və dərs cədvəliniz, müəllimləriniz, profiliniz hazırdır.',
    steps: ['Şəxsi və valideyn məlumatları', 'Sinif və dərs vaxtı', 'Giriş üçün email və şifrə'],
  },
  teacher: {
    title: 'Müəllim hesabı yaradın',
    description: 'Qeydiyyatdan sonra şagird siyahısını və dərs saatlarını paneldən idarə edəcəksiniz.',
    steps: ['Şəxsi məlumatlar', 'Vəzifə və əlaqə', 'Giriş üçün email və şifrə'],
  },
}

const PLACEHOLDERS: Record<UserRole, { fullName: string; phone: string; email: string }> = {
  student: { fullName: 'Aysel Mammadova', phone: '+994501234567', email: 'aysel@example.com' },
  teacher: { fullName: 'Rəşad Məmmədli', phone: '+994501112233', email: 'rashad@example.com' },
}

// API sahə adı -> forma sahə adı (server xətalarını düzgün sahədə göstərmək üçün)
const FIELD_MAP: Record<string, string> = {
  name: 'fullName',
  parent_name: 'parentName',
  city: 'city',
  phone: 'phone',
  email: 'email',
  grade: 'grade',
  time: 'lessonTime',
  position: 'position',
  password: 'password',
  password_confirmation: 'confirmPassword',
}

/* ---------- Form dəyərləri -> API request ---------- */

const toStudentRequest = (values: StudentRegisterFormValues): StudentRegisterRequest => ({
  name: values.fullName.trim(),
  time: values.lessonTime.format('HH:mm'),
  parent_name: values.parentName.trim(),
  city: values.city.trim(),
  phone: values.phone,
  email: values.email.trim(),
  grade: String(values.grade),
  password: values.password,
  password_confirmation: values.confirmPassword,
})

const toTeacherRequest = (values: TeacherRegisterFormValues): TeacherRegisterRequest => ({
  name: values.fullName.trim(),
  position: values.position.trim(),
  phone: values.phone,
  email: values.email.trim(),
  password: values.password,
  password_confirmation: values.confirmPassword,
})

const Register = () => {
  const [role, setRole] = useRoleParam()
  const [form] = Form.useForm<RegisterFormValues>()
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.auth.loading)
  const navigate = useNavigate()

  const isStudent = role === 'student'
  const placeholders = PLACEHOLDERS[role]

  const handleRoleChange = (next: UserRole) => {
    setRole(next)
    form.resetFields()
  }

  const handleFinish = async (values: RegisterFormValues) => {
    try {
      const user = isStudent
        ? await dispatch(registerStudent(toStudentRequest(values as StudentRegisterFormValues))).unwrap()
        : await dispatch(registerTeacher(toTeacherRequest(values as TeacherRegisterFormValues))).unwrap()

      message.success('Qeydiyyat uğurla tamamlandı. İndi daxil ola bilərsiniz.')
      navigate(`${ROUTES.login}?role=${role}`, { state: { email: user.email } })
    } catch (err) {
      const error = err as ApiError
      if (!applyServerErrors(form, error.errors, FIELD_MAP)) {
        message.error(error.message)
      }
    }
  }

  // Sahələr — dizayndakı ardıcıllıqla
  const fullNameField = (
    <Form.Item name="fullName" label="Ad, soyad" rules={fullNameRules} className="sm:col-span-2">
      <Input placeholder={placeholders.fullName} autoComplete="name" />
    </Form.Item>
  )

  const parentNameField = (
    <Form.Item name="parentName" label="Valideynin adı" rules={parentNameRules}>
      <Input placeholder="Leyla Mammadova" />
    </Form.Item>
  )

  const cityField = (
    <Form.Item name="city" label="Şəhər" rules={cityRules}>
      <Input placeholder="Baku" autoComplete="address-level2" />
    </Form.Item>
  )

  const positionField = (
    <Form.Item name="position" label="Vəzifə" rules={positionRules}>
      <Input placeholder="Riyaziyyat müəllimi" autoComplete="organization-title" />
    </Form.Item>
  )

  const phoneField = (
    <Form.Item
      name="phone"
      label="Telefon"
      rules={phoneRules}
      normalize={normalizePhone}
      validateTrigger="onBlur"
    >
      <Input placeholder={placeholders.phone} maxLength={13} inputMode="tel" autoComplete="tel" />
    </Form.Item>
  )

  const emailField = (
    <Form.Item
      name="email"
      label="Email"
      rules={emailRules}
      validateTrigger="onBlur"
      className={isStudent ? '' : 'sm:col-span-2'}
    >
      <Input placeholder={placeholders.email} autoComplete="email" />
    </Form.Item>
  )

  const gradeField = (
    <Form.Item name="grade" label="Sinif" rules={gradeRules}>
      <Select placeholder="Sinif seçin" options={GRADE_OPTIONS} />
    </Form.Item>
  )

  const lessonTimeField = (
    <Form.Item name="lessonTime" label="Dərs vaxtı" rules={lessonTimeRules}>
      <TimePicker format="HH:mm" minuteStep={5} placeholder="--:--" className="w-full" needConfirm={false} />
    </Form.Item>
  )

  const passwordField = (
    <Form.Item name="password" label="Şifrə" rules={passwordRules}>
      <Input.Password placeholder={`Minimum ${PASSWORD_MIN_LENGTH} simvol`} autoComplete="new-password" />
    </Form.Item>
  )

  const confirmPasswordField = (
    <Form.Item
      name="confirmPassword"
      label="Şifrənin təkrarı"
      dependencies={['password']}
      rules={confirmPasswordRules()}
    >
      <Input.Password placeholder="Şifrəni təkrar yazın" autoComplete="new-password" />
    </Form.Item>
  )

  return (
    <AuthLayout
      title={SIDE_CONTENT[role].title}
      description={SIDE_CONTENT[role].description}
      listType="steps"
      items={SIDE_CONTENT[role].steps}
    >
      <div className="w-full max-w-[608px] rounded-2xl border border-gray-200 bg-white p-6 sm:p-9">
        <div className="mb-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[26px] font-bold text-gray-900">{ROLE_LABELS[role]} qeydiyyatı</h2>
            <p className="mt-1 text-[15px] text-gray-500">Bütün xanalar məcburidir.</p>
          </div>
          <RoleSwitch value={role} onChange={handleRoleChange} />
        </div>

        <Form<RegisterFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
          size="large"
          scrollToFirstError
        >
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            {fullNameField}
            {isStudent ? (
              <>
                {parentNameField}
                {cityField}
                {phoneField}
                {emailField}
                {gradeField}
                {lessonTimeField}
              </>
            ) : (
              <>
                {positionField}
                {phoneField}
                {emailField}
              </>
            )}
            {passwordField}
            {confirmPasswordField}
          </div>

          <Button type="primary" htmlType="submit" block loading={loading} className="mt-2">
            Qeydiyyatdan keç
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Artıq hesabın var?{' '}
          <Link to={`${ROUTES.login}?role=${role}`} className="font-semibold">
            Daxil ol
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register
