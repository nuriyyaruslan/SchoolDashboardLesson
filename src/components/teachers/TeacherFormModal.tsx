import { useEffect, useState } from 'react'
import { App, Form, Input, Modal } from 'antd'
import { teacherService } from '../../services/teacherService'
import {
  PASSWORD_MIN_LENGTH,
  emailRules,
  fullNameRules,
  normalizePhone,
  optionalPasswordRules,
  passwordRules,
  phoneRules,
  positionRules,
} from '../../utils/validation'
import { applyServerErrors } from '../../utils/formErrors'
import { toApiError } from '../../utils/apiError'
import type { Teacher } from '../../types/auth'
import type { TeacherFormValues, TeacherInput } from '../../types/management'

interface TeacherFormModalProps {
  open: boolean
  // null — yeni müəllim, Teacher — redaktə
  teacher: Teacher | null
  onClose: () => void
  onSaved: () => void
}

const FIELD_MAP: Record<string, keyof TeacherFormValues> = {
  name: 'fullName',
  position: 'position',
  phone: 'phone',
  email: 'email',
  password: 'password',
}

const toInput = (values: TeacherFormValues): TeacherInput => ({
  name: values.fullName.trim(),
  position: values.position.trim(),
  phone: values.phone,
  email: values.email.trim(),
  ...(values.password ? { password: values.password } : {}),
})

const TeacherFormModal = ({ open, teacher, onClose, onSaved }: TeacherFormModalProps) => {
  const [form] = Form.useForm<TeacherFormValues>()
  const { message } = App.useApp()
  const [saving, setSaving] = useState(false)
  const isEdit = teacher !== null

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (teacher) {
      form.setFieldsValue({
        fullName: teacher.name,
        position: teacher.position ?? undefined,
        phone: teacher.phone ?? undefined,
        email: teacher.email,
      })
    }
  }, [open, teacher, form])

  const handleFinish = async (values: TeacherFormValues) => {
    setSaving(true)
    try {
      if (teacher) {
        await teacherService.update(teacher.id, toInput(values))
        message.success('Müəllim məlumatları yeniləndi')
      } else {
        await teacherService.create(toInput(values))
        message.success('Yeni müəllim əlavə olundu')
      }
      onSaved()
    } catch (err) {
      const error = toApiError(err)
      if (!applyServerErrors(form, error.errors, FIELD_MAP)) message.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Müəllimi redaktə et' : 'Yeni müəllim'}
      okText={isEdit ? 'Yadda saxla' : 'Əlavə et'}
      cancelText="Ləğv et"
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={saving}
      width={640}
      destroyOnHidden
    >
      <Form<TeacherFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mt-4"
      >
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item name="fullName" label="Ad, soyad" rules={fullNameRules}>
            <Input placeholder="Rəşad Məmmədli" />
          </Form.Item>
          <Form.Item name="position" label="Vəzifə" rules={positionRules}>
            <Input placeholder="Riyaziyyat müəllimi" />
          </Form.Item>
          <Form.Item name="phone" label="Telefon" rules={phoneRules} normalize={normalizePhone} validateTrigger="onBlur">
            <Input placeholder="+994501112233" maxLength={13} inputMode="tel" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={emailRules} validateTrigger="onBlur">
            <Input placeholder="rashad@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label={isEdit ? 'Yeni şifrə (istəyə bağlı)' : 'Şifrə'}
            rules={isEdit ? optionalPasswordRules : passwordRules}
            className="sm:col-span-2"
          >
            <Input.Password placeholder={`Minimum ${PASSWORD_MIN_LENGTH} simvol`} autoComplete="new-password" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default TeacherFormModal
