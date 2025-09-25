import { getPayload } from 'payload'
import config from '../payload.config'
import { seedCategories } from './categories'

const seed = async () => {
  const payload = await getPayload({
    config,
  })

  console.log('Starting database seeding...')

  try {
    await seedCategories(payload)
    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

seed()
