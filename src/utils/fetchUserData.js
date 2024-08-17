export const fetchUserData = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/users/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      const { firstName, lastName, userName, profileImage } = result.user;
      return { firstName, lastName, userName, profileImage };
    } else {
      console.error("Failed to fetch user data");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
