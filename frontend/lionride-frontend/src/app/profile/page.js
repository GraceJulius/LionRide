
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // For redirecting on logout or token expiration
import { Image } from "next/image";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState(""); // For image upload errors
  const fileInputRef = useRef(null); // To trigger file input click
  const router = useRouter();

  // Subtask 4.1: Retrieve the stored ID token upon loading
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          router.push("/login"); // Redirect to login if no token
          return;
        }

        // Subtask 4.2: Send GET request with token in Authorization header
        const response = await fetch("/api/v1/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Subtask 4.4: Handle errors gracefully
        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token"); // Clear invalid token
            router.push("/login");
            return;
          } else if (response.status === 404) {
            throw new Error("User not found.");
          } else {
            throw new Error("Failed to fetch profile.");
          }
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, [router]);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Optional: Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload a valid image (JPEG, PNG, or GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError("Image size must be less than 5MB.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Send the image to the backend
      const response = await fetch("/api/v1/users/profile/picture", {
        method: "PUT", // Or POST, depending on your backend
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUploadError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to upload image.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update the user state with the new profile data (including the image URL)
      setUploadError(""); // Clear any previous upload errors
    } catch (err) {
      setUploadError(err.message);
    }
  };

  // Trigger file input click when the avatar is clicked
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    router.push("/login"); // Redirect to login page
  };

  // Loading or error state
  if (!user && error) {
    return <p className="text-destructive text-center p-5">{error}</p>;
  }

  if (!user) {
    return <p className="text-muted-foreground text-center p-5">Loading...</p>;
  }

  // Subtask 4.3: Display user profile data
  return (
    <div className="max-w-md mx-auto p-5 bg-background min-h-screen">
      <div className="text-center mb-5">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
      </div>
      <div className="profile-avatar relative mx-auto mb-5 cursor-pointer w-fit" onClick={handleAvatarClick}>
        <Image
          src={user.avatarUrl || ""}
          alt="Profile Avatar"
          className="w-20 h-20 rounded-full border-2 border-border object-cover"
        />
        <div className="profile-edit-overlay">
          <span className="text-white text-xs text-center">Change Photo</span>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
        />
      </div>
      {uploadError && (
        <p className="text-destructive text-center mb-2.5 text-sm">{uploadError}</p>
      )}
      <h2 className="text-center text-xl font-medium text-foreground mb-5">
        {user.firstName} {user.lastName}
      </h2>
      <div className="bg-card rounded-lg p-5 shadow-sm">
        <div className="flex justify-between py-2.5 border-b border-border last:border-b-0">
          <span className="font-medium text-muted-foreground">Email</span>
          <span className="text-foreground">{user.email}</span>
        </div>
        <div className="flex justify-between py-2.5 border-b border-border last:border-b-0">
          <span className="font-medium text-muted-foreground">User Type</span>
          <span className="text-foreground">{user.userType}</span>
        </div>
        <div className="flex justify-between py-2.5 border-b border-border last:border-b-0">
          <span className="font-medium text-muted-foreground">Verification Status</span>
          <span className="text-foreground">
            {user.verificationStatus ? "Verified" : "Not Verified"}
          </span>
        </div>
        {user.mobileNumber && (
          <div className="flex justify-between py-2.5 border-b border-border last:border-b-0">
            <span className="font-medium text-muted-foreground">Mobile Number</span>
            <span className="text-foreground">{user.mobileNumber}</span>
          </div>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-primary text-primary-foreground border-none py-3 rounded-lg text-base font-medium mt-5 hover:bg-primary/90"
      >
        Log Out
      </button>
    </div>
  );
}