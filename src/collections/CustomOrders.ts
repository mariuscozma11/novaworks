import type { CollectionConfig } from 'payload'

export const CustomOrders: CollectionConfig = {
  slug: 'custom-orders',
  admin: {
    useAsTitle: 'projectName',
    defaultColumns: ['projectName', 'customerName', 'status', 'createdAt'],
    group: 'Orders',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => {
      // Only allow admins to update orders
      return Boolean(user)
    },
    delete: ({ req: { user } }) => {
      // Only allow admins to delete orders
      return Boolean(user)
    },
  },
  fields: [
    // Customer Information
    {
      name: 'customerName',
      type: 'text',
      required: true,
      localized: false,
      admin: {
        description: 'Full name of the customer',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'customerPhone',
      type: 'text',
      admin: {
        description: 'Customer phone number',
      },
    },

    // Project Details
    {
      name: 'projectName',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal project name (auto-generated if not provided)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.customerName) {
              // Generate project name from customer name and timestamp
              const timestamp = new Date().toISOString().slice(0, 10)
              return `${data.customerName} - ${timestamp}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'projectDescription',
      type: 'textarea',
      required: true,
      localized: false,
      admin: {
        description: 'Detailed description of what needs to be printed',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      admin: {
        description: 'Number of pieces to print',
      },
    },
    {
      name: 'preferredDeadline',
      type: 'date',
      admin: {
        description: 'Customer preferred delivery date',
      },
    },
    {
      name: 'additionalNotes',
      type: 'textarea',
      admin: {
        description: 'Additional requirements, color preferences, etc.',
      },
    },

    // Material Selection
    {
      name: 'preferredMaterial',
      type: 'select',
      options: [
        {
          label: 'PLA',
          value: 'pla',
        },
        {
          label: 'PETG',
          value: 'petg',
        },
        {
          label: 'ABS',
          value: 'abs',
        },
        {
          label: 'TPU',
          value: 'tpu',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'Customer preferred printing material',
      },
    },

    // CAD Files
    {
      name: 'cadFiles',
      type: 'array',
      label: 'CAD Files',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: {
              in: [
                'model/stl',
                'application/octet-stream', // STL files often have this MIME type
                'model/obj',
                'application/3mf',
                'model/ply',
              ],
            },
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Optional description of this file',
          },
        },
      ],
      admin: {
        description: 'Upload STL, OBJ, 3MF, or PLY files',
      },
    },

    // Pricing & Quote Information
    {
      name: 'estimatedVolume',
      type: 'number',
      admin: {
        description: 'Estimated print volume in cm³ (calculated from CAD files)',
        condition: (data, siblingData) => {
          // Only show this field for admins
          return false // Hide from public forms
        },
      },
    },
    {
      name: 'estimatedWeight',
      type: 'number',
      admin: {
        description: 'Estimated material weight in grams',
        condition: (data, siblingData) => {
          return false // Hide from public forms
        },
      },
    },
    {
      name: 'estimatedPrintTime',
      type: 'text',
      admin: {
        description: 'Estimated print time (e.g., "5 hours")',
        condition: (data, siblingData) => {
          return false // Hide from public forms
        },
      },
    },
    {
      name: 'quotedPrice',
      type: 'number',
      admin: {
        description: 'Final quoted price in RON',
        condition: (data, siblingData) => {
          return false // Hide from public forms
        },
      },
    },
    {
      name: 'quoteNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about pricing calculations',
        condition: (data, siblingData) => {
          return false // Hide from public forms
        },
      },
    },

    // Order Status & Workflow
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending Review',
          value: 'pending',
        },
        {
          label: 'Under Analysis',
          value: 'analyzing',
        },
        {
          label: 'Quote Sent',
          value: 'quoted',
        },
        {
          label: 'Quote Approved',
          value: 'approved',
        },
        {
          label: 'In Production',
          value: 'printing',
        },
        {
          label: 'Quality Check',
          value: 'quality_check',
        },
        {
          label: 'Ready for Delivery',
          value: 'ready',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        description: 'Current status of the custom order',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for production team',
        condition: (data, siblingData) => {
          return false // Hide from public forms
        },
      },
    },

    // Communication Log
    {
      name: 'communications',
      type: 'array',
      admin: {
        description: 'Log of communications with customer',
        condition: (data, siblingData) => {
          return false // Hide from public forms
        },
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Email Sent', value: 'email_sent' },
            { label: 'Email Received', value: 'email_received' },
            { label: 'Phone Call', value: 'phone_call' },
            { label: 'Quote Sent', value: 'quote_sent' },
            { label: 'Payment Received', value: 'payment_received' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          required: true,
        },
      ],
    },

    // Delivery Information
    {
      name: 'deliveryAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            description: 'Postal code',
          },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'România',
          admin: {
            description: 'Country',
          },
        },
      ],
      admin: {
        condition: (data, siblingData) => {
          return false // Hide from public forms initially
        },
      },
    },

    // Tracking
    {
      name: 'orderNumber',
      type: 'text',
      admin: {
        description: 'Unique order number for tracking',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              // Generate order number: NW + year + month + random 4 digits
              const now = new Date()
              const year = now.getFullYear().toString().slice(-2)
              const month = (now.getMonth() + 1).toString().padStart(2, '0')
              const random = Math.floor(1000 + Math.random() * 9000)
              return `NW${year}${month}${random}`
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set projectName if not provided
        if (operation === 'create' && !data.projectName && data.customerName) {
          const timestamp = new Date().toISOString().slice(0, 10)
          data.projectName = `${data.customerName} - ${timestamp}`
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // TODO: Send email notifications when status changes
        if (operation === 'create') {
          console.log(`New custom order created: ${doc.orderNumber}`)
        }
      },
    ],
  },
}