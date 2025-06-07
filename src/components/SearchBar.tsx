'use client';

import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Prisma, Subgrenddit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Users } from "lucide-react";

export default function SearchBar() {
    const [Input, setInput] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    useOnClickOutside(ref, () => {
        setInput('');
    });

    const request = debounce(async () => {
        if (Input.trim().length === 0) return; // Prevent API calls when Input is empty
        refetch();
    }, 300);

    const debounceRequest = useCallback(() => {
        request();
    }, []);

    const { isFetched, isFetching, refetch, data: preresult } = useQuery({
        queryFn: async () => {
            if(Input.trim().length===0) return []
            const { data } = await axios.get(`/api/search?q=${Input}`);
            return data as (Subgrenddit & {
                _count: Prisma.SubgrendditCountOutputType;
            })[];
        },
        queryKey: ['search-query', Input],
        enabled: Input.trim().length > 0, // Enable only when Input is non-empty
    });

    const result = Array.isArray(preresult) ? preresult: [];

    useEffect(() => {
        setInput('');
        refetch({ cancelRefetch: true });
    }, [pathname]);

    return (
        <Command ref={ref} className="relative rounded-lg border max-w-lg z-50 overflow-visible">
            <CommandInput
                onValueChange={(text) => {
                    setInput(text);
                    debounceRequest();
                }}
                value={Input}
                className="outline-none border-none focus:border-none focus:outline-none ring-0"
                placeholder="Search"
                isLoading={isFetching}
            />
            {result!==undefined ? (
                <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
                    {isFetched && result?.length === 0 && Input!='' && <CommandEmpty>No results found.</CommandEmpty>}
                    {(result?.length ?? 0) > 0 && (
                        <CommandGroup heading="Communities">
                            {(result ?? []).map((subgrenddit) => (
                                <CommandItem
                                    onSelect={() => {
                                        router.push(`/g/${subgrenddit.name}`);
                                        router.refresh();
                                    }}
                                    key={subgrenddit.id}
                                    value={subgrenddit.name}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    <a href={`/g/${subgrenddit.name}`}>g/{subgrenddit.name}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            ): null}
        </Command>
    );
}
