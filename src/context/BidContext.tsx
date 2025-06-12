import { createContext, use, useEffect, useReducer, useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaginationState, RowSelectionState } from '@tanstack/react-table'
import type { Bid, BidItem, BidTemplate } from '@/lib/types/bid-types'

interface BidContextType {
  bids: Array<Bid>
  selectedBid: Bid | null
  bidItems: Array<BidItem>
  bidTemplates: Array<BidTemplate>
  rowSelection: RowSelectionState
  pagination: PaginationState
  columnFilters: Array<{ id: string; value: any }>
  isLoading: boolean

  // Actions
  setSelectedBid: (bid: Bid | null) => void
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  updateBid: (updatedBid: Partial<Bid> & { id: string }) => void
  deleteBids: (bidIds: Array<string>) => void
  createBid: (newBid: Omit<Bid, 'id' | 'createdAt' | 'updatedAt'>) => void
  addBidItem: (newItem: Omit<BidItem, 'id'>) => void
  updateBidItem: (itemId: string, updates: Partial<BidItem>) => void
  removeBidItem: (itemId: string) => void
  applyTemplate: (templateId: string, bidId: string) => void
  filterChange: (id: string, value: any) => void
  clearFilters: (id?: string) => void
}

// Initial state
const initialState = {
  bids: [],
  selectedBid: null,
  bidItems: [],
  bidTemplates: [],
  rowSelection: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  columnFilters: [],
  isLoading: false,
}

// Actions
type BidAction =
  | { type: 'SET_BIDS'; payload: Array<Bid> }
  | { type: 'SET_SELECTED_BID'; payload: Bid | null }
  | { type: 'SET_BID_ITEMS'; payload: Array<BidItem> }
  | { type: 'SET_BID_TEMPLATES'; payload: Array<BidTemplate> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'FILTER_CHANGE'; payload: { id: string; value: any } }
  | { type: 'CLEAR_FILTERS'; payload?: string }

// Reducer
function bidReducer(state, action: BidAction) {
  switch (action.type) {
    case 'SET_BIDS':
      return { ...state, bids: action.payload }
    case 'SET_SELECTED_BID':
      return { ...state, selectedBid: action.payload }
    case 'SET_BID_ITEMS':
      return { ...state, bidItems: action.payload }
    case 'SET_BID_TEMPLATES':
      return { ...state, bidTemplates: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'FILTER_CHANGE':
      return {
        ...state,
        columnFilters: state.columnFilters
          .filter((filter) => filter.id !== action.payload.id)
          .concat({ id: action.payload.id, value: action.payload.value }),
      }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        columnFilters: action.payload
          ? state.columnFilters.filter((filter) => filter.id !== action.payload)
          : [],
      }
    default:
      return state
  }
}

// Context
const BidContext = createContext<BidContextType | null>(null)

