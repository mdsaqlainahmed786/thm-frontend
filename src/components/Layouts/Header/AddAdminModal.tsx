"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/api-services/user";
import { addAdmin } from "@/api-services/user";
import { User } from "@/types/user";
import toast from "react-hot-toast";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce username for search
  const [debouncedUsername, setDebouncedUsername] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 300);
    return () => clearTimeout(timer);
  }, [username]);

  // Fetch users based on search query
  const { data: usersData, isFetching } = useQuery({
    queryKey: ["admin-user-search", debouncedUsername],
    queryFn: () => {
      if (debouncedUsername.trim().length < 2) {
        return null;
      }
      return fetchUsers({
        query: debouncedUsername,
        documentLimit: 10,
        pageNumber: 1,
      });
    },
    enabled: debouncedUsername.trim().length >= 2 && showDropdown,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setPassword("");
      setSelectedUser(null);
      setShowDropdown(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setShowDropdown(true);
    setSelectedUser(null);
  };

  const handleUserSelect = (user: User) => {
    setUsername(user.username);
    setSelectedUser(user);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !password.trim()) {
      toast.error("Please select a user and enter a password");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addAdmin(selectedUser.username, password);
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedUser !== null && password.trim().length > 0;

  if (!isOpen) return null;

  const users = usersData?.data || [];

  return (
    <div className="fixed left-0 top-0 z-999999 flex h-screen w-full items-center justify-center bg-black/60 px-4 py-5 backdrop-blur-sm">
      <div className="relative w-full max-w-180 rounded-lg bg-white shadow-2xl dark:bg-boxdark overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-50 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z"
              fill=""
            ></path>
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Add Administrator
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4.5">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Username <span className="text-red">*</span>
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onFocus={() => {
                    if (username.length >= 2) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="Search for a user..."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                
                {/* Dropdown */}
                {showDropdown && username.length >= 2 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark"
                  >
                    {isFetching ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        Searching...
                      </div>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-meta-4 dark:text-white border-b border-stroke dark:border-strokedark last:border-b-0"
                        >
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.name} {user.email && `• ${user.email}`}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password <span className="text-red">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 pr-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path
                        d="M10 3.75C5.83333 3.75 2.27417 6.34167 0.833333 10C2.27417 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.7258 13.6583 19.1667 10C17.7258 6.34167 14.1667 3.75 10 3.75ZM10 14.5833C7.24167 14.5833 5 12.3417 5 9.58333C5 6.825 7.24167 4.58333 10 4.58333C12.7583 4.58333 15 6.825 15 9.58333C15 12.3417 12.7583 14.5833 10 14.5833ZM10 6.25C8.61667 6.25 7.5 7.36667 7.5 8.75C7.5 10.1333 8.61667 11.25 10 11.25C11.3833 11.25 12.5 10.1333 12.5 8.75C12.5 7.36667 11.3833 6.25 10 6.25Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current"
                    >
                      <path
                        d="M10 3.75C5.83333 3.75 2.27417 6.34167 0.833333 10C2.27417 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.7258 13.6583 19.1667 10C17.7258 6.34167 14.1667 3.75 10 3.75ZM10 14.5833C7.24167 14.5833 5 12.3417 5 9.58333C5 6.825 7.24167 4.58333 10 4.58333C12.7583 4.58333 15 6.825 15 9.58333C15 12.3417 12.7583 14.5833 10 14.5833ZM10 6.25C8.61667 6.25 7.5 7.36667 7.5 8.75C7.5 10.1333 8.61667 11.25 10 11.25C11.3833 11.25 12.5 10.1333 12.5 8.75C12.5 7.36667 11.3833 6.25 10 6.25Z"
                        fill="currentColor"
                      />
                      <path
                        d="M2.5 2.5L17.5 17.5M4.16667 4.16667C2.83333 5.08333 1.66667 6.66667 0.833333 8.75C2.27417 12.4083 5.83333 15 10 15C11.25 15 12.425 14.75 13.4583 14.3333M15.8333 15.8333C14.3333 16.6667 12.25 17.5 10 17.5C5.83333 17.5 2.27417 14.9083 0.833333 11.25C1.66667 9.16667 2.83333 7.58333 4.16667 6.66667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center rounded border border-stroke px-6 py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex justify-center rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;

