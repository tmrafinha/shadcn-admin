import { useState, ChangeEvent } from 'react'
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, ChevronRight, Bookmark, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'Google',
    logo: '🔍',
    location: 'São Paulo, SP',
    type: 'Full-time',
    salary: 'R$ 25.000 - R$ 35.000',
    remote: 'Híbrido',
    posted: '2 dias atrás',
    tags: ['React', 'Node.js', 'TypeScript', 'GCP'],
    featured: true,
    description: 'Trabalhe com as tecnologias mais modernas do mercado em projetos que impactam milhões de usuários.',
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'Netflix',
    logo: '🎬',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R$ 22.000 - R$ 32.000',
    remote: '100% Remoto',
    posted: '1 dia atrás',
    tags: ['React', 'Next.js', 'TypeScript', 'GraphQL'],
    featured: true,
    description: 'Crie experiências incríveis para milhões de usuários ao redor do mundo.',
  },
  {
    id: 3,
    title: 'Backend Developer - IoT',
    company: 'Bosch',
    logo: '⚙️',
    location: 'Campinas, SP',
    type: 'Full-time',
    salary: 'R$ 18.000 - R$ 25.000',
    remote: 'Híbrido',
    posted: '3 dias atrás',
    tags: ['Python', 'Django', 'AWS', 'IoT'],
    featured: true,
    description: 'Desenvolva soluções inovadoras para a indústria 4.0.',
  },
  {
    id: 4,
    title: 'Mobile Developer (iOS/Android)',
    company: 'Nubank',
    logo: '💜',
    location: 'São Paulo, SP',
    type: 'Full-time',
    salary: 'R$ 20.000 - R$ 28.000',
    remote: 'Híbrido',
    posted: '1 semana atrás',
    tags: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
    featured: false,
    description: 'Faça parte da revolução fintech no Brasil.',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Amazon AWS',
    logo: '☁️',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R$ 24.000 - R$ 33.000',
    remote: '100% Remoto',
    posted: '4 dias atrás',
    tags: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    featured: true,
    description: 'Construa e mantenha infraestrutura cloud de classe mundial.',
  },
  {
    id: 6,
    title: 'Tech Lead - Frontend',
    company: 'Microsoft',
    logo: '🪟',
    location: 'São Paulo, SP',
    type: 'Full-time',
    salary: 'R$ 28.000 - R$ 38.000',
    remote: 'Híbrido',
    posted: '5 dias atrás',
    tags: ['React', 'Azure', 'TypeScript', 'Leadership'],
    featured: true,
    description: 'Lidere times de alto desempenho em projetos de impacto global.',
  },
  {
    id: 7,
    title: 'Data Engineer',
    company: 'iFood',
    logo: '🍕',
    location: 'São Paulo, SP',
    type: 'Full-time',
    salary: 'R$ 19.000 - R$ 26.000',
    remote: 'Híbrido',
    posted: '1 semana atrás',
    tags: ['Python', 'Spark', 'Airflow', 'BigQuery'],
    featured: false,
    description: 'Transforme dados em insights valiosos para o maior foodtech da América Latina.',
  },
  {
    id: 8,
    title: 'Software Engineer - AI/ML',
    company: 'Meta',
    logo: '📘',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R$ 26.000 - R$ 36.000',
    remote: '100% Remoto',
    posted: '2 dias atrás',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'ML'],
    featured: true,
    description: 'Desenvolva soluções de IA que conectam pessoas ao redor do mundo.',
  },
  {
    id: 9,
    title: 'Full Stack Developer',
    company: 'Spotify',
    logo: '🎵',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R$ 21.000 - R$ 29.000',
    remote: '100% Remoto',
    posted: '3 dias atrás',
    tags: ['Java', 'React', 'Kubernetes', 'GCP'],
    featured: false,
    description: 'Crie recursos que impactam a forma como as pessoas consomem música.',
  },
  {
    id: 10,
    title: 'Security Engineer',
    company: 'Mercado Livre',
    logo: '🛒',
    location: 'São Paulo, SP',
    type: 'Full-time',
    salary: 'R$ 22.000 - R$ 30.000',
    remote: 'Híbrido',
    posted: '6 dias atrás',
    tags: ['Security', 'Python', 'AWS', 'Compliance'],
    featured: false,
    description: 'Proteja a maior plataforma de e-commerce da América Latina.',
  },
  {
    id: 11,
    title: 'Backend Engineer - Payments',
    company: 'Stripe',
    logo: '💳',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R$ 27.000 - R$ 37.000',
    remote: '100% Remoto',
    posted: '1 dia atrás',
    tags: ['Ruby', 'Go', 'PostgreSQL', 'Microservices'],
    featured: true,
    description: 'Construa a infraestrutura de pagamentos da internet.',
  },
  {
    id: 12,
    title: 'Frontend Developer',
    company: 'Figma',
    logo: '🎨',
    location: 'Remote',
    type: 'Full-time',
    salary: 'R$ 23.000 - R$ 31.000',
    remote: '100% Remoto',
    posted: '4 dias atrás',
    tags: ['TypeScript', 'React', 'WebGL', 'Design'],
    featured: false,
    description: 'Ajude a criar a melhor ferramenta de design colaborativo do mundo.',
  },
]

