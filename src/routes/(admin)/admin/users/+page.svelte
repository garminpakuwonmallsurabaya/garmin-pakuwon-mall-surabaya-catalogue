
<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';
    import { refreshAll } from '$app/navigation';

    let { data, form }: PageProps = $props();

    let search = $state('');

    let filteredProfiles = $derived(
        data.profiles.filter((profile) =>
            `${profile.full_name} ${profile.role}`
                .toLowerCase()
                .includes(search.toLowerCase())
        )
    );
</script>

<svelte:head>
    <title>Manage Profiles · Garmin Pakuwon Mall Surabaya Admin</title>
</svelte:head>

<div class="space-y-7">
    <!-- Page Header -->
    <div>
        <div class="mb-2 flex items-center gap-2 text-[11px] font-medium text-[#96938b]">
            <span>Settings</span>
            <span>/</span>
            <span class="text-[#4b4943]">Manage Profiles</span>
        </div>

        <h1 class="font-serif text-[34px] leading-tight tracking-[-0.04em] sm:text-[40px]">
            Manage Profiles
        </h1>

        <p class="mt-2 text-sm text-[#85837c]">
            Manage user access and administrator roles.
        </p>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-black/[0.06] bg-white p-5">
            <div class="flex items-center justify-between">
                <span class="text-xs text-[#85837c]">Total profiles</span>
                <span class="rounded-lg bg-[#f4f1eb] p-2 text-[#8d6e4f]">
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7">
                        <circle cx="9" cy="8" r="3.5"/>
                        <path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20z"/>
                        <path d="M16 5a3.5 3.5 0 0 1 0 7m2 3a5 5 0 0 1 3.5 5"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-semibold tracking-tight">
                {data.profiles.length.toString().padStart(2, '0')}
            </p>
            <p class="mt-1 text-[11px] text-[#a09e97]">
                Registered accounts
            </p>
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-5">
            <div class="flex items-center justify-between">
                <span class="text-xs text-[#85837c]">Administrators</span>
                <span class="rounded-lg bg-[#eaf3ed] p-2 text-[#44785b]">
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7">
                        <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z"/>
                        <path d="m9 12 2 2 4-4"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-semibold tracking-tight">
                {data.profiles.filter((p) => p.role === 'admin').length.toString().padStart(2, '0')}
            </p>
            <p class="mt-1 text-[11px] text-[#a09e97]">
                Admin accounts
            </p>
        </div>

        <div class="rounded-2xl border border-black/[0.06] bg-white p-5">
            <div class="flex items-center justify-between">
                <span class="text-xs text-[#85837c]">Superusers</span>
                <span class="rounded-lg bg-[#f4f1eb] p-2 text-[#8d6e4f]">
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7">
                        <path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-semibold tracking-tight">
                {data.profiles.filter((p) => p.role === 'superuser').length.toString().padStart(2, '0')}
            </p>
            <p class="mt-1 text-[11px] text-[#a09e97]">
                Superuser accounts
            </p>
        </div>
    </div>

    <!-- Profiles List -->
    <section class="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
        <!-- Section Header -->
        <div class="flex flex-col gap-3 border-b border-black/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
                <h2 class="text-sm font-semibold">
                    All profiles
                    <span class="ml-1.5 rounded-md bg-[#f3f2ef] px-2 py-1 text-[10px] font-medium text-[#77756e]">
                        {filteredProfiles.length}
                    </span>
                </h2>
                <p class="mt-1 text-[11px] text-[#99978f]">
                    Manage account roles and access permissions.
                </p>
            </div>

            <label class="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-black/[0.08] px-3 sm:w-64">
                <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-[#99978f]" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="10.8" cy="10.8" r="6.8"/>
                    <path d="m16 16 4.5 4.5"/>
                </svg>
                <input
                    bind:value={search}
                    placeholder="Search profiles..."
                    class="min-w-0 w-full bg-transparent text-xs outline-none placeholder:text-[#aaa89f]"
                />
            </label>
        </div>

        {#if form?.error}
            <div class="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600" role="alert">
                {form.error}
            </div>
        {/if}

        {#if form?.success}
            <div class="mx-5 mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700" role="status">
                {form.message}
            </div>
        {/if}

        {#if data.error}
            <div class="p-8 text-center text-sm text-red-600">
                {data.error}
            </div>
        {:else}
            <!-- Desktop Table -->
            <div class="hidden overflow-x-auto md:block">
                <table class="w-full border-collapse text-left">
                    <thead>
                        <tr class="bg-[#faf9f7] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#929088]">
                            <th class="px-5 py-3.5">Full Name</th>
                            <th class="px-4 py-3.5">Role</th>
                            <th class="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each filteredProfiles as profile (profile.id)}
                            <tr class="border-t border-black/[0.055] transition hover:bg-[#fdfcfb]">
                                <td class="px-5 py-4">
                                    <p class="text-xs font-semibold text-[#33322f]">
                                        {profile.full_name}
                                    </p>
                                </td>

                                <td class="px-4 py-4">
                                    {#if profile.role === 'superuser'}
                                        <span class="inline-flex items-center gap-1.5 rounded-lg bg-[#f4f1eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#8b6844]">
                                            <svg viewBox="0 0 24 24" class="h-3 w-3" fill="currentColor">
                                                <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
                                            </svg>
                                            Superuser
                                        </span>
                                    {:else if profile.role === 'admin'}
                                        <span class="inline-flex items-center rounded-lg bg-[#eaf3ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#44785b]">
                                            Admin
                                        </span>
                                    {:else}
                                        <span class="inline-flex items-center rounded-lg bg-[#f3f2ef] px-2.5 py-1.5 text-[10px] font-semibold text-[#77756e]">
                                            User
                                        </span>
                                    {/if}
                                </td>

                                <td class="px-5 py-4">
                                    {#if profile.role !== 'superuser' && profile.id !== data.currentUserId}
                                        <form
                                            method="POST"
                                            action="?/updateRole"
                                            use:enhance={() => {
                                                return async ({ update }) => {
                                                    await update();
                                                    await refreshAll();
                                                };
                                            }}
                                            class="flex items-center justify-end gap-2"
                                        >
                                            <input
                                                type="hidden"
                                                name="userId"
                                                value={profile.id}
                                            />

                                            <select
                                                name="role"
                                                value={profile.role}
                                                aria-label={`Role for ${profile.full_name}`}
                                                class="h-9 rounded-lg border border-black/[0.08] bg-white px-3 text-xs text-[#55534e] outline-none transition focus:border-[#b68b65]"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>

                                            <button
                                                type="submit"
                                                disabled={profile.role === 'admin' && false}
                                                onclick={(event) => {
                                                    const formElement = event.currentTarget.form;
                                                    const select = formElement?.querySelector('select');
                                                    const originalRole = profile.role;

                                                    if (select?.value === originalRole) {
                                                        event.preventDefault();
                                                        return;
                                                    }

                                                    if (
                                                        originalRole === 'admin' &&
                                                        select?.value === 'user' &&
                                                        !confirm(`Remove administrator access from ${profile.full_name}?`)
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#222220] px-3 text-[11px] font-semibold text-white transition hover:bg-[#3a3935] active:scale-[0.98]"
                                            >
                                                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8">
                                                    <path d="m5 12 4 4L19 6"/>
                                                </svg>
                                                Save
                                            </button>
                                        </form>
                                    {:else}
                                        <div class="flex justify-end">
                                            <span class="text-[10px] text-[#aaa89f]">
                                                Protected account
                                            </span>
                                        </div>
                                    {/if}
                                </td>
                            </tr>
                        {:else}
                            <tr>
                                <td colspan="3" class="px-5 py-14 text-center">
                                    <p class="text-sm font-medium text-[#55534e]">
                                        No profiles found
                                    </p>
                                    <p class="mt-1 text-xs text-[#99978f]">
                                        Try another search term.
                                    </p>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <!-- Mobile List -->
            <div class="divide-y divide-black/[0.06] md:hidden">
                {#each filteredProfiles as profile (profile.id)}
                    <article class="space-y-3 p-4">
                        <div class="flex items-center justify-between gap-3">
                            <p class="min-w-0 truncate text-xs font-semibold text-[#33322f]">
                                {profile.full_name}
                            </p>

                            {#if profile.role === 'superuser'}
                                <span class="shrink-0 rounded-lg bg-[#f4f1eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#8b6844]">
                                    Superuser
                                </span>
                            {:else if profile.role === 'admin'}
                                <span class="shrink-0 rounded-lg bg-[#eaf3ed] px-2.5 py-1.5 text-[10px] font-semibold text-[#44785b]">
                                    Admin
                                </span>
                            {:else}
                                <span class="shrink-0 rounded-lg bg-[#f3f2ef] px-2.5 py-1.5 text-[10px] font-semibold text-[#77756e]">
                                    User
                                </span>
                            {/if}
                        </div>

                        {#if profile.role !== 'superuser' && profile.id !== data.currentUserId}
                            <form
                                method="POST"
                                action="?/updateRole"
                                use:enhance={() => {
                                    return async ({ update }) => {
                                        await update();
                                        await refreshAll();
                                    };
                                }}
                                class="flex items-center gap-2"
                            >
                                <input
                                    type="hidden"
                                    name="userId"
                                    value={profile.id}
                                />

                                <select
                                    name="role"
                                    value={profile.role}
                                    aria-label={`Role for ${profile.full_name}`}
                                    class="h-9 min-w-0 flex-1 rounded-lg border border-black/[0.08] bg-white px-3 text-xs text-[#55534e] outline-none focus:border-[#b68b65]"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <button
                                    type="submit"
                                    onclick={(event) => {
                                        const select = event.currentTarget.form?.querySelector('select');

                                        if (select?.value === profile.role) {
                                            event.preventDefault();
                                            return;
                                        }

                                        if (
                                            profile.role === 'admin' &&
                                            select?.value === 'user' &&
                                            !confirm(`Remove administrator access from ${profile.full_name}?`)
                                        ) {
                                            event.preventDefault();
                                        }
                                    }}
                                    class="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#222220] px-3 text-[11px] font-semibold text-white transition hover:bg-[#3a3935]"
                                >
                                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="m5 12 4 4L19 6"/>
                                    </svg>
                                    Save
                                </button>
                            </form>
                        {:else}
                            <p class="text-[10px] text-[#aaa89f]">
                                Protected account · Role cannot be changed
                            </p>
                        {/if}
                    </article>
                {:else}
                    <div class="p-10 text-center text-xs text-[#99978f]">
                        No profiles found.
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Footer -->
        <div class="flex flex-col gap-2 border-t border-black/[0.06] bg-[#fdfcfb] px-5 py-3.5 text-[10px] text-[#99978f] sm:flex-row sm:items-center sm:justify-between">
            <span>
                Showing
                <strong class="font-semibold text-[#5e5c56]">
                    {filteredProfiles.length}
                </strong>
                of {data.profiles.length} profiles
            </span>

            <span>Role management · Superuser access only</span>
        </div>
    </section>
</div>
