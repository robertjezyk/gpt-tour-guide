import { fetchUserTokensById } from "@/utils/actions";
import { UserProfile, auth } from "@clerk/nextjs";

const Profile = async () => {
  const { userId } = auth();
  const memberTokens = await fetchUserTokensById(userId);

  return (
    <div>
      <h2 className="mb-8 ml-8 text-xl font-extrabold">
        Token Amount: {memberTokens}
      </h2>
      <UserProfile />
    </div>
  );
};

export default Profile;
