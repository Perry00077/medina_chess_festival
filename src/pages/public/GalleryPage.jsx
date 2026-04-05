import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera } from 'lucide-react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useLanguage } from '../../contexts/LanguageContext'
import { Button } from '../../components/ui/button'
import medinaImage from '../../assets/medina.jpg'
import beachImage from '../../assets/hammamet-yasmine-beach-image.jpg'
import hannibalImage from '../../assets/salle-hannibal.jpg'
import soukImage from '../../assets/souk.jpg'

const images = [
  {
    src: medinaImage,
    title: 'Medina Mediterranea',
    description: 'Vue emblématique du site principal du festival.',
  },
  {
    src: hannibalImage,
    title: 'Salle Hannibal',
    description: 'La salle de jeu plénière pour les principales compétitions.',
  },
  {
    src: beachImage,
    title: 'Yasmine Hammamet',
    description: 'L’environnement balnéaire autour du festival.',
  },
  {
    src: soukImage,
    title: 'Souk & ambiance Medina',
    description: 'L’atmosphère locale qui accompagne l’expérience du festival.',
  },
]

export default function GalleryPage() {
  const { dictionary } = useLanguage()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f1720_0%,#151a23_35%,#f6efe5_35%,#f4ecdf_100%)] text-[#1f1812]">
      <div className="container px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-[#111111]/90 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#f1d57b]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1d57b]">
                {dictionary.gallery}
              </p>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl">
                {dictionary.galleryPageTitle || 'Galerie complète'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher compact />
            <Link to="/">
              <Button className="rounded-full bg-[#c9a227] text-[#111111] shadow-none hover:bg-[#d7b966]">
                <ArrowLeft className="h-4 w-4" />
                {dictionary.backToHome || 'Retour à l’accueil'}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-[#dfd3be] bg-white/90 p-6 shadow-[0_20px_55px_rgba(0,0,0,0.08)] backdrop-blur">
          <p className="max-w-3xl text-sm leading-7 text-[#5d5448] sm:text-base">
            {dictionary.galleryPageDescription || 'Retrouvez l’ensemble des photos disponibles du site et de la salle de jeu.'}
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {images.map((image, index) => (
              <motion.article
                key={image.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-[28px] border border-[#eadcc4] bg-[#fcfaf6] shadow-[0_16px_45px_rgba(0,0,0,0.06)]"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-[280px] w-full object-cover sm:h-[340px]"
                />
                <div className="space-y-2 p-5">
                  <h2 className="font-display text-2xl text-[#1f1812]">{image.title}</h2>
                  <p className="text-sm leading-7 text-[#5d5448]">{image.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