// Provider
export function BidProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [state, dispatch] = useReducer(bidReducer, initialState)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Queries
  const { data: bids, isLoading: bidsLoading } = useQuery({
    queryKey: ['bids', state.columnFilters],
    queryFn: () => fetchBids(state.columnFilters),
  })

  const { data: templates } = useQuery({
    queryKey: ['bidTemplates'],
    queryFn: fetchBidTemplates,
  })

  // Bid item query (only when a bid is selected)
  const { data: bidItems } = useQuery({
    queryKey: ['bidItems', state.selectedBid?.id],
    queryFn: () =>
      state.selectedBid ? fetchBidItems(state.selectedBid.id) : [],
    enabled: !!state.selectedBid,
  })

  // Mutations
  const { mutate: createBidMutation } = useMutation({
    mutationFn: createBidApi,
    onSuccess: () => {
      toast.success('Bid created successfully')
      queryClient.invalidateQueries({ queryKey: ['bids'] })
    },
    onError: (error) => {
      toast.error(`Failed to create bid: ${error.message}`)
    },
  })

  const { mutate: updateBidMutation } = useMutation({
    mutationFn: updateBidApi,
    onSuccess: () => {
      toast.success('Bid updated successfully')
      queryClient.invalidateQueries({ queryKey: ['bids'] })
    },
    onError: (error) => {
      toast.error(`Failed to update bid: ${error.message}`)
    },
  })

  const { mutate: deleteBidsMutation } = useMutation({
    mutationFn: deleteBidsApi,
    onSuccess: () => {
      toast.success('Bid(s) deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['bids'] })
      setRowSelection({})
    },
    onError: (error) => {
      toast.error(`Failed to delete bid(s): ${error.message}`)
    },
  })

  // Bid item mutations
  const { mutate: addBidItemMutation } = useMutation({
    mutationFn: addBidItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bidItems', state.selectedBid?.id],
      })
    },
  })

  const { mutate: updateBidItemMutation } = useMutation({
    mutationFn: updateBidItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bidItems', state.selectedBid?.id],
      })
    },
  })

  const { mutate: removeBidItemMutation } = useMutation({
    mutationFn: removeBidItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bidItems', state.selectedBid?.id],
      })
    },
  })

  // Template application mutation
  const { mutate: applyTemplateMutation } = useMutation({
    mutationFn: applyTemplateApi,
    onSuccess: () => {
      toast.success('Template applied successfully')
      queryClient.invalidateQueries({
        queryKey: ['bidItems', state.selectedBid?.id],
      })
    },
    onError: (error) => {
      toast.error(`Failed to apply template: ${error.message}`)
    },
  })

  // Effects to update state from queries
  useEffect(() => {
    if (bids) dispatch({ type: 'SET_BIDS', payload: bids })
  }, [bids])

  useEffect(() => {
    if (templates) dispatch({ type: 'SET_BID_TEMPLATES', payload: templates })
  }, [templates])

  useEffect(() => {
    if (bidItems) dispatch({ type: 'SET_BID_ITEMS', payload: bidItems })
  }, [bidItems])

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: bidsLoading })
  }, [bidsLoading])

  // Action methods
  function setSelectedBid(bid: Bid | null) {
    dispatch({ type: 'SET_SELECTED_BID', payload: bid })
  }

  function createBid(newBid: Omit<Bid, 'id' | 'createdAt' | 'updatedAt'>) {
    createBidMutation(newBid)
  }

  function updateBid(updatedBid: Partial<Bid> & { id: string }) {
    updateBidMutation(updatedBid)
  }

  function deleteBids(bidIds: Array<string>) {
    deleteBidsMutation(bidIds)
  }

  function addBidItem(newItem: Omit<BidItem, 'id'>) {
    addBidItemMutation(newItem)
  }

  function updateBidItem(itemId: string, updates: Partial<BidItem>) {
    updateBidItemMutation({ id: itemId, ...updates })
  }

  function removeBidItem(itemId: string) {
    removeBidItemMutation(itemId)
  }

  function applyTemplate(templateId: string, bidId: string) {
    applyTemplateMutation({ templateId, bidId })
  }

  function filterChange(id: string, value: any) {
    dispatch({ type: 'FILTER_CHANGE', payload: { id, value } })
  }

  function clearFilters(id?: string) {
    dispatch({ type: 'CLEAR_FILTERS', payload: id })
  }

  const value = {
    ...state,
    rowSelection,
    pagination,
    setSelectedBid,
    setRowSelection,
    setPagination,
    createBid,
    updateBid,
    deleteBids,
    addBidItem,
    updateBidItem,
    removeBidItem,
    applyTemplate,
    filterChange,
    clearFilters,
  }

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>
}

// Hook
export function useBid() {
  const context = use(BidContext)
  if (context === null) {
    throw new Error('useBid must be used within a BidProvider')
  }
  return context
}

// API functions - to be implemented with your actual API endpoints
async function fetchBids(filters: Array<{ id: string; value: any }>) {
  // TODO: Implement actual API call
  return []
}

async function fetchBidItems(bidId: string) {
  // TODO: Implement actual API call
  return []
}

async function fetchBidTemplates() {
  // TODO: Implement actual API call
  return []
}

async function createBidApi(bid: Omit<Bid, 'id' | 'createdAt' | 'updatedAt'>) {
  // TODO: Implement actual API call
}

async function updateBidApi(bid: Partial<Bid> & { id: string }) {
  // TODO: Implement actual API call
}

async function deleteBidsApi(bidIds: Array<string>) {
  // TODO: Implement actual API call
}

async function addBidItemApi(item: Omit<BidItem, 'id'>) {
  // TODO: Implement actual API call
}

async function updateBidItemApi(item: Partial<BidItem> & { id: string }) {
  // TODO: Implement actual API call
}

async function removeBidItemApi(itemId: string) {
  // TODO: Implement actual API call
}

async function applyTemplateApi({
  templateId,
  bidId,
}: {
  templateId: string
  bidId: string
}) {
  // TODO: Implement actual API call
}
