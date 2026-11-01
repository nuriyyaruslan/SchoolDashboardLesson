import { useEffect, useState } from 'react'
import { App, Form, Input, Modal, Select, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { studentService } from '../../services/studentService'
import { GRADE_OPTIONS } from '../../constants'
import {
  PASSWORD_MIN_LENGTH,
  cityRules,
  emailRules,
  fullNameRules,
  gradeRules,
  lessonTimeRules,
  normalizePhone,
  optionalPasswordRules,
  parentNameRules,
  passwordRules,
  phoneRules,
} from '../../utils/validation'
import { applyServerErrors } from '../../utils/formErrors'
import { toApiError } from '../../utils/apiError'
import type { Student } from '../../types/auth'
import type { StudentFormValues, StudentInput } from '../../types/management'

interface StudentFormModalProps {
  open: boolean
  // null — yeni şagird, Student — redaktə
  student: Student | null
  onClose: () => void
  onSaved: () => void
}

const FIELD_MAP: Record<string, keyof StudentFormValues> = {
  name: 'fullName',
  parent_name: 'parentName',
  city: 'city',
  phone: 'phone',
  email: 'email',
  grade: 'grade',
  time: 'lessonTime',
  password: 'password',
}

const toFormValues = (student: Student): Partial<StudentFormValues> => ({
  fullName: student.name,
  parentName: student.parent_name ?? undefined,
  city: student.city ?? undefined,
  phone: student.phone ?? undefined,
  email: student.email,
  grade: student.grade ? Number(student.grade) : undefined,
  lessonTime: student.time ? dayjs(student.time, 'HH:mm') : undefined,
})

const toInput = (values: StudentFormValues): StudentInput => ({
  name: values.fullName.trim(),
  parent_name: values.parentName.trim(),
  city: values.city.trim(),
  phone: values.phone,
  email: values.email.trim(),
  grade: String(values.grade),
  time: values.lessonTime.format('HH:mm'),
  // Redaktədə boş şifrə göndərilmir — köhnəsi qalır
  ...(values.password ? { password: values.password } : {}),
})

const StudentFormModal = ({ open, student, onClose, onSaved }: StudentFormModalProps) => {
  const [form] = Form.useForm<StudentFormValues>()
  const { message } = App.useApp()
  const [saving, setSaving] = useState(false)
  const isEdit = student !== null

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (student) form.setFieldsValue(toFormValues(student))
  }, [open, student, form])

  const handleFinish = async (values: StudentFormValues) => {
    setSaving(true)
    try {
      if (student) {
        await studentService.update(student.id, toInput(values))
        message.success('Şagird məlumatları yeniləndi')
      } else {
        await studentService.create(toInput(values))
        message.success('Yeni şagird əlavə olundu')
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
      title={isEdit ? 'Şagirdi redaktə et' : 'Yeni şagird'}
      okText={isEdit ? 'Yadda saxla' : 'Əlavə et'}
      cancelText="Ləğv et"
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={saving}
      width={640}
      destroyOnHidden
    >
      <Form<StudentFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mt-4"
      >
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item name="fullName" label="Ad, soyad" rules={fullNameRules}>
            <Input placeholder="Aysel Mammadova" />
          </Form.Item>
          <Form.Item name="parentName" label="Valideynin adı" rules={parentNameRules}>
            <Input placeholder="Leyla Mammadova" />
          </Form.Item>
          <Form.Item name="city" label="Şəhər" rules={cityRules}>
            <Input placeholder="Baku" />
          </Form.Item>
          <Form.Item name="phone" label="Telefon" rules={phoneRules} normalize={normalizePhone} validateTrigger="onBlur">
            <Input placeholder="+994501234567" maxLength={13} inputMode="tel" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={emailRules} validateTrigger="onBlur">
            <Input placeholder="aysel@example.com" />
          </Form.Item>
          <Form.Item name="grade" label="Sinif" rules={gradeRules}>
            <Select placeholder="Sinif seçin" options={GRADE_OPTIONS} />
          </Form.Item>
          <Form.Item name="lessonTime" label="Dərs vaxtı" rules={lessonTimeRules}>
            <TimePicker format="HH:mm" minuteStep={5} placeholder="--:--" className="w-full" needConfirm={false} />
          </Form.Item>
          <Form.Item
            name="password"
            label={isEdit ? 'Yeni şifrə (istəyə bağlı)' : 'Şifrə'}
            rules={isEdit ? optionalPasswordRules : passwordRules}
          >
            <Input.Password placeholder={`Minimum ${PASSWORD_MIN_LENGTH} simvol`} autoComplete="new-password" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default StudentFormModal
