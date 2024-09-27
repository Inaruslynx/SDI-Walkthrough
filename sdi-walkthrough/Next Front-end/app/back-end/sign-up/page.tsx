'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { createUser } from '@/lib/api';
import { toast } from 'react-toastify';
import { Theme, User } from '@/types';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';

export default function SignUpPage() {
    const {user} = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();

    
    const redirectUrl = searchParams.get('redirect_url')
    
    // Make api call to create user on database and create them with clerkID
    if (!user) {
        toast.error("Did not successfully create new user.")
        router.push("/sign-up")
    } else {
        const data: User = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress!,
            firstName: user.firstName!,
            lastName: user.lastName!,
            assignedWalkthroughs: [],
            admin: false,
            type: Theme.DARK,
        }
        
        const handleCreateNewUser = useMutation({
            mutationFn: async () => {
                return createUser(data);
            },
            onSuccess: (data) => {
                toast.success("Welcome to SDI Walkthrough!")
                if (redirectUrl) {
                    router.push(redirectUrl)
                } else {
                    router.push("/")
                }
            },
            onError: () => {
                toast.error("New account not added to Database.")
            router.push("/sign-up")
            }
        })

        handleCreateNewUser.mutate()
        
    }

}