import type { Payload } from 'payload'

export const seedCategories = async (payload: Payload) => {
  const categoriesData = [
    {
      name: 'Home Decor',
      slug: 'home-decor',
      description: '3D printed decorations and home accessories',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Gadgets',
      slug: 'gadgets',
      description: 'Practical 3D printed gadgets and accessories',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Toys',
      slug: 'toys',
      description: '3D printed toys and figurines',
      isActive: true,
      sortOrder: 3,
    },
    {
      name: 'Organization',
      slug: 'organization',
      description: '3D printed organization and storage solutions',
      isActive: true,
      sortOrder: 4,
    },
    {
      name: 'Custom',
      slug: 'custom',
      description: 'Custom 3D printed products made to order',
      isActive: true,
      sortOrder: 5,
    },
  ]

  console.log('Seeding categories...')

  try {
    // Check if categories already exist
    const existingCategories = await payload.find({
      collection: 'categories',
      limit: 1,
    })

    if (existingCategories.totalDocs > 0) {
      console.log('Categories already exist, skipping seed...')
      return
    }

    // Create categories
    for (const categoryData of categoriesData) {
      await payload.create({
        collection: 'categories',
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          isActive: categoryData.isActive,
          sortOrder: categoryData.sortOrder,
        },
      })

      console.log(`Created category: ${categoryData.slug}`)
    }

    console.log('Categories seeded successfully!')
  } catch (error) {
    console.error('Error seeding categories:', error)
    throw error
  }
}
