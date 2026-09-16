import Link from 'next/link'
import { formatCategoryLabel } from '@/lib/categories'

type Product = {
  id: string
  slug?: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug ?? product.id}`} className="group block bg-[#232326] border border-[#F2F2F0]/10">
      <div className="aspect-square overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#F2F2F0]/30 text-sm bg-[#18181B]">
            Tidak ada foto
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs tracking-[0.15em] text-[#D65A3A] font-medium mb-2">
          {formatCategoryLabel(product.category).toUpperCase()}
        </p>

        <h3 className="text-lg font-medium text-[#F2F2F0] mb-1">{product.name}</h3>

        {product.description && (
          <p className="text-sm text-[#F2F2F0]/60 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <p className="text-[#F2F2F0] font-medium">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}