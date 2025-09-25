// API utilities for custom orders

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface CustomOrderSubmission {
  customerName: string
  customerEmail: string
  customerPhone?: string
  projectDescription: string
  quantity: number
  preferredDeadline?: string
  additionalNotes?: string
  preferredMaterial?: 'pla' | 'petg' | 'abs' | 'tpu' | 'other'
  cadFiles?: File[]
}

export async function submitCustomOrder(orderData: CustomOrderSubmission): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // First, upload files if any
    const cadFiles = []
    if (orderData.cadFiles && orderData.cadFiles.length > 0) {
      for (const file of orderData.cadFiles) {
        try {
          const uploadedFile = await uploadCadFile(file)
          if (uploadedFile) {
            cadFiles.push({
              file: uploadedFile.id,
              description: file.name
            })
          }
        } catch (uploadError) {
          console.error('Error uploading file:', file.name, uploadError)
          // Continue with other files even if one fails
        }
      }
    }

    // Create the custom order
    const orderPayload = {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || undefined,
      projectDescription: orderData.projectDescription,
      quantity: parseInt(orderData.quantity.toString()),
      preferredDeadline: orderData.preferredDeadline || undefined,
      additionalNotes: orderData.additionalNotes || undefined,
      preferredMaterial: orderData.preferredMaterial || undefined,
      cadFiles: cadFiles.length > 0 ? cadFiles : undefined,
      status: 'pending'
    }

    const response = await fetch(`${API_BASE_URL}/api/custom-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const result = await response.json()
    return {
      success: true,
      orderId: result.doc?.orderNumber || result.doc?.id
    }

  } catch (error) {
    console.error('Error submitting custom order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

async function uploadCadFile(file: File): Promise<{ id: string; url: string } | null> {
  try {
    // Validate file type
    const validExtensions = ['stl', 'obj', '3mf', 'ply']
    const extension = file.name.toLowerCase().split('.').pop()
    if (!extension || !validExtensions.includes(extension)) {
      throw new Error(`Invalid file type: ${extension}`)
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new Error('File too large (max 50MB)')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/media`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Upload failed: HTTP ${response.status}`)
    }

    const result = await response.json()
    return {
      id: result.doc.id,
      url: result.doc.url
    }

  } catch (error) {
    console.error('Error uploading CAD file:', error)
    throw error
  }
}

export async function getCustomOrderStatus(orderNumber: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/custom-orders?where[orderNumber][equals]=${orderNumber}&limit=1`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    return result.docs[0] || null

  } catch (error) {
    console.error('Error fetching custom order status:', error)
    return null
  }
}

export const MATERIAL_INFO = {
  pla: {
    name: 'PLA',
    price: '5 RON/100g',
    description: 'Ușor de imprimat, biodegradabil',
    colors: ['Alb', 'Negru', 'Roșu', 'Albastru', 'Verde', 'Galben', 'Portocaliu']
  },
  petg: {
    name: 'PETG',
    price: '7 RON/100g',
    description: 'Rezistent la impact, transparent',
    colors: ['Transparent', 'Negru', 'Alb', 'Roșu', 'Albastru']
  },
  abs: {
    name: 'ABS',
    price: '6 RON/100g',
    description: 'Durabil, rezistent la căldură',
    colors: ['Negru', 'Alb', 'Roșu', 'Albastru', 'Verde']
  },
  tpu: {
    name: 'TPU',
    price: '12 RON/100g',
    description: 'Flexibil, elastic',
    colors: ['Negru', 'Alb', 'Roșu', 'Albastru', 'Transparent']
  }
} as const