import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './index'

// Komponentlərdə adi useDispatch/useSelector əvəzinə tipli versiyalardan istifadə edirik
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
