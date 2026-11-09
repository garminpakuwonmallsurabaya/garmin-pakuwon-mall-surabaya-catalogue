
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect(303, '/auth/login');
    }

    // Ensure only superusers can access this page
    const { data: isSuperuser, error: roleError } =
        await supabase.rpc('is_superuser');

    if (roleError || !isSuperuser) {
        redirect(303, '/');
    }

    // Fetch all profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Failed to fetch profiles:', error);

        return {
            profiles: [],
            currentUserId: user.id,
            error: 'Failed to load profiles.'
        };
    }

    return {
        profiles: profiles ?? [],
        currentUserId: user.id
    };
};

export const actions: Actions = {
    updateRole: async ({ request, locals: { supabase } }) => {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            redirect(303, '/auth/login');
        }

        // Verify superuser permission again on the server
        const { data: isSuperuser, error: roleError } =
            await supabase.rpc('is_superuser');

        if (roleError || !isSuperuser) {
            return fail(403, {
                error: 'You are not authorized to manage profiles.'
            });
        }

        const formData = await request.formData();

        const userId = formData.get('userId')?.toString();
        const newRole = formData.get('role')?.toString();

        if (!userId || !newRole) {
            return fail(400, {
                error: 'Invalid profile information.'
            });
        }

        if (!['user', 'admin'].includes(newRole)) {
            return fail(400, {
                error: 'Invalid role selected.'
            });
        }

        // Prevent modifying your own superuser account
        if (userId === user.id) {
            return fail(400, {
                error: 'You cannot change your own role.'
            });
        }

        // Use the SECURITY DEFINER RPC
        const { error } = await supabase.rpc('set_user_role', {
            target_user_id: userId,
            new_role: newRole
        });

        if (error) {
            console.error('Failed to update role:', error);

            return fail(400, {
                error: error.message
            });
        }

        return {
            success: true,
            message: 'Profile role updated successfully.'
        };
    }
};
