import type { FormInstance } from 'antd'

/**
 * Serverin 422 cavabındakı sahə xətalarını antd formasının sahələrinə yazır.
 * fieldMap: API sahə adı -> forma sahə adı (məs: parent_name -> parentName)
 * Ən azı bir sahəyə xəta yazılıbsa true qaytarır.
 */
export const applyServerErrors = <T>(
  form: FormInstance<T>,
  errors: Record<string, string[]> | undefined,
  fieldMap: Record<string, string>,
): boolean => {
  if (!errors) return false

  const fields = Object.entries(errors)
    .filter(([apiField]) => apiField in fieldMap)
    .map(([apiField, messages]) => ({ name: fieldMap[apiField], errors: messages }))

  if (fields.length === 0) return false

  // setFields-in tipi dərin NamePath gözləyir, sadə string adlar üçün cast edirik
  form.setFields(fields as Parameters<FormInstance<T>['setFields']>[0])
  form.scrollToField(fields[0].name)
  return true
}
