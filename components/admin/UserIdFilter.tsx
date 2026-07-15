'use client';

import { FormEvent } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserIdFilterProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
}

export function UserIdFilter({
  value,
  onChange,
  onSearch,
  onClear,
  loading = false,
  error,
  placeholder = 'شناسه کاربر (UUID)',
}: UserIdFilterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="pl-10 bg-muted/50 border-border font-mono text-sm"
            dir="ltr"
            autoComplete="off"
          />
        </div>
        <Button type="submit" className="btn-primary" disabled={loading || !value.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Search className="w-4 h-4 ml-2" />}
          جستجو
        </Button>
        {value && (
          <Button type="button" variant="outline" onClick={onClear} disabled={loading}>
            <X className="w-4 h-4 ml-2" />
            پاک کردن
          </Button>
        )}
      </form>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
