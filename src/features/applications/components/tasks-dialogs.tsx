// components/tasks-dialogs.tsx
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setOpen(null)
      setTimeout(() => setCurrentRow(null), 200)
    }
  }

  // Só mostra o drawer quando for modo "view" e tiver linha selecionada
  if (open !== 'view' || !currentRow) return null

  return (
    <TasksMutateDrawer
      open={true}
      onOpenChange={handleOpenChange}
      currentRow={currentRow}
    />
  )
}
