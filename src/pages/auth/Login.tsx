import { Link, useLocation, useNavigate } from 'react-router-dom'
import { App, Button, Checkbox, Form, Input } from 'antd'
import AuthLayout from '../../layouts/AuthLayout'
import RoleSwitch from '../../components/auth/RoleSwitch'
import { useRoleParam } from '../../hooks/useRoleParam'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login } from '../../store/slices/authSlice'
import { ROLE_LABELS, ROUTES } from '../../constants'
import { emailRules, loginPasswordRules } from '../../utils/validation'
import { applyServerErrors } from '../../utils/formErrors'
import type { ApiError } from '../../types/api'
import type { LoginFormValues, UserRole } from '../../types/auth'

const SIDE_CONTENT: Record<UserRole, { title: string; description: string }> = {
  student: {
    title: 'Şagirdlər və müəllimlər — bir paneldə.',
    description: 'Qeydiyyat, dərs vaxtları, valideyn əlaqələri və profil məlumatları üçün vahid idarəetmə.',
  },
  teacher: {
    title: 'Dərslərinizi və şagirdlərinizi bir yerdən idarə edin.',
    description: 'Şagird siyahısı, dərs saatları və valideyn əlaqələri həmişə əlinizin altında.',
  },
}

const EMAIL_PLACEHOLDER: Record<UserRole, string> = {
  student: 'aysel@example.com',
  teacher: 'muellim@example.com',
}

const FEATURES = [
  'Bütün şagird və müəllim siyahıları',
  'Əlavə et, redaktə et, sil',
  'Şəxsi profil və şifrə idarəsi',
]

// API sahə adı -> forma sahə adı
const LOGIN_FIELD_MAP: Record<string, keyof LoginFormValues> = {
  email: 'email',
  password: 'password',
}

// Qeydiyyatdan sonra yönləndirmədə email ötürülür
interface LoginLocationState {
  email?: string
}

const Login = () => {
  const [role, setRole] = useRoleParam()
  const [form] = Form.useForm<LoginFormValues>()
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.auth.loading)
  const location = useLocation()
  const navigate = useNavigate()
  const registeredEmail = (location.state as LoginLocationState | null)?.email

  const handleRoleChange = (next: UserRole) => {
    setRole(next)
    form.resetFields()
  }

  const handleFinish = async (values: LoginFormValues) => {
    try {
      const user = await dispatch(
        login({ role, credentials: { email: values.email.trim(), password: values.password } }),
      ).unwrap()
      message.success(`Xoş gəldiniz, ${user.data.name}`)
      navigate(ROUTES.dashboard, { replace: true })
    } catch (err) {
      const error = err as ApiError
      if (error.status === 401) {
        message.error('Email və ya şifrə yanlışdır')
        return
      }
      if (!applyServerErrors(form, error.errors, LOGIN_FIELD_MAP)) {
        message.error(error.message)
      }
    }
  }

  return (
    <AuthLayout
      title={SIDE_CONTENT[role].title}
      description={SIDE_CONTENT[role].description}
      listType="bullets"
      items={FEATURES}
    >
      <div className="w-full max-w-106 rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
        <RoleSwitch value={role} onChange={handleRoleChange} block />

        <div className="mb-6 mt-7">
          <h2 className="text-[26px] font-bold text-gray-900">{ROLE_LABELS[role]} girişi</h2>
          <p className="mt-1 text-[15px] text-gray-500">Email və şifrənizlə daxil olun.</p>
        </div>

        <Form<LoginFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ remember: false, email: registeredEmail }}
          onFinish={handleFinish}
          size="large"
        >
          <Form.Item name="email" label="Email" rules={emailRules} validateTrigger="onBlur">
            <Input placeholder={EMAIL_PLACEHOLDER[role]} autoComplete="email" />
          </Form.Item>

          <Form.Item name="password" label="Şifrə" rules={loginPasswordRules}>
            <Input.Password placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          <div className="mb-6 flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Məni xatırla</Checkbox>
            </Form.Item>
            {/* TODO: şifrə bərpası səhifəsi */}
            <a href="#" className="text-sm font-medium">
              Şifrəni unutmusan?
            </a>
          </div>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Daxil ol
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Hesabın yoxdur?{' '}
          <Link to={`${ROUTES.register}?role=${role}`} className="font-semibold">
            Qeydiyyatdan keç
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
