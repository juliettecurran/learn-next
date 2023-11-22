// This is a Client Component, which means you can use event listeners and hooks.
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    /*  URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters.
        Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a */
    {
      console.log(
        '%cjuliette',
        'background-color: #2db173; color: white; font-family:monospace; font-size: 20px',
        `Searching ${term}`,
      );
    }

    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // when the user types a new search query, you want to reset the page number to 1
    if (term) {
      params.set('query', term); // set the params string based on the user’s input
    } else {
      params.delete('query'); // If the input is empty, you want to delete it
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        //  ensure the input field is in sync with the URL and will be populated when sharing, you can pass a defaultValue to input by reading from searchParams
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
