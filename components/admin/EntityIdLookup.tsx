'use client';

import { useState } from 'react';
import { UserIdFilter } from '@/components/admin/UserIdFilter';
import { isValidUuid } from '@/lib/identifiers';
import { getApiErrorMessage } from '@/services/api';

interface EntityIdLookupProps<T> {
  entityLabel: string;
  getById: (id: string) => Promise<T | null>;
  onResult: (item: T | null) => void;
  onClear: () => void;
}

export function EntityIdLookup<T>({
  entityLabel,
  getById,
  onResult,
  onClear,
}: EntityIdLookupProps<T>) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const id = query.trim();
    if (!isValidUuid(id)) {
      setError('شناسه باید یک UUID معتبر باشد');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const item = await getById(id);
      onResult(item);
      if (!item) {
        setError(`${entityLabel} با این شناسه پیدا نشد`);
      }
    } catch (lookupError) {
      onResult(null);
      setError(getApiErrorMessage(lookupError));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setError(null);
    onClear();
  };

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 mb-6">
      <div className="mb-3">
        <h3 className="font-medium">جستجو بر اساس شناسه {entityLabel}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          جستجو مستقیماً از اندپوینت اختصاصی شناسه انجام می‌شود.
        </p>
      </div>
      <UserIdFilter
        value={query}
        onChange={setQuery}
        onSearch={() => void handleSearch()}
        onClear={handleClear}
        loading={loading}
        error={error}
        placeholder={`شناسه ${entityLabel} (UUID)`}
      />
    </div>
  );
}
