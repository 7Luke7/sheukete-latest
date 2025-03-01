export const getTimeAgo = (createdAt) => {
    const now = new Date();
    const creationDate = new Date(createdAt);
  
    const diffInMs = now - creationDate;
  
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);
  
    if (diffInYears > 0) {
      return `${diffInYears} წლის უკან`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} თვის უკან`;
    } else if (diffInDays > 0) {
      return `${diffInDays} დღის უკან`;
    } else if (diffInHours > 0) {
      return `${diffInHours} საათის უკან`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} წუთის უკან`;
    } else {
      return `${diffInSeconds} წამის უკან`;
    }
  }

export const accept_request = async (id, friend_request_id) => {
    try {
      const response = await fetch(
        `http://localhost:4321/accept/friend`,
        {
          method: "POST",
          body: JSON.stringify({
            friend_request_id: friend_request_id,
            notification_id: id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      // we could return the status code straight up without eve
      return response.status
    } catch (error) {
      console.log(error);
    }
  };

export const reject_request = async (friend_request_id) => {
    // we could make an animation of rejecting people friend requests later
    try {
      const response = await fetch(`http://localhost:4321/friend/cancel`, {
        method: "POST",
        body: JSON.stringify({
          friend_request_id: friend_request_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return response.status
    } catch (error) {
      console.log(error);
    }
  };