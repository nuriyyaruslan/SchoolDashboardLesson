import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, App, Button, Form, Input, Select, TimePicker } from 'antd'
import dayjs from 'dayjs'
import PageHeader from '../../components/common/PageHeader'
import ProfileSummaryCard from '../../components/common/ProfileSummaryCard'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout, setUser } from '../../store/slices/authSlice'
import { authService } from '../../services/authService'
import { teacherService } from '../../services/teacherService'
import { tokenStorage } from '../../utils/tokenStorage'
import { GRADE_OPTIONS, ROUTES } from '../../constants'
import { orDash } from '../../utils/format'
import { applyServerErrors } from '../../utils/formErrors'
import { toApiError } from '../../utils/apiError'
import {
  PASSWORD_MIN_LENGTH,
  confirmPasswordRules,
  emailRules,
  fullNameRules,
  loginPasswordRules,
  normalizePhone,
  passwordRules,
  phoneRules,
  positionRules,
} from '../../utils/validation'
import type { AuthUser, Teacher } from '../../types/auth'
import type { ChangePasswordFormValues, TeacherFormValues } from '../../types/management'

/* ---------- Ümumi bölmə qabı ---------- */

interface SectionProps {
  title: string
  description?: string
  footer?: ReactNode
  children: ReactNode
}

