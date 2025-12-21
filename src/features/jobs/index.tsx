// src/features/jobs/Jobs.tsx
import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  X,
  SlidersHorizontal,
  Building2,
  CheckCircle2,
} from 'lucide-react'
// reaproveita só lista de techs
import { useJobsStore } from '@/stores/jobs-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import type { EmploymentType, WorkModel } from '@/features/jobs/jobs.types'
import { techStacks } from './data/allJobs'

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  CLT: 'CLT',
  PJ: 'PJ',
  FREELANCE: 'Freelancer',
  INTERNSHIP: 'Estágio',
}

const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  REMOTE: '100% Remoto',
  HYBRID: 'Híbrido',
  ON_SITE: 'Presencial',
}

const getCompanyInitials = (name?: string | null) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return 'A combinar'
  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`
  if (min != null) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

export function Jobs() {
  const {
    jobs,
    loading,
    error,
    filters,
    pagination,
    setCompanyId,
    setFilters,
    setPage,
    resetFilters,
    fetchJobs,
  } = useJobsStore()

  const [searchTerm, setSearchTerm] = useState(filters.search ?? '')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedRemote, setSelectedRemote] = useState<string>('all')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    filters.minSalary ?? 0,
    filters.maxSalary ?? 50000,
  ])
  const [sortBy, setSortBy] = useState('recent')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // TODO: trocar por companyId real vindo do contexto/auth
  useEffect(() => {
    if (!filters.companyId) {
      setCompanyId('11fce76b-caab-47ac-b34c-14e36c53ec8e')
    }
    fetchJobs()
  }, [filters.companyId, setCompanyId, fetchJobs])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setFilters({ search: value || undefined })
    fetchJobs()
  }

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedRemote('all')
    setSelectedTechs([])
    setSalaryRange([0, 50000])
    setSortBy('recent')

    resetFilters()
    fetchJobs()
  }

  const handleChangeType = (value: string) => {
    setSelectedType(value)
    const employmentType =
      value === 'all' ? undefined : (value as EmploymentType)
    setFilters({ employmentType })
    fetchJobs()
  }

  const handleChangeRemote = (value: string) => {
    setSelectedRemote(value)
    let workModel: WorkModel | undefined
    if (value === '100% Remoto') workModel = 'REMOTE'
    else if (value === 'Híbrido') workModel = 'HYBRID'
    else if (value === 'Presencial') workModel = 'ON_SITE'
    else workModel = undefined

    setFilters({ workModel })
    fetchJobs()
  }

  const handleSalaryChange = (range: number[]) => {
    const [min, max] = range
    setSalaryRange(range as [number, number])
    setFilters({
      minSalary: min === 0 ? undefined : min,
      maxSalary: max === 50000 ? undefined : max,
    })
    fetchJobs()
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)

    if (value === 'recent') {
      setFilters({ sortBy: 'createdAt', sortOrder: 'desc' })
    } else if (value === 'salary-high') {
      setFilters({ sortBy: 'salaryMax', sortOrder: 'desc' })
    } else if (value === 'salary-low') {
      setFilters({ sortBy: 'salaryMin', sortOrder: 'asc' })
    }

    fetchJobs()
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return
    setPage(page)
    fetchJobs()
  }

  const filteredByTech = useMemo(() => {
    if (selectedTechs.length === 0) return jobs
    return jobs.filter((job) =>
      selectedTechs.some((tech) => job.techStack.includes(tech))
    )
  }, [jobs, selectedTechs])

  const activeFiltersCount =
    (selectedType !== 'all' ? 1 : 0) +
    (selectedRemote !== 'all' ? 1 : 0) +
    selectedTechs.length +
    (salaryRange[0] !== 0 || salaryRange[1] !== 50000 ? 1 : 0) +
    (searchTerm ? 1 : 0)

  const FiltersContent = () => (
    <div className='space-y-8'>
      {/* Linha 1: Salário */}
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='font-semibold'>Faixa Salarial</h3>
            <p className='text-muted-foreground text-xs'>
              Ajuste a faixa mínima e máxima de salário desejada.
            </p>
          </div>
          <div className='text-muted-foreground mb-2 text-sm'>
            {salaryRange[0].toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}{' '}
            -{' '}
            {salaryRange[1].toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
          <Slider
            value={salaryRange}
            onValueChange={handleSalaryChange}
            max={50000}
            step={1000}
          />
        </div>
      </div>

      <Separator />

      {/* Tecnologias */}
      <div className='space-y-3'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Tecnologias</h3>
          <p className='text-muted-foreground text-xs'>
            Selecione as stacks que você quer encontrar nas vagas.
          </p>
        </div>
        <div className='flex max-h-60 flex-wrap gap-2 overflow-y-auto'>
          {techStacks.map((tech) => (
            <Badge
              key={tech}
              variant={selectedTechs.includes(tech) ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                selectedTechs.includes(tech)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => toggleTech(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Header>
        {/* <Search /> */}
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='space-y-6'>
          {/* Page Header */}
          <div className='space-y-4'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <h1 className='mb-1 text-2xl font-bold md:text-3xl'>
                  Todas as Vagas
                </h1>
                <p className='text-muted-foreground'>
                  {pagination.total} oportunidades encontradas
                </p>
              </div>
            </div>

            {/* Search + filtros rápidos */}
            <Card className='bg-card/50 border-border/50 backdrop-blur'>
              <CardContent className='space-y-4 p-4'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
                  {/* Search */}
                  <div className='relative flex-1'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform' />
                    <Input
                      type='text'
                      placeholder='Buscar por cargo, empresa ou tecnologia...'
                      className='bg-background/50 pl-10'
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  {/* Desktop: selects + mais filtros todos alinhados */}
                  <div className='hidden items-center gap-3 lg:flex'>
                    <Select
                      value={selectedType}
                      onValueChange={handleChangeType}
                    >
                      <SelectTrigger className='w-[160px]'>
                        <SelectValue placeholder='Tipo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Todos os tipos</SelectItem>
                        <SelectItem value='CLT'>CLT</SelectItem>
                        <SelectItem value='PJ'>PJ</SelectItem>
                        <SelectItem value='FREELANCE'>Freelancer</SelectItem>
                        <SelectItem value='INTERNSHIP'>Estágio</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedRemote}
                      onValueChange={handleChangeRemote}
                    >
                      <SelectTrigger className='w-[160px]'>
                        <SelectValue placeholder='Modelo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Todos</SelectItem>
                        <SelectItem value='100% Remoto'>100% Remoto</SelectItem>
                        <SelectItem value='Híbrido'>Híbrido</SelectItem>
                        <SelectItem value='Presencial'>Presencial</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className='w-[160px]'>
                        <SelectValue placeholder='Ordenar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='recent'>Mais recentes</SelectItem>
                        <SelectItem value='salary-high'>
                          Maior salário
                        </SelectItem>
                        <SelectItem value='salary-low'>
                          Menor salário
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant='outline'
                      className='gap-2'
                      onClick={() => setShowAdvancedFilters((prev) => !prev)}
                    >
                      <SlidersHorizontal className='h-4 w-4' />
                      {showAdvancedFilters ? 'Ocultar filtros' : 'Mais filtros'}
                      {activeFiltersCount > 0 && (
                        <Badge variant='secondary' className='ml-1'>
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* Mobile: botão único de filtros (abre Sheet) */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full gap-2 lg:hidden'
                      >
                        <SlidersHorizontal className='h-4 w-4' />
                        Filtros
                        {activeFiltersCount > 0 && (
                          <Badge className='ml-auto'>
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side='left'
                      className='w-full overflow-y-auto sm:w-96'
                    >
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                        <SheetDescription>
                          Refine sua busca com os filtros abaixo
                        </SheetDescription>
                      </SheetHeader>
                      <div className='mt-6 space-y-6'>
                        {/* Filtros rápidos mobile */}
                        <div className='space-y-3'>
                          <Select
                            value={selectedType}
                            onValueChange={handleChangeType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Tipo de vaga' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='all'>
                                Todos os tipos
                              </SelectItem>
                              <SelectItem value='CLT'>CLT</SelectItem>
                              <SelectItem value='PJ'>PJ</SelectItem>
                              <SelectItem value='FREELANCE'>
                                Freelancer
                              </SelectItem>
                              <SelectItem value='INTERNSHIP'>
                                Estágio
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={selectedRemote}
                            onValueChange={handleChangeRemote}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Modelo de trabalho' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='all'>
                                Todos os modelos
                              </SelectItem>
                              <SelectItem value='100% Remoto'>
                                100% Remoto
                              </SelectItem>
                              <SelectItem value='Híbrido'>Híbrido</SelectItem>
                              <SelectItem value='Presencial'>
                                Presencial
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={sortBy}
                            onValueChange={handleSortChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Ordenar por' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='recent'>
                                Mais recentes
                              </SelectItem>
                              <SelectItem value='salary-high'>
                                Maior salário
                              </SelectItem>
                              <SelectItem value='salary-low'>
                                Menor salário
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <FiltersContent />

                        <div className='flex gap-3 pt-4'>
                          <Button
                            variant='outline'
                            className='flex-1'
                            onClick={clearFilters}
                          >
                            Limpar
                          </Button>
                          <SheetClose asChild>
                            <Button className='flex-1'>Aplicar Filtros</Button>
                          </SheetClose>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Chips de filtros ativos */}
                {activeFiltersCount > 0 && (
                  <div className='border-border/40 flex flex-wrap items-center gap-2 border-t pt-3'>
                    <span className='text-muted-foreground text-sm'>
                      Filtros ativos:
                    </span>
                    {selectedType !== 'all' && (
                      <Badge variant='secondary' className='gap-1'>
                        {selectedType}
                        <X
                          className='hover:text-destructive h-3 w-3 cursor-pointer'
                          onClick={() => handleChangeType('all')}
                        />
                      </Badge>
                    )}
                    {selectedRemote !== 'all' && (
                      <Badge variant='secondary' className='gap-1'>
                        {selectedRemote}
                        <X
                          className='hover:text-destructive h-3 w-3 cursor-pointer'
                          onClick={() => handleChangeRemote('all')}
                        />
                      </Badge>
                    )}
                    {selectedTechs.map((tech) => (
                      <Badge key={tech} variant='secondary' className='gap-1'>
                        {tech}
                        <X
                          className='hover:text-destructive h-3 w-3 cursor-pointer'
                          onClick={() => toggleTech(tech)}
                        />
                      </Badge>
                    ))}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={clearFilters}
                      className='h-7 text-xs'
                    >
                      Limpar todos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de filtros avançados embaixo (desktop) */}
            {showAdvancedFilters && (
              <Card className='bg-card/60 border-primary/20 hidden shadow-sm lg:block'>
                <CardHeader className='flex flex-row items-start justify-between gap-2 pb-2'>
                  <div className='space-y-1'>
                    <CardTitle>Filtros avançados</CardTitle>
                    <CardDescription>
                      Combine faixa salarial e stacks para refinar suas vagas.
                    </CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowAdvancedFilters(false)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </CardHeader>
                <CardContent className='space-y-6 pt-4'>
                  <FiltersContent />
                  <div className='flex justify-end gap-3 border-t pt-4'>
                    <Button variant='outline' onClick={clearFilters}>
                      Limpar tudo
                    </Button>
                    <Button onClick={() => setShowAdvancedFilters(false)}>
                      Aplicar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lista de vagas */}
          <div className='space-y-4'>
            {loading ? (
              <Card className='p-12 text-center'>
                <p>Carregando vagas...</p>
              </Card>
            ) : error ? (
              <Card className='p-12 text-center'>
                <p className='text-red-500'>{error}</p>
              </Card>
            ) : filteredByTech.length === 0 ? (
              <Card className='p-12 text-center'>
                <div className='flex flex-col items-center gap-4'>
                  <div className='bg-muted flex h-16 w-16 items-center justify-center rounded-full'>
                    <Search className='text-muted-foreground h-8 w-8' />
                  </div>
                  <div>
                    <h3 className='mb-1 text-lg font-semibold'>
                      Nenhuma vaga encontrada
                    </h3>
                    <p className='text-muted-foreground mb-4 text-sm'>
                      Tente ajustar seus filtros ou fazer uma nova busca
                    </p>
                    <Button onClick={clearFilters}>Limpar Filtros</Button>
                  </div>
                </div>
              </Card>
            ) : (
              // AQUI: mobile 1 coluna, desktop continua comportando igual
              <div className='grid grid-cols-1 gap-4 md:grid-cols-1'>
                {filteredByTech.map((job) => {
                  const isApplied = !!job.appliedByCurrentUser

                  return (
                    <a
                      key={job.id}
                      href={`/job-details/${job.id}`}
                      className='block'
                    >
                      <Card className='group border-border/60 bg-card/50 border backdrop-blur transition-all duration-200 ease-out hover:scale-[1.02] motion-safe:hover:scale-[1.02]'>
                        <CardContent className='p-6'>
                          <div className='flex flex-col gap-6 md:flex-row md:items-start'>
                            <div className='flex flex-1 items-start gap-4'>
                              <div className='border-border/50 bg-background/80 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border'>
                                {job.company.logoUrl ? (
                                  <img
                                    src={job.company.logoUrl}
                                    alt={job.company.name}
                                    className='h-full w-full object-cover'
                                  />
                                ) : (
                                  <span className='text-lg font-bold'>
                                    {getCompanyInitials(job.company.name)}
                                  </span>
                                )}
                              </div>
                              <div className='min-w-0 flex-1'>
                                <div className='mb-2 flex items-start justify-between gap-3'>
                                  <div className='space-y-1'>
                                    <h3 className='group-hover:text-primary text-lg font-bold transition-colors'>
                                      {job.title}
                                    </h3>
                                    {isApplied && (
                                      <div className='flex items-center gap-2'>
                                        <Badge
                                          variant='outline'
                                          className='gap-1 border-emerald-400/60 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                                        >
                                          <CheckCircle2 className='h-3 w-3' />
                                          Já se candidatou
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className='text-muted-foreground mb-3 flex items-center gap-2 text-base font-semibold'>
                                  <Building2 className='h-4 w-4' />
                                  <div className='flex items-center gap-1'>
                                    <span className='truncate'>
                                      {job.company.name}
                                    </span>
                                    <Badge variant='secondary' className='md:hidden'>
                                      {EMPLOYMENT_LABELS[job.employmentType]}
                                    </Badge>
                                  </div>
                                </p>
                                <p className='text-muted-foreground mb-4 line-clamp-2 text-sm'>
                                  {job.description}
                                </p>
                                <div className='mb-4 flex flex-wrap gap-2'>
                                  {job.techStack.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant='outline'
                                      className='bg-primary/5 text-primary'
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className='text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-sm'>
                                  <div className='flex items-center gap-1'>
                                    <MapPin className='h-4 w-4' />
                                    <span>
                                      {job.location ?? 'Não informado'}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <Briefcase className='h-4 w-4' />
                                    <span>
                                      {WORK_MODEL_LABELS[job.workModel]}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <Clock className='h-4 w-4' />
                                    <span>
                                      {new Date(
                                        job.publishedAt
                                      ).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Desktop */}
                            <div className='hidden flex-shrink-0 flex-col items-end gap-3 md:flex'>
                              <div className='text-right'>
                                <div className='text-muted-foreground mb-1 text-xs'>
                                  Salário
                                </div>
                                <div className='text-primary text-lg font-bold'>
                                  {formatSalary(
                                    job.salaryMin ?? undefined,
                                    job.salaryMax ?? undefined
                                  )}
                                </div>
                                <Badge variant='secondary' className='mt-2'>
                                  {EMPLOYMENT_LABELS[job.employmentType]}
                                </Badge>
                              </div>
                              <div className='mt-auto flex gap-2'>
                                <Button
                                  className={`w-62 gap-2 transition-all group-hover:-translate-y-[1px] group-hover:shadow-lg ${
                                    isApplied
                                      ? 'cursor-not-allowed opacity-80'
                                      : 'group-hover:bg-primary group-hover:text-primary-foreground'
                                  }`}
                                  size='lg'
                                  variant={isApplied ? 'outline' : 'default'}
                                  disabled={isApplied}
                                >
                                  {isApplied ? (
                                    <>
                                      <CheckCircle2 className='h-4 w-4' />
                                      Já candidatado
                                    </>
                                  ) : (
                                    <>
                                      Ver Vaga
                                      <ExternalLink className='h-4 w-4' />
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Mobile CTA */}
                            <div className='space-y-3 md:hidden'>
                              <div className='flex items-center justify-center'>
                                <div className='text-primary text-base font-bold'>
                                  {formatSalary(
                                    job.salaryMin ?? undefined,
                                    job.salaryMax ?? undefined
                                  )}
                                </div>
                              </div>
                              <Button
                                className={`w-full gap-2 transition-all group-hover:-translate-y-[1px] group-hover:shadow-lg ${
                                  isApplied
                                    ? 'cursor-not-allowed opacity-80'
                                    : 'group-hover:bg-primary group-hover:text-primary-foreground'
                                }`}
                                size='lg'
                                variant={isApplied ? 'outline' : 'default'}
                                disabled={isApplied}
                              >
                                {isApplied ? (
                                  <>
                                    <CheckCircle2 className='h-4 w-4' />
                                    Já candidatado
                                  </>
                                ) : (
                                  <>
                                    Ver Vaga
                                    <ExternalLink className='h-4 w-4' />
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='flex justify-center pt-8'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(pagination.page - 1)}
                      className={
                        pagination.page === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {[...Array(pagination.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= pagination.page - 1 &&
                        pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => goToPage(pageNum)}
                            isActive={pagination.page === pageNum}
                            className='cursor-pointer'
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(pagination.page + 1)}
                      className={
                        pagination.page === pagination.totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
