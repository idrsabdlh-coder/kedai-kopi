'use client'

import { createContext, useContext, useSyncExternalStore, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const STORAGE_KEY = 'cart'
const EMPTY_CART: CartItem[] = []
const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedItems: CartItem[] = EMPTY_CART

function readCartSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY_CART
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedItems
  cachedRaw = raw
  if (!raw) {
    cachedItems = EMPTY_CART
    return cachedItems
  }
  try {
    const parsed = JSON.parse(raw)
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY_CART
  } catch {
    cachedItems = EMPTY_CART
  }
  return cachedItems
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

function writeCart(next: CartItem[]) {
  const serialized = JSON.stringify(next)
  cachedRaw = serialized
  cachedItems = next
  window.localStorage.setItem(STORAGE_KEY, serialized)
  listeners.forEach((listener) => listener())
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCartSnapshot, getServerSnapshot)

  function addItem(item: Omit<CartItem, 'quantity'>) {
    const current = readCartSnapshot()
    const existing = current.find((i) => i.id === item.id)
    const next = existing
      ? current.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...current, { ...item, quantity: 1 }]
    writeCart(next)
  }

  function removeItem(id: string) {
    const current = readCartSnapshot()
    writeCart(current.filter((i) => i.id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    const current = readCartSnapshot()
    writeCart(current.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  function clearCart() {
    writeCart([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart harus dipakai di dalam CartProvider')
  }
  return context
}
