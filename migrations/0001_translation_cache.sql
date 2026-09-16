-- Durable NMT cache for AI-generated commentary card fields (EN→ES).
-- Keyed by content hash + engine + target locale so we do not re-bill Google.
create table if not exists translation_cache (
  content_hash text not null,
  engine text not null,
  target_locale text not null,
  source_locale text not null default 'en',
  translated text not null,
  created_at timestamptz not null default now(),
  primary key (content_hash, engine, target_locale)
);

create index if not exists translation_cache_created_at_idx
  on translation_cache (created_at);
