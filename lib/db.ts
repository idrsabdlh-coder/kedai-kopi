import { supabase } from './supabase'
import { supabaseAdmin } from './supabase-admin'
import type { SupabaseClient } from '@supabase/supabase-js'

export type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  stock?: number
}

export async function getAllProducts(category?: string) {
  let query = supabase.from('products').select('*')
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slugOrId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle()

  if (error) throw error
  return data as Product | null
}

export type OrderInput = {
  user_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  notes: string | null
  total_amount: number
  items: {
    product_id: string
    price: number
    quantity: number
  }[]
}

export async function createOrder(client: SupabaseClient, input: OrderInput) {
  const { data: order, error: orderError } = await client
    .from('orders')
    .insert({
      user_id: input.user_id,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      customer_address: input.customer_address,
      notes: input.notes,
      total_amount: input.total_amount,
      status: 'pending',
      payment_status: 'unpaid',
    })
    .select()
    .single()

  if (orderError || !order) throw orderError ?? new Error('Gagal membuat order')

  const { error: itemsError } = await client.from('order_items').insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }))
  )

  if (itemsError) {
    await client.from('orders').delete().eq('id', order.id)
    throw itemsError
  }

  return order as { id: string }
}

export type Order = {
  id: string
  user_id: string | null
  status: string
  total_amount: number
  midtrans_order_id: string | null
  payment_status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  notes: string | null
  created_at: string
}

export async function getOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data as Order | null
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Order[]
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data as Order
}