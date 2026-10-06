import { AdminProduct, AdminUser } from '../services/admin.service';

export const normalizeFilter = (value?: string | null) => (value || '').trim().toLowerCase();
export const filterLabel = (value: string) => value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
export const defaultUserFilters = { search: '', role: '', gender: '', verified: '', subscription: '', from: '', to: '', sort: 'newest' };
export type UserFilters = typeof defaultUserFilters;
export const defaultProductFilters = { search: '', category: '', brand: '', gender: '', lens: '', currency: '', minPrice: '', maxPrice: '', sort: 'name-asc' };
export type ProductFilters = typeof defaultProductFilters;

export function filterUsers(users: AdminUser[], filters: UserFilters) {
  const search = normalizeFilter(filters.search);
  return users.filter((user) => {
    const date = user.createdAt ? new Date(user.createdAt) : null;
    // Match the administrator's local calendar dates, as displayed in the table.
    const day = date && !Number.isNaN(date.getTime())
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
    return (!search || normalizeFilter([user.firstName, user.lastName, user.email, user.phone, user.id].join(' ')).includes(search))
      && (!filters.role || normalizeFilter(user.role) === filters.role)
      && (!filters.gender || (normalizeFilter(user.gender) || 'unspecified') === filters.gender)
      && (!filters.verified || Boolean(user.isVerified) === (filters.verified === 'yes'))
      && (!filters.subscription || Boolean(user.isSubscribed) === (filters.subscription === 'yes'))
      && (!filters.from || (!!day && day >= filters.from))
      && (!filters.to || (!!day && day <= filters.to));
  }).sort((a, b) => {
    if (filters.sort.startsWith('name')) {
      const name = (user: AdminUser) => `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '';
      return name(a).localeCompare(name(b), undefined, { sensitivity: 'base' }) * (filters.sort === 'name-desc' ? -1 : 1);
    }
    const first = Date.parse(a.createdAt) || 0, second = Date.parse(b.createdAt) || 0;
    return (first - second) * (filters.sort === 'oldest' ? 1 : -1);
  });
}

export function filterProducts(products: AdminProduct[], filters: ProductFilters) {
  const search = normalizeFilter(filters.search);
  return products.filter((product) => {
    const price = Number(product.price);
    return (!search || normalizeFilter([product.name, product.brand, product.category?.name, product.description, product.id].join(' ')).includes(search))
      && (!filters.category || (product.category_id || product.category?.id || 'uncategorized') === filters.category)
      && (!filters.brand || normalizeFilter(product.brand) === normalizeFilter(filters.brand))
      && (!filters.gender || (normalizeFilter(product.gender) || 'unspecified') === filters.gender)
      && (!filters.lens || Boolean(product.lens_id?.trim()) === (filters.lens === 'ready'))
      && (!filters.currency || normalizeFilter(product.currency) === normalizeFilter(filters.currency))
      && (!filters.minPrice || (Number.isFinite(price) && price >= Number(filters.minPrice)))
      && (!filters.maxPrice || (Number.isFinite(price) && price <= Number(filters.maxPrice)));
  }).sort((a, b) => {
    if (filters.sort.startsWith('price')) {
      const first = Number(a.price), second = Number(b.price);
      if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
      if (!Number.isFinite(second)) return -1;
      return (first - second) * (filters.sort === 'price-desc' ? -1 : 1);
    }
    return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base', numeric: true }) * (filters.sort === 'name-desc' ? -1 : 1);
  });
}
