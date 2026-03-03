import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Send,
  Users,
} from "lucide-react";
import { getUsers, sendMail } from "../services/resumeService";

export default function UserManagement() {
  // State for users data
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [mailForm, setMailForm] = useState({
    subject: "",
    body: "",
    attachment: null,
  });
  const [errors, setErrors] = useState({
    subject: "",
    body: "",
  });
  
  // Sending mail state
  const [isSending, setIsSending] = useState(false);

  // Refs
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  // API endpoint

  // Fetch users function - using ref to avoid recreating the function
  const fetchUsers = useCallback(
    async (pageNum) => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await getUsers(pageNum, 10, "");

        const newUsers = response.data?.data || [];
        const totalPages = response.data?.totalPages || 1;

        if (pageNum === 1) {
          setUsers(newUsers);
        } else {
          setUsers((prev) => [...prev, ...newUsers]);
        }

        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [],
  );

  // Initial fetch
  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Intersection Observer for infinite scroll

  useEffect(() => {
    if (isLoading || !hasMore) return;
    
    // Prevent setting up observer if already fetching
    if (isFetchingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingRef.current) {
          fetchUsers(page + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading, hasMore, page, fetchUsers]);

  // Handle individual checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.size === users.length && users.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u._id)));
    }
  };

  // Check if all users are selected
  const isAllSelected = users.length > 0 && selectedIds.size === users.length;

  // Check if some (but not all) users are selected
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < users.length;

  // Handle send mail button click
  const handleSendMailClick = () => {
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setMailForm({ subject: "", body: "", attachment: null });
    setErrors({ subject: "", body: "" });
  };

  // Handle form field changes
  const handleSubjectChange = (e) => {
    setMailForm((prev) => ({ ...prev, subject: e.target.value }));
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: "" }));
    }
  };

  const handleBodyChange = (e) => {
    setMailForm((prev) => ({ ...prev, body: e.target.value }));
    if (errors.body) {
      setErrors((prev) => ({ ...prev, body: "" }));
    }
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    setMailForm((prev) => ({ ...prev, attachment: file }));
  };

  // Handle send mail
  const handleSendMail = async () => {
    let hasErrors = false;
    const newErrors = { subject: "", body: "" };

    if (!mailForm.subject.trim()) {
      newErrors.subject = "Subject is required";
      hasErrors = true;
    }

    if (!mailForm.body.trim()) {
      newErrors.body = "Body is required";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      setIsSending(true);
      try {
        // Create recipients array with name and email from selected users
        const recipients = users
          .filter(user => selectedIds.has(user._id))
          .map(user => ({
            name: user.name || '',
            email: user.email || ''
          }))
          .filter(r => r.email); 
        
        if (recipients.length === 0) {
          alert("No valid email addresses found for selected users");
          setIsSending(false);
          return;
        }
        
        await sendMail(recipients, mailForm.subject, mailForm.body, mailForm.attachment);s
        handleCloseModal();
      } catch (error) {
        console.error("Error sending mail:", error);
        alert("Failed to send mail. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "active":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  // Get role badge class
  const getRoleBadge = (role) => {
    const roleLower = (role || "").toLowerCase();
    switch (roleLower) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "moderator":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "user":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading font-bold text-text-primary mb-2">
            User Management
          </h1>
          <p className="text-text-muted text-body-small">
            View and manage platform users
          </p>
        </div>

        {/* Send Mail Button - Shows when users are selected */}
        {selectedIds.size > 0 && (
          <div className="mb-4 flex items-center justify-between bg-surface-dark-light rounded-card p-4 border border-border-primary">
            <span className="text-text-secondary">
              <Users className="inline-block w-5 h-5 mr-2" />
              {selectedIds.size} of {users.length} users selected
            </span>
            <button
              onClick={handleSendMailClick}
              className="bg-brand-primary text-text-primary px-6 py-2 rounded-button font-semibold hover:bg-brand-primary-hover transition-all flex items-center gap-2"
            >
              <Mail size={18} />
              Send Mail
            </button>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-surface-dark-light rounded-card overflow-hidden border border-border-primary">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-dark border-b border-border-primary">
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onChange={handleSelectAll}
                        className="w-5 h-5 rounded border-border-primary bg-surface-dark text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-text-secondary font-semibold text-sm">
                    Name
                  </th>
                  <th className="px-4 py-4 text-left text-text-secondary font-semibold text-sm">
                    Email
                  </th>
                  <th className="px-4 py-4 text-left text-text-secondary font-semibold text-sm">
                    Role
                  </th>
                  <th className="px-4 py-4 text-left text-text-secondary font-semibold text-sm">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-text-secondary font-semibold text-sm">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center text-text-muted">
                        <Users className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-border-primary hover:bg-surface-dark/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(user._id)}
                            onChange={() => handleCheckboxChange(user._id)}
                            className="w-5 h-5 rounded border-border-primary bg-surface-dark text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-text-primary font-medium">
                        {user.name || "-"}
                      </td>
                      <td className="px-4 py-4 text-text-secondary">
                        {user.email || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-button text-xs font-semibold ${getRoleBadge(user.role)}`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-button text-xs font-semibold ${getStatusBadge(user.status)}`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-text-secondary">
                        {formatDate(user.joinedDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sentinel div for infinite scroll */}
          <div ref={sentinelRef} className="h-4" />

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
              <span className="ml-3 text-text-muted">
                Loading more users...
              </span>
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && users.length > 0 && (
            <div className="flex items-center justify-center py-6 text-text-muted">
              <Check className="w-5 h-5 mr-2 text-green-400" />
              All users loaded
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center py-8 text-red-400">
              <X className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Mail Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-dark-light rounded-card p-6 shadow-xl max-w-lg w-full border border-border-primary">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand-primary" />
                  Send Mail
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Recipients info */}
                <div className="bg-surface-dark rounded-button p-3 mb-4">
                  <p className="text-text-muted text-sm">Recipients:</p>
                  <p className="text-text-primary text-sm">
                    {selectedIds.size} user(s) selected
                  </p>
                </div>

                {/* Subject field */}
                <div>
                  <label className="block text-text-secondary text-sm font-semibold mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={mailForm.subject}
                    onChange={handleSubjectChange}
                    className={`w-full px-4 py-3 bg-surface-dark border rounded-button text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ${errors.subject ? "border-red-400" : "border-border-primary"}`}
                    placeholder="Enter subject..."
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Body field */}
                <div>
                  <label className="block text-text-secondary text-sm font-semibold mb-2">
                    Body <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={mailForm.body}
                    onChange={handleBodyChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-surface-dark border rounded-button text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none ${errors.body ? "border-red-400" : "border-border-primary"}`}
                    placeholder="Enter message body..."
                  />
                  {errors.body && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.body}
                    </p>
                  )}
                </div>

                {/* Attachment field */}
                <div>
                  <label className="block text-text-secondary text-sm font-semibold mb-2">
                    Attachment{" "}
                    <span className="text-text-muted">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleAttachmentChange}
                      className="w-full px-4 py-3 bg-surface-dark border border-border-primary rounded-button text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-text-primary hover:file:bg-brand-primary-hover transition-all"
                    />
                    {mailForm.attachment && (
                      <div className="mt-2 flex items-center gap-2 text-text-secondary text-sm">
                        <FileText className="w-4 h-4" />
                        <span>{mailForm.attachment.name}</span>
                        <button
                          onClick={() =>
                            setMailForm((prev) => ({
                              ...prev,
                              attachment: null,
                            }))
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-600 text-text-primary px-4 py-3 rounded-button font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMail}
                  className="flex-1 bg-brand-primary text-text-primary px-4 py-3 rounded-button font-semibold hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Mail
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