const Section = ({ title, description, footer, children }: SectionProps) => (
  <section className="rounded-2xl border border-gray-200 bg-white">
    <div className="border-b border-gray-100 px-6 py-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <div className="px-6 pt-5">{children}</div>
    {footer && <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">{footer}</div>}
  </section>
)

/* ---------- Şəxsi məlumatlar ---------- */

const TEACHER_FIELD_MAP: Record<string, keyof TeacherFormValues> = {
  name: 'fullName',
  position: 'position',
  phone: 'phone',
  email: 'email',
}

const toTeacherFormValues = (teacher: Teacher): Partial<TeacherFormValues> => ({
  fullName: teacher.name,
  position: teacher.position ?? undefined,
  phone: teacher.phone ?? undefined,
  email: teacher.email,
})

const TeacherInfoForm = ({ teacher }: { teacher: Teacher }) => {
  const [form] = Form.useForm<TeacherFormValues>()
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: TeacherFormValues) => {
    setSaving(true)
    try {
      const updated = await teacherService.update(teacher.id, {
        name: values.fullName.trim(),
        position: values.position.trim(),
        phone: values.phone,
        email: values.email.trim(),
      })
      dispatch(setUser({ role: 'teacher', data: updated }))
      message.success('Profil yeniləndi')
    } catch (err) {
      const error = toApiError(err)
      if (!applyServerErrors(form, error.errors, TEACHER_FIELD_MAP)) message.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form<TeacherFormValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={toTeacherFormValues(teacher)}
      onFinish={handleFinish}
      size="large"
    >
      <Section
        title="Şəxsi məlumatlar"
        description="Bu məlumatlar profilinizdə və cədvəllərdə göstərilir."
        footer={
          <>
            <Button onClick={() => form.resetFields()}>Ləğv et</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Yadda saxla
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item name="fullName" label="Ad, soyad" rules={fullNameRules}>
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item name="position" label="Vəzifə" rules={positionRules}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefon" rules={phoneRules} normalize={normalizePhone} validateTrigger="onBlur">
            <Input maxLength={13} inputMode="tel" autoComplete="tel" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={emailRules} validateTrigger="onBlur">
            <Input autoComplete="email" />
          </Form.Item>
        </div>
      </Section>
    </Form>
  )
}

// API şagirdə öz profilini dəyişməyə icazə vermir — sahələr yalnız oxunur
const StudentInfoForm = ({ user }: { user: Extract<AuthUser, { role: 'student' }> }) => {
  const student = user.data
  return (
    <Section title="Şəxsi məlumatlar" description="Bu məlumatlar profilinizdə və cədvəllərdə göstərilir.">
      <Alert
        type="info"
        showIcon
        className="mb-5"
        title="Məlumatlarınızı dəyişmək üçün müəlliminizə müraciət edin."
      />
      <Form layout="vertical" size="large" disabled>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Ad, soyad">
            <Input value={student.name} />
          </Form.Item>
          <Form.Item label="Valideynin adı">
            <Input value={orDash(student.parent_name)} />
          </Form.Item>
          <Form.Item label="Şəhər">
            <Input value={orDash(student.city)} />
          </Form.Item>
          <Form.Item label="Telefon">
            <Input value={orDash(student.phone)} />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={student.email} />
          </Form.Item>
          <Form.Item label="Sinif">
            <Select value={student.grade ? Number(student.grade) : undefined} options={GRADE_OPTIONS} />
          </Form.Item>
          <Form.Item label="Dərs vaxtı" className="sm:col-span-2">
            <TimePicker
              value={student.time ? dayjs(student.time, 'HH:mm') : undefined}
              format="HH:mm"
              className="w-full"
            />
          </Form.Item>
        </div>
      </Form>
    </Section>
  )
}

/* ---------- Şifrəni dəyiş (müəllim) ---------- */

const ChangePasswordForm = ({ teacher }: { teacher: Teacher }) => {
  const [form] = Form.useForm<ChangePasswordFormValues>()
  const { message } = App.useApp()
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: ChangePasswordFormValues) => {
    setSaving(true)
    try {
      // API hazırkı şifrəni yoxlamır, ona görə əvvəlcə onunla login edirik
      try {
        const response = await authService.teacherLogin({
          email: teacher.email,
          password: values.currentPassword,
        })
        tokenStorage.save(response, 'teacher')
      } catch {
        form.setFields([{ name: 'currentPassword', errors: ['Hazırkı şifrə yanlışdır'] }])
        return
      }

      // PUT bütün sahələri gözləyir — mövcud məlumatları da göndəririk ki, silinməsin
      await teacherService.update(teacher.id, {
        name: teacher.name,
        email: teacher.email,
        position: teacher.position,
        phone: teacher.phone,
        password: values.password,
      })
      form.resetFields()
      message.success('Şifrə yeniləndi')
    } catch (err) {
      const error = toApiError(err)
      if (!applyServerErrors(form, error.errors, { password: 'password' })) message.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form<ChangePasswordFormValues> form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} size="large">
      <Section
        title="Şifrəni dəyiş"
        footer={
          <Button htmlType="submit" loading={saving} className="border-gray-900 bg-gray-900 text-white hover:border-gray-800 hover:bg-gray-800 hover:text-white">
            Şifrəni yenilə
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
          <Form.Item name="currentPassword" label="Hazırkı şifrə" rules={loginPasswordRules}>
            <Input.Password placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>
          <Form.Item name="password" label="Yeni şifrə" rules={passwordRules}>
            <Input.Password placeholder={`Minimum ${PASSWORD_MIN_LENGTH} simvol`} autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Yeni şifrənin təkrarı"
            dependencies={['password']}
            rules={confirmPasswordRules()}
          >
            <Input.Password placeholder="Təkrar yazın" autoComplete="new-password" />
          </Form.Item>
        </div>
      </Section>
    </Form>
  )
}

/* ---------- Hesabı sil (müəllim) ---------- */

const DeleteAccount = ({ teacher }: { teacher: Teacher }) => {
  const { modal, message } = App.useApp()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDelete = () => {
    modal.confirm({
      title: 'Hesabı silmək istəyirsiniz?',
      content: 'Hesabınız və bütün məlumatlarınız birdəfəlik silinəcək. Bu əməliyyatı geri qaytarmaq olmur.',
      okText: 'Bəli, sil',
      cancelText: 'Ləğv et',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await teacherService.remove(teacher.id)
          dispatch(logout())
          message.success('Hesabınız silindi')
          navigate(ROUTES.login, { replace: true })
        } catch (err) {
          message.error(toApiError(err).message)
        }
      },
    })
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-red-700">Hesabı sil</h2>
        <p className="text-sm text-gray-500">Hesabınız və bütün məlumatlarınız birdəfəlik silinəcək.</p>
      </div>
      <Button danger size="large" onClick={handleDelete}>
        Hesabı sil
      </Button>
    </section>
  )
}

/* ---------- Səhifə ---------- */

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user) as AuthUser

  return (
    <>
      <PageHeader crumb="Profil" title="Profilim" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <ProfileSummaryCard user={user} />

        <div className="space-y-6">
          {user.role === 'teacher' ? (
            <>
              {/* key: profil yenilənəndə forma yeni dəyərlərlə qurulsun */}
              <TeacherInfoForm key={user.data.updated_at} teacher={user.data} />
              <ChangePasswordForm teacher={user.data} />
              <DeleteAccount teacher={user.data} />
            </>
          ) : (
            <StudentInfoForm user={user} />
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