const categories = [
  { name: 'Frontend', count: 145, icon: '💻' },
  { name: 'Backend', count: 198, icon: '⚙️' },
  { name: 'Full Stack', count: 234, icon: '🔧' },
  { name: 'Mobile', count: 87, icon: '📱' },
  { name: 'DevOps', count: 76, icon: '☁️' },
  { name: 'Data', count: 124, icon: '📊' },
  { name: 'AI/ML', count: 93, icon: '🤖' },
  { name: 'Security', count: 65, icon: '🔒' },
]

export function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedRemote, setSelectedRemote] = useState<string>('all')
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || job.type === selectedType
    const matchesRemote = selectedRemote === 'all' || job.remote === selectedRemote
    
    return matchesSearch && matchesType && matchesRemote
  })

  const featuredJobs = filteredJobs.filter(job => job.featured)
  const regularJobs = filteredJobs.filter(job => !job.featured)

  return (
    <>
      {/* Header */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Main Content */}
      <Main>
        {/* Hero Section */}
        <div className="space-y-8 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-green-800 dark:text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{jobs.length} vagas em Destaque</span>
            </div>
            
            <h1
              className="
                text-4xl md:text-6xl font-bold mb-6
                bg-gradient-to-r from-primary to-primary-dark
                bg-clip-text text-transparent leading-tight
                
                dark:from-foreground dark:via-primary/80 dark:to-primary
              "
            >
              Encontre sua próxima
              <br />
              oportunidade em tech
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Conectamos desenvolvedores talentosos com as melhores empresas do mercado
            </p>

            {/* Search Bar */}
            <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar por cargo, empresa ou tecnologia..."
                      className="pl-10 h-12 bg-background/50"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Button size="lg" className="md:w-auto">
                    Buscar Vagas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="group cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <div className="text-sm font-semibold mb-1">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.count} vagas</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de vaga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contrato</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRemote} onValueChange={setSelectedRemote}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Modelo de trabalho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os modelos</SelectItem>
                <SelectItem value="100% Remoto">100% Remoto</SelectItem>
                <SelectItem value="Híbrido">Híbrido</SelectItem>
                <SelectItem value="Presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredJobs.length}</span> vagas encontradas
            </div>
          </div>

          {/* Featured Jobs */}
          {featuredJobs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <h2 className="text-2xl font-bold">Vagas em Destaque</h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="group relative border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all bg-card/50 backdrop-blur"
                  >
                    <CardHeader>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSaveJob(job.id)}
                          className="hover:bg-background/80"
                        >
                          <Bookmark
                            className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        </Button>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="text-5xl bg-background/80 p-3 rounded-xl border border-border/50">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">
                            {job.title}
                          </CardTitle>
                          <CardDescription className="text-lg font-semibold">
                            {job.company}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{job.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary-dark dark:text-primary hover:bg-primary/20 border-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.remote}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-primary-dark dark:text-primary">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button className="w-full gap-2" size="lg">
                        Ver Detalhes
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Jobs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Todas as Vagas</h2>
            <div className="grid gap-4">
              {regularJobs.map((job) => (
                <Card
                  key={job.id}
                  className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all bg-card/50 backdrop-blur"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl bg-background/80 p-3 rounded-lg border border-border/50">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-base font-semibold text-muted-foreground mb-3">{job.company}</p>
                          <div className="flex flex-wrap gap-2">
                            {job.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="border-primary/30 text-primary-dark dark:text-primary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-3">
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.remote}</span>
                          </div>
                        </div>
                        <div className="text-base font-bold text-primary-dark dark:text-primary">{job.salary}</div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleSaveJob(job.id)}
                          >
                            <Bookmark
                              className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-primary text-primary' : ''}`}
                            />
                          </Button>
                          <Button className="gap-2">
                            Candidatar
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}