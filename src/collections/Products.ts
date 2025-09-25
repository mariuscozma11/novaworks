import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'isActive'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Product name',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for this product',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              // Generate slug from name if not provided
              const nameValue =
                typeof data.name === 'string' ? data.name : data.name.ro || data.name.en
              return nameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Brief product description for listings',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: 'Product category',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Product price in RON',
        step: 0.01,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          localized: true,
          admin: {
            description: 'Alternative text for accessibility',
          },
        },
      ],
    },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'material',
          type: 'text',
          admin: {
            description: 'Print material used (e.g., PLA, PETG, ABS)',
          },
        },
        {
          name: 'dimensions',
          type: 'text',
          admin: {
            description: 'Product dimensions (L x W x H)',
          },
        },
        {
          name: 'weight',
          type: 'text',
          admin: {
            description: 'Product weight',
          },
        },
        {
          name: 'printTime',
          type: 'text',
          admin: {
            description: 'Approximate print time',
          },
        },
        {
          name: 'infill',
          type: 'text',
          admin: {
            description: 'Infill percentage used',
          },
        },
      ],
    },
    {
      name: 'customizable',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Can this product be customized?',
      },
    },
    {
      name: 'customizationOptions',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Available customization options',
        condition: (data) => data.customizable,
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this product currently in stock?',
      },
    },
    {
      name: 'stockQuantity',
      type: 'number',
      min: 0,
      admin: {
        description: 'Available quantity (leave empty for unlimited)',
        condition: (data) => data.inStock,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this product active and visible to customers?',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this product on the homepage?',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for better searchability',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure slug is always lowercase and URL-friendly
        if (data.slug) {
          data.slug = data.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
    ],
  },
}
