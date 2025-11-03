"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Profile from "@/components/Profile";
import { fetchUser } from "@/api-services/user";
const UserProfile = ({ userID, edit }: { userID: string, edit: boolean }) => {
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => fetchUser(userID),
        placeholderData: keepPreviousData,
    });
    return (
        <div className="mx-auto max-w-242.5">
            <Profile user={data} loading={isFetching} edit={edit} />
        </div>
    );
};

export default UserProfile;
