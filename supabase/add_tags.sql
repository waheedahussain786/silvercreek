-- Migration: add tags and product_tags tables
-- Run this against an existing Silver Creek database instance.

create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists product_tags (
  product_id uuid not null references products(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

alter table tags enable row level security;
alter table product_tags enable row level security;

create policy "public read tags" on tags for select using (true);
create policy "public read product_tags" on product_tags for select using (true);
