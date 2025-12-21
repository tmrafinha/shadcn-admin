import { create } from 'zustand'
import {
  fetchResumesList,
  uploadResume as uploadResumeService,
  deleteResume as deleteResumeService,
} from '@/services/resumes.service'
import type { Resume } from '@/features/settings/curriculum/resumes.types'

interface ResumesState {
  resumes: Resume[]
  loading: boolean
  error: string | null
  fetchedOnce: boolean

  fetchResumes: () => Promise<void>
  uploadResume: (file: File) => Promise<Resume>
  deleteResume: (id: string) => Promise<void>
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
      set({ resumes, loading: false, fetchedOnce: true })
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? 'Erro ao carregar currículos' })
    }
  },

  uploadResume: async (file: File) => {
    set({ loading: true, error: null })
    try {
      const created = await uploadResumeService(file)

      // atualiza lista sem precisar refetch (opcional, mas nice)
      set((state) => ({
        loading: false,
        resumes: [created, ...state.resumes],
        fetchedOnce: true,
      }))

      return created
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Erro ao enviar currículo.'
      set({ loading: false, error: message })
      throw err
    }
  },

  deleteResume: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await deleteResumeService(id)
      set((state) => ({
        loading: false,
        resumes: state.resumes.filter((r) => r.id !== id),
      }))
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Erro ao excluir currículo.'
      set({ loading: false, error: message })
      throw err
    }
  },
}))