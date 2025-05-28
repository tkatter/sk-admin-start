// Core bid status options
export type BidStatus =
  | 'draft'
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'in-review'

// Base bid interface
export interface Bid {
  id: string
  status: BidStatus
  jobName: string
  clientName: string
  contactPhone?: string
  contactEmail?: string
  location: string
  startDate: Date | null
  endDate: Date | null
  bidAmount: number
  createdAt: Date
  updatedAt: Date
  notes?: string
}

// Bid item within a bid
export interface BidItem {
  id: string
  bidId: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  notes?: string
  templateItemId?: string // Reference to template item if from template
}

// Bid template
export interface BidTemplate {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Template item
export interface TemplateItem {
  id: string
  templateId: string
  name: string
  unitPrice: number
  unitType: 'sqft' | 'linearft' | 'each' | 'hour' | 'custom'
  category: string
  description?: string
}

// File attachment
export interface BidAttachment {
  id: string
  bidId: string
  filename: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: Date
}
