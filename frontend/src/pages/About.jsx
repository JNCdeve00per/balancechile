import { 
  Info, 
  Github, 
  ExternalLink, 
  Database, 
  Shield, 
  Users,
  Target,
  Code,
  Heart
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Database,
      title: 'Datos Oficiales',
      description: 'Toda la información proviene de fuentes oficiales del gobierno de Chile como DIPRES, Banco Central y datos.gob.cl'
    },
    {
      icon: Shield,
      title: 'Transparencia',
      description: 'Promovemos la transparencia fiscal y el acceso ciudadano a la información del presupuesto público'
    },
    {
      icon: Users,
      title: 'Participación Ciudadana',
      description: 'Facilitamos la comprensión del gasto público para fomentar la participación informada de los ciudadanos'
    },
    {
      icon: Code,
      title: 'Código Abierto',
      description: 'El proyecto es completamente open source, disponible en GitHub bajo licencia MIT'
    }
  ]

  const technologies = [
    { name: 'React 18', description: 'Frontend moderno con hooks y componentes funcionales' },
    { name: 'Node.js + Express', description: 'Backend robusto para APIs REST' },
    { name: 'Recharts', description: 'Visualizaciones interactivas y responsivas' },
    { name: 'TailwindCSS', description: 'Diseño moderno y adaptativo' },
    { name: 'Redis', description: 'Cache inteligente para optimizar rendimiento' },
    { name: 'Docker', description: 'Despliegue containerizado y escalable' }
  ]

  const dataSources = [
    {
      name: 'DIPRES',
      description: 'Dirección de Presupuestos del Ministerio de Hacienda',
      url: 'https://www.dipres.gob.cl'
    },
    {
      name: 'Datos Abiertos',
      description: 'Portal oficial de datos abiertos del gobierno',
      url: 'https://datos.gob.cl'
    },
    {
      name: 'Banco Central',
      description: 'Indicadores económicos y estadísticas macroeconómicas',
      url: 'https://www.bcentral.cl'
    },
    {
      name: 'Contraloría General',
      description: 'Información de control y fiscalización del gasto público',
      url: 'https://www.contraloria.cl'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-chile-red rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">BC</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Balance Chile</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Plataforma de transparencia para visualizar y comprender el presupuesto público de Chile. 
          Democratizamos el acceso a la información fiscal para promover una ciudadanía informada.
        </p>
      </div>

      {/* Mission */}
      <div className="card">
        <div className="text-center">
          <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto">
            Hacer accesible y comprensible la información del presupuesto público chileno, 
            promoviendo la transparencia fiscal y empoderando a los ciudadanos con datos 
            confiables para una participación democrática informada.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Technologies */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Tecnologías Utilizadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div key={tech.name} className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tech.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Fuentes de Datos Oficiales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataSources.map((source) => (
            <div key={source.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {source.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {source.description}
                  </p>
                  <a 
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 text-sm font-medium"
                  >
                    <span>Visitar sitio oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Database className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Datos Oficiales del Presupuesto 2024
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                $42.2B
              </div>
              <div className="text-gray-600">Presupuesto Total</div>
              <div className="text-xs text-gray-500 mt-1">Fuente: BCN</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                +3.5%
              </div>
              <div className="text-gray-600">Crecimiento vs 2023</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                16
              </div>
              <div className="text-gray-600">Regiones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                346
              </div>
              <div className="text-gray-600">Municipalidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Source */}
      <div className="card text-center">
        <Github className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Proyecto de Código Abierto
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Balance Chile es un proyecto completamente open source. Creemos en la transparencia 
          no solo de los datos gubernamentales, sino también de nuestro código. Contribuye, 
          reporta errores o sugiere mejoras.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://github.com/tu-usuario/balance-chile"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>Ver en GitHub</span>
          </a>
          <a 
            href="https://github.com/tu-usuario/balance-chile/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>Reportar Issue</span>
          </a>
        </div>
      </div>

      {/* Team */}
      <div className="card text-center">
        <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Desarrollado con ❤️ para Chile
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Este proyecto nace de la convicción de que la información pública debe ser 
          accesible para todos los ciudadanos. Desarrollado por la comunidad, para la comunidad.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-8">
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">
            © 2024 Balance Chile. Todos los derechos reservados.
          </p>
          <p>
            Los datos mostrados provienen de fuentes oficiales del gobierno de Chile y 
            se actualizan periódicamente según disponibilidad.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
