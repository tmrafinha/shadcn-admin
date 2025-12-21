import { create } from 'zustand'
import { fetchResumesList } from '@/services/resumes.service'
import type { Resume } from '@/features/settings/curriculum/resumes.types'

interface ResumesState {
  resumes: Resume[]
  loading: boolean
  error: string | null
  fetchedOnce: boolean

  fetchResumes: () => Promise<void>
}

export const useResumesStore = create<ResumesState>((set, get) => ({
  resumes: [],
  loading: false,
  error: null,
  fetchedOnce: false,

  fetchResumes: async () => {
    if (get().loading) return

    set({ loading: true, error: null })

    try {
      const resumes = await fetchResumesList(1, 50)

      set({
        resumes,
        loading: false,
        fetchedOnce: true,
      })
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? 'Erro ao carregar currículos',
      })
    }
  },
}))