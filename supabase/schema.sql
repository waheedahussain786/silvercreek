-- Silver Creek Boutique — database schema

create extension if not exists "uuid-ossp";

-- Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),        -- crossed-out "original" price
  images text[] not null default '{}',   -- array of Supabase storage URLs
  has_sizes boolean not null default false,
  sizes text[] not null default '{}',    -- e.g. ['XS','S','M','L','XL']
  quantity integer not null default 0,   -- total stock (if no sizes)
  is_active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Per-size inventory (used when has_sizes = true)
create table product_size_inventory (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  quantity integer not null default 0,
  unique(product_id, size)
);

-- Tags
create table tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Product-Tag join table
create table product_tags (
  product_id uuid not null references products(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  stripe_payment_intent_id text unique,
  stripe_session_id text unique,
  status text not null default 'pending'
    check (status in ('pending','paid','shipped','cancelled')),
  customer_name text not null,
  customer_email text not null,
  shipping_address jsonb not null,  -- {line1, line2, city, state, postal_code, country}
  shipping_rate numeric(10,2) not null default 0,
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order line items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,   -- snapshot at time of purchase
  product_image text,
  size text,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

-- Store settings (single row)
create table store_settings (
  id integer primary key default 1 check (id = 1),  -- enforces single row
  shipping_rate numeric(10,2) not null default 8.00,
  free_shipping_threshold numeric(10,2),             -- null = never free
  store_announcement text,                           -- shown on homepage banner
  updated_at timestamptz not null default now()
);

insert into store_settings (id) values (1) on conflict do nothing;

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger products_updated_at before update on products
  for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();
create trigger store_settings_updated_at before update on store_settings
  for each row execute function set_updated_at();

-- RLS: public can read active products and categories
alter table categories enable row level security;
alter table products enable row level security;
alter table product_size_inventory enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table store_settings enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read active products" on products for select using (is_active = true);

alter table tags enable row level security;
alter table product_tags enable row level security;
create policy "public read tags" on tags for select using (true);
create policy "public read product_tags" on product_tags for select using (true);
create policy "public read size inventory" on product_size_inventory for select using (true);
create policy "public read settings" on store_settings for select using (true);

-- Service role (used by admin API routes) bypasses RLS automatically
